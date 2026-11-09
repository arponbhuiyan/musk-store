import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { createServer as createViteServer } from "vite";

// ─── Paths & constants ──────────────────────────────────────────────────────
const ROOT = process.cwd();
const ANALYTICS_FILE = path.join(ROOT, "analytics.json");
const SETTINGS_FILE = path.join(ROOT, "settings.json");
const MAX_JSON_FILE_SIZE = 1024 * 1024; // 1 MB cap on our own JSON files
const PORT = Number(process.env.PORT) || 3000;

// Session token secret — loaded from env, auto-generated on first run if absent
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (() => {
    const generated = crypto.randomBytes(32).toString("hex");
    console.warn(
      "[security] SESSION_SECRET not set in .env — using ephemeral random secret. " +
        "All existing sessions will invalidate on restart. Add SESSION_SECRET=your-secret to .env."
    );
    return generated;
  })();

// ─── File helpers ───────────────────────────────────────────────────────────
function safeReadJSON<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    const stat = fs.statSync(file);
    if (stat.size > MAX_JSON_FILE_SIZE) {
      console.error(`[security] File ${path.basename(file)} exceeds size cap; refusing to read.`);
      return fallback;
    }
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${path.basename(file)}, resetting`, error);
    return fallback;
  }
}

function safeWriteJSON(file: string, data: unknown) {
  try {
    const raw = JSON.stringify(data, null, 2);
    if (Buffer.byteLength(raw, "utf-8") > MAX_JSON_FILE_SIZE) {
      console.error(`[security] Refusing to write ${path.basename(file)}: payload would exceed size cap.`);
      return;
    }
    fs.writeFileSync(file, raw, "utf-8");
  } catch (error) {
    console.error(`Error writing ${path.basename(file)}`, error);
  }
}

// ─── Settings ───────────────────────────────────────────────────────────────
type Settings = {
  ownerWhatsApp: string;
  callmebotApiKey: string;
  customWebhookUrl: string;
  telegramBotToken: string;
  telegramChatId: string;
  telegramChatId2: string;
  autoNotify: boolean;
  adminGmail1: string;
  adminGmail2: string;
  /** bcrypt hash of admin password (never store plaintext) */
  adminPasswordHash: string;
};

const DEFAULT_SETTINGS: Settings = {
  // Admin email whitelist can be overridden via .env
  adminGmail1: process.env.ADMIN_GMAIL_1 || "",
  adminGmail2: process.env.ADMIN_GMAIL_2 || "",
  ownerWhatsApp: process.env.OWNER_WHATSAPP || "",
  callmebotApiKey: "",
  customWebhookUrl: "",
  telegramBotToken: "",
  telegramChatId: "",
  telegramChatId2: "",
  autoNotify: true,
  // IMPORTANT: We only keep a bcrypt hash. Plaintext NEVER touches disk.
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
};

// ─── Analytics type & defaults ──────────────────────────────────────────────
type Analytics = {
  totalVisits: number;
  uniqueVisitors: string[];
  visits: Array<{ visitorId: string; path: string; referrer: string; userAgent: string; timestamp: string }>;
  adminLogins: Array<{
    adminId: string;
    status: string;
    userAgent: string;
    ip: string;
    timestamp: string;
  }>;
  orderNotifications: Array<{
    orderId: string;
    customerName: string;
    totalAmount: number;
    targetPhone: string;
    dispatchedVia: string;
    dispatchStatus: string;
    timestamp: string;
  }>;
};

const DEFAULT_ANALYTICS: Analytics = {
  totalVisits: 0,
  uniqueVisitors: [],
  visits: [],
  adminLogins: [],
  orderNotifications: [],
};

// ─── Database layer (MySQL via DATABASE_URL, falls back to JSON files) ──────
const DATABASE_URL = process.env.DATABASE_URL || "";
let dbPool: mysql.Pool | null = null;
let settingsCache: Settings | null = null;
let analyticsCache: Analytics | null = null;

const KV_TABLE_SQL = `CREATE TABLE IF NOT EXISTS kv (
  \`key\` VARCHAR(255) PRIMARY KEY,
  \`value\` JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

async function dbLoad<T>(key: string, fallback: T): Promise<T> {
  if (!dbPool) return fallback;
  try {
    const [rows] = await dbPool.query<mysql.RowDataPacket[]>("SELECT `value` FROM kv WHERE `key` = ?", [key]);
    if (Array.isArray(rows) && rows.length > 0) {
      const v = (rows[0] as any).value;
      return (typeof v === "string" ? JSON.parse(v) : v) as T;
    }
  } catch (e) {
    console.error(`[db] Failed to load ${key}:`, e);
  }
  return fallback;
}

function dbSave(key: string, value: unknown) {
  if (!dbPool) return;
  dbPool
    .query(
      "INSERT INTO kv (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
      [key, JSON.stringify(value)]
    )
    .catch((e) => console.error(`[db] Failed to save ${key}:`, e));
}

async function initDB() {
  if (!DATABASE_URL) {
    settingsCache = readSettingsFromFile();
    analyticsCache = readAnalyticsFromFile();
    console.log("[db] No DATABASE_URL — using local JSON files.");
    return;
  }
  try {
    // Parse DATABASE_URL manually so ssl options are reliably applied
    const dbUrl = new URL(DATABASE_URL);
    dbPool = mysql.createPool({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port || "3306", 10),
      user: decodeURIComponent(dbUrl.username),
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1) || "test",
      ssl: { rejectUnauthorized: true, minVersion: "TLSv1.2" },
      waitForConnections: true,
      connectionLimit: 10,
      enableKeepAlive: true,
    });
    await dbPool.query(KV_TABLE_SQL);
    settingsCache = await dbLoad<Settings>("settings", { ...DEFAULT_SETTINGS });
    analyticsCache = await dbLoad<Analytics>("analytics", { ...DEFAULT_ANALYTICS });
    console.log("[db] Connected to MySQL — settings & analytics loaded from DB.");
  } catch (e) {
    console.error("[db] MySQL connection failed, falling back to JSON files:", e);
    dbPool = null;
    settingsCache = readSettingsFromFile();
    analyticsCache = readAnalyticsFromFile();
  }
}

// ─── Settings (sync — served from in-memory cache) ─────────────────────────
function readSettingsFromFile(): Settings {
  const onDisk = safeReadJSON<Partial<Settings>>(SETTINGS_FILE, {});
  return { ...DEFAULT_SETTINGS, ...onDisk };
}

function writeSettingsToFile(data: Settings) {
  safeWriteJSON(SETTINGS_FILE, data);
}

function readSettings(): Settings {
  return settingsCache ?? { ...DEFAULT_SETTINGS };
}

function writeSettings(data: Partial<Settings>) {
  const merged: Settings = { ...(settingsCache ?? DEFAULT_SETTINGS), ...data } as Settings;
  settingsCache = merged;
  dbSave("settings", merged);
  if (!dbPool) writeSettingsToFile(merged);
}

// ─── Analytics ──────────────────────────────────────────────────────────────
function readAnalyticsFromFile(): Analytics {
  return safeReadJSON<Analytics>(ANALYTICS_FILE, DEFAULT_ANALYTICS);
}

function writeAnalyticsToFile(data: Analytics) {
  safeWriteJSON(ANALYTICS_FILE, data);
}

function readAnalytics(): Analytics {
  return analyticsCache ?? { ...DEFAULT_ANALYTICS };
}
function writeAnalytics(data: Analytics) {
  analyticsCache = data;
  dbSave("analytics", data);
  if (!dbPool) writeAnalyticsToFile(data);
}

// ─── Session tokens (HMAC-signed, stateless, built-in crypto) ──────────────
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function signSession(email: string): string {
  const payload = {
    sub: email,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

function verifySession(token: string): { email: string } | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(body)
      .digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp < Date.now()) return null;
    return { email: payload.sub as string };
  } catch {
    return null;
  }
}

// ─── Auth middleware (protects sensitive endpoints) ─────────────────────────
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : (req.cookies as any)?.musk_session;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
  (req as any).adminEmail = session.email;
  next();
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function normalizePhone(rawPhone?: string): string {
  let phone = (rawPhone || "").replace(/\D/g, "");
  if (phone.startsWith("01") && phone.length === 11) phone = "88" + phone;
  return phone;
}

function isValidCallMeBotKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 3) return false;
  if (
    trimmed.toLowerCase().includes("allow") ||
    trimmed.toLowerCase().includes("callmebot") ||
    trimmed.includes(" ")
  )
    return false;
  return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

function sanitizeString(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen).replace(/[\u0000-\u001F\u007F]/g, "");
}

// ─── Rate limiters ──────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
  keyGenerator: (req) => {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown"
    );
  },
});

// ─── Server startup ────────────────────────────────────────────────────────
async function startServer() {
  await initDB();

  const app = express();
  const isProd = process.env.NODE_ENV === "production";

  // Security headers — Helmet. The crossOriginOpenerPolicy is relaxed because
  // Vite dev server injects HMR scripts. CSP is permissive in dev mode.
  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
              fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
              imgSrc: ["'self'", "data:", "https:", "http:"],
              connectSrc: ["'self'", "api.callmebot.com", "api.telegram.org"],
            },
          }
        : undefined, // Vite manages its own CSP in dev
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })
  );

  // CORS — restrict in production, permissive only on localhost for dev
  const allowedOrigins = isProd
    ? (process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) || [])
    : [/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];
  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,
      credentials: true,
    })
  );

  // Body parser with strict size cap (prevents DoS via huge POST bodies)
  app.use(express.json({ limit: "200kb" }));
  app.use(express.urlencoded({ extended: true, limit: "200kb" }));

  // Trust first proxy so X-Forwarded-For works behind reverse proxies
  app.set("trust proxy", 1);

  // ─── Public routes ────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) =>
    res.json({
      status: "ok",
      uptime: process.uptime(),
      storage: dbPool ? "mysql" : DATABASE_URL ? "mysql-disconnected" : "json-files",
    }),
  );

  // Track admin login audit (called from client-side login form — public write)
  app.post("/api/analytics/track-login", (req, res) => {
    const adminId = sanitizeString(req.body?.adminId, 200);
    const status = sanitizeString(req.body?.status, 100) || "Unknown";
    if (!adminId) return res.status(400).json({ error: "adminId is required" });
    const data = readAnalytics();
    data.adminLogins.unshift({
      adminId,
      status,
      userAgent: (req.headers["user-agent"] as string) || "",
      ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
      timestamp: new Date().toISOString(),
    });
    if (data.adminLogins.length > 100) data.adminLogins = data.adminLogins.slice(0, 100);
    writeAnalytics(data);
    res.json({ success: true });
  });

  // Analytics tracking endpoint — visitor-side, only accepts safe fields
  app.post("/api/analytics/track-visit", (req, res) => {
    const visitorId = sanitizeString(req.body?.visitorId, 100);
    if (!visitorId) return res.status(400).json({ error: "visitorId is required" });
    const pagePath = sanitizeString(req.body?.path, 200);
    const referrer = sanitizeString(req.body?.referrer, 500);
    const userAgent = sanitizeString(req.body?.userAgent, 500);

    const data = readAnalytics();
    data.totalVisits = (data.totalVisits || 0) + 1;
    if (!data.uniqueVisitors.includes(visitorId)) data.uniqueVisitors.push(visitorId);
    data.visits.unshift({
      visitorId,
      path: pagePath || "/",
      referrer,
      userAgent: userAgent || (req.headers["user-agent"] as string) || "",
      timestamp: new Date().toISOString(),
    });
    if (data.visits.length > 200) data.visits = data.visits.slice(0, 200);
    writeAnalytics(data);
    res.json({
      success: true,
      totalVisits: data.totalVisits,
      uniqueCount: data.uniqueVisitors.length,
    });
  });

  app.get("/api/notifications/latest", (req, res) => {
    const data = readAnalytics();
    const notifications = data.orderNotifications || [];
    res.json({ latest: notifications[0] || null, recent: notifications.slice(0, 10) });
  });

  // ─── Admin login (rate-limited) ────────────────────────────────────────────
  app.post("/api/admin/verify-login", loginLimiter, async (req, res) => {
    try {
      const email = sanitizeString(req.body?.email, 200).trim().toLowerCase();
      const password = String(req.body?.password || "");

      if (!email) return res.status(400).json({ success: false, error: "Email is required." });
      if (!password) return res.status(400).json({ success: false, error: "Password is required." });

      const settings = readSettings();
      const allowedGmails = [
        settings.adminGmail1?.trim().toLowerCase(),
        settings.adminGmail2?.trim().toLowerCase(),
      ].filter(Boolean);

      const data = readAnalytics();

      if (!allowedGmails.includes(email)) {
        data.adminLogins.unshift({
          adminId: email,
          status: "Denied: Non-Authorized Gmail",
          userAgent: (req.headers["user-agent"] as string) || "",
          ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
          timestamp: new Date().toISOString(),
        });
        if (data.adminLogins.length > 100) data.adminLogins = data.adminLogins.slice(0, 100);
        writeAnalytics(data);
        return res.status(403).json({ success: false, error: "Access denied." });
      }

      const expectedHash = settings.adminPasswordHash;
      let ok = false;
      if (expectedHash) {
        ok = await bcrypt.compare(password, expectedHash);
      } else {
        // FIRST-TIME BOOTSTRAP: if no hash exists yet and ADMIN_PASSWORD env var is set,
        // we accept the plaintext match ONCE and immediately overwrite with its hash.
        const expectedPlain = process.env.ADMIN_PASSWORD || "";
        if (expectedPlain && password === expectedPlain) {
          ok = true;
          const newHash = await bcrypt.hash(password, 12);
          writeSettings({ adminPasswordHash: newHash });
          console.info("[security] Admin password hashed and stored for future logins.");
        }
      }

      if (!ok) {
        data.adminLogins.unshift({
          adminId: email,
          status: "Failed: Incorrect Password",
          userAgent: (req.headers["user-agent"] as string) || "",
          ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
          timestamp: new Date().toISOString(),
        });
        if (data.adminLogins.length > 100) data.adminLogins = data.adminLogins.slice(0, 100);
        writeAnalytics(data);
        return res.status(401).json({ success: false, error: "Invalid credentials." });
      }

      // Success — issue a signed session token
      const token = signSession(email);
      data.adminLogins.unshift({
        adminId: email,
        status: "Success (Gmail Auth)",
        userAgent: (req.headers["user-agent"] as string) || "",
        ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
        timestamp: new Date().toISOString(),
      });
      if (data.adminLogins.length > 100) data.adminLogins = data.adminLogins.slice(0, 100);
      writeAnalytics(data);

      // HttpOnly cookie + Authorization header (frontend reads the header)
      res.cookie("musk_session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: SESSION_TTL_MS,
      });

      return res.json({
        success: true,
        email,
        role: "Store Administrator",
        slot: email === allowedGmails[0] ? "Primary Admin" : "Secondary Admin",
        token,
        expiresIn: SESSION_TTL_MS,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "Login server error." });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("musk_session");
    res.json({ success: true });
  });

  // ─── PROTECTED routes below this line ──────────────────────────────────────
  app.use("/api/admin/me", requireAdmin, (req, res) => {
    res.json({ email: (req as any).adminEmail });
  });

  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body || {};
      const cur = String(currentPassword || "");
      const next = String(newPassword || "").trim();
      if (!cur || !next) return res.status(400).json({ success: false, error: "Both current and new password are required." });
      if (next.length < 8) return res.status(400).json({ success: false, error: "New password must be at least 8 characters." });

      const settings = readSettings();
      const expectedHash = settings.adminPasswordHash;
      let ok = false;
      if (expectedHash) {
        ok = await bcrypt.compare(cur, expectedHash);
      } else {
        const expectedPlain = process.env.ADMIN_PASSWORD || "";
        ok = expectedPlain ? cur === expectedPlain : false;
      }
      if (!ok) return res.status(401).json({ success: false, error: "Current password is incorrect." });

      const newHash = await bcrypt.hash(next, 12);
      writeSettings({ adminPasswordHash: newHash });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "Failed to change password." });
    }
  });

  app.get("/api/analytics/stats", requireAdmin, (_req, res) => {
    const data = readAnalytics();
    res.json({
      totalVisits: data.totalVisits || 0,
      uniqueVisitorsCount: data.uniqueVisitors?.length || 0,
      visits: data.visits || [],
      adminLogins: data.adminLogins || [],
      orderNotifications: data.orderNotifications || [],
    });
  });

  app.get("/api/notifications/settings", requireAdmin, (_req, res) => {
    // Strip sensitive hashes / tokens before returning to client
    const s = readSettings();
    const safe: Record<string, unknown> = { ...s };
    // Show masked values for secrets so admin knows if something is configured
    safe.callmebotApiKey = s.callmebotApiKey ? "********" : "";
    safe.telegramBotToken = s.telegramBotToken ? "********" : "";
    safe.adminPasswordHash = s.adminPasswordHash ? "********" : "";
    return res.json(safe);
  });

  app.post("/api/notifications/settings", requireAdmin, (req, res) => {
    const current = readSettings();
    const incoming = req.body || {};

    // Only merge known, safe fields
    const patch: Partial<Settings> = {};
    if (typeof incoming.ownerWhatsApp === "string") patch.ownerWhatsApp = normalizePhone(incoming.ownerWhatsApp);
    if (typeof incoming.callmebotApiKey === "string") patch.callmebotApiKey = sanitizeString(incoming.callmebotApiKey, 200).trim();
    if (typeof incoming.customWebhookUrl === "string") patch.customWebhookUrl = sanitizeString(incoming.customWebhookUrl, 500).trim();
    if (typeof incoming.telegramBotToken === "string") patch.telegramBotToken = sanitizeString(incoming.telegramBotToken, 200).trim();
    if (typeof incoming.telegramChatId === "string") patch.telegramChatId = sanitizeString(incoming.telegramChatId, 100).trim();
    if (typeof incoming.telegramChatId2 === "string") patch.telegramChatId2 = sanitizeString(incoming.telegramChatId2, 100).trim();
    if (typeof incoming.autoNotify === "boolean") patch.autoNotify = incoming.autoNotify;
    if (typeof incoming.adminGmail1 === "string") patch.adminGmail1 = sanitizeString(incoming.adminGmail1, 200).trim().toLowerCase();
    if (typeof incoming.adminGmail2 === "string") patch.adminGmail2 = sanitizeString(incoming.adminGmail2, 200).trim().toLowerCase();

    writeSettings(patch);
    res.json({ success: true });
  });

  app.post("/api/notifications/test-callmebot", requireAdmin, async (req, res) => {
    try {
      const settings = readSettings();
      const phone = normalizePhone(req.body?.phone || settings.ownerWhatsApp);
      const rawKey = (req.body?.apikey || settings.callmebotApiKey || "").trim();

      if (!phone) return res.status(400).json({ success: false, error: "Phone number required." });
      if (!rawKey)
        return res.status(400).json({ success: false, error: "API Key is empty." });
      if (!isValidCallMeBotKey(rawKey))
        return res.status(400).json({
          success: false,
          error: "Invalid API Key format. Use the numeric key from CallMeBot.",
        });

      const testMsg = `🛍️ *THE MUSK - Test Notification*\n\nYour CallMeBot WhatsApp gateway is connected to +${phone}!`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        phone
      )}&text=${encodeURIComponent(testMsg)}&apikey=${encodeURIComponent(rawKey)}`;

      const response = await fetch(url);
      const text = await response.text();
      const clean = text.replace(/<[^>]*>/g, "").trim();

      if (text.includes("ERROR:") || text.toLowerCase().includes("error")) {
        return res.json({ success: false, message: clean || "CallMeBot returned an error." });
      }
      res.json({ success: true, message: clean || "Test message dispatched." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || "Failed to reach CallMeBot." });
    }
  });

  app.post("/api/notifications/test-telegram", requireAdmin, async (req, res) => {
    try {
      const settings = readSettings();
      const token = (req.body?.token || settings.telegramBotToken || "").trim();
      const rawChatId = (req.body?.chatId || settings.telegramChatId || "").trim();
      const rawChatId2 = (req.body?.chatId2 || settings.telegramChatId2 || "").trim();
      const chatList = [
        { label: "Device 1", id: rawChatId },
        { label: "Device 2", id: rawChatId2 },
      ].filter((d) => Boolean(d.id));

      if (!token || chatList.length === 0)
        return res.status(400).json({
          success: false,
          error: "Telegram Bot Token and at least one Chat ID are required.",
        });

      const results: { label: string; id: string; success: boolean; message?: string }[] = [];
      for (const target of chatList) {
        try {
          const msg = `🛍️ *THE MUSK - Dual Device Alert Test*\n\nBot is linked and active on this phone!\n\n📱 *Channel:* ${target.label}\n🆔 *Chat ID:* \`${target.id}\``;
          const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;
          const tgRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: target.id, text: msg, parse_mode: "Markdown" }),
          });
          const data = (await tgRes.json()) as any;
          if (data?.ok) {
            results.push({ label: target.label, id: target.id, success: true, message: `✅ ${target.label}: Sent!` });
          } else {
            results.push({
              label: target.label,
              id: target.id,
              success: false,
              message: `❌ ${target.label}: ${data?.description || "Unknown error"}`,
            });
          }
        } catch (err: any) {
          results.push({ label: target.label, id: target.id, success: false, message: `❌ ${target.label}: ${err?.message || "Failed"}` });
        }
      }
      return res.json({
        success: results.some((r) => r.success),
        allSuccess: results.every((r) => r.success),
        message: results.map((r) => r.message).join("\n"),
        results,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Network error." });
    }
  });

  app.post("/api/notifications/telegram-detect-chat", requireAdmin, async (req, res) => {
    try {
      const settings = readSettings();
      const token = (req.body?.token || settings.telegramBotToken || "").trim();
      if (!token)
        return res.status(400).json({ success: false, error: "Provide your Telegram Bot Token." });

      const meRes = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/getMe`);
      const meData = (await meRes.json()) as any;
      if (!meData?.ok) return res.json({ success: false, error: meData?.description || "Invalid Bot Token." });

      const botUsername = meData.result?.username || "";
      const botName = meData.result?.first_name || "Bot";
      const botUrl = `https://t.me/${botUsername}`;

      const updatesRes = await fetch(
        `https://api.telegram.org/bot${encodeURIComponent(token)}/getUpdates?limit=25`
      );
      const updatesData = (await updatesRes.json()) as any;
      const detected: { id: string; name: string; username?: string }[] = [];
      const seen = new Set<string>();

      if (updatesData?.ok && Array.isArray(updatesData.result)) {
        for (let i = updatesData.result.length - 1; i >= 0; i--) {
          const upd = updatesData.result[i];
          const chat = upd.message?.chat || upd.channel_post?.chat || upd.my_chat_member?.chat;
          if (chat && chat.id && !seen.has(String(chat.id))) {
            seen.add(String(chat.id));
            const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(" ");
            detected.push({
              id: String(chat.id),
              name: fullName || chat.username || `User ${chat.id}`,
              username: chat.username,
            });
          }
        }
      }

      if (detected.length > 0) {
        return res.json({
          success: true,
          botUsername,
          botName,
          botUrl,
          chats: detected,
          chatId: detected[0].id,
          senderName: detected[0].name,
          chatId2: detected[1]?.id,
          senderName2: detected[1]?.name,
          message: `Found ${detected.length} active device chat(s)!`,
        });
      }
      return res.json({
        success: false,
        needsStart: true,
        botUsername,
        botName,
        botUrl,
        error: `Bot @${botUsername} found — press START on both devices, then re-detect.`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Connection failed." });
    }
  });

  // Automated WhatsApp dispatch — accepts order payload from front-end
  // This one is called on checkout; we keep it public but validate input strictly
  app.post("/api/notifications/whatsapp-order", async (req, res) => {
    try {
      const order = req.body?.order;
      if (!order || typeof order !== "object")
        return res.status(400).json({ error: "Order details required." });

      // Sanitize every field we use
      const sanitizedOrder = {
        id: sanitizeString(order.id, 50),
        trackingNumber: sanitizeString(order.trackingNumber, 50),
        fullName: sanitizeString(order.fullName, 200),
        phone: sanitizeString(order.phone, 50),
        address: sanitizeString(order.address, 300),
        city: sanitizeString(order.city, 100),
        postalCode: sanitizeString(order.postalCode, 20),
        paymentMethod: sanitizeString(order.paymentMethod, 50),
        senderNumber: sanitizeString(order.senderNumber, 50),
        transactionCode: sanitizeString(order.transactionCode, 100),
        subtotal: Number(order.subtotal) || 0,
        discountAmount: Number(order.discountAmount) || 0,
        deliveryCharge: Number(order.deliveryCharge) || 0,
        totalAmount: Number(order.totalAmount) || 0,
        items: Array.isArray(order.items) ? order.items.slice(0, 50) : [],
      };

      const settings = readSettings();
      const phone = normalizePhone(settings.ownerWhatsApp);
      if (!phone) {
        return res.status(503).json({ success: false, error: "Owner WhatsApp not configured." });
      }

      const itemsList = sanitizedOrder.items
        .map((it: any, idx: number) => {
          const productName = sanitizeString(it?.productName, 200);
          const selectedColor = sanitizeString(it?.selectedColor, 100) || "Default";
          const quantity = Number(it?.quantity) || 0;
          const price = Number(it?.price) || 0;
          return `${idx + 1}. *${productName}* (${selectedColor}) x${quantity} = ৳${(price * quantity).toLocaleString()}`;
        })
        .join("\n");

      const paymentInfo = sanitizedOrder.paymentMethod === "Cash On Delivery"
        ? "💵 Payment: Cash On Delivery"
        : `💳 Payment: ${sanitizedOrder.paymentMethod}\n📲 Sender: ${sanitizedOrder.senderNumber || "N/A"}\n🔖 TrxID: ${sanitizedOrder.transactionCode || "N/A"}`;

      const message =
`🛍️ *AUTOMATED NEW ORDER ALERT - THE MUSK*
━━━━━━━━━━━━━━━━━━
📦 *Order ID:* ${sanitizedOrder.id}
🔢 *Tracking:* ${sanitizedOrder.trackingNumber}
👤 *Customer:* ${sanitizedOrder.fullName}
📞 *Phone:* ${sanitizedOrder.phone}
📍 *Address:* ${sanitizedOrder.address}, ${sanitizedOrder.city} - ${sanitizedOrder.postalCode}

🛒 *Items Ordered:*
${itemsList}

💰 *Subtotal:* ৳${sanitizedOrder.subtotal.toLocaleString()}
${sanitizedOrder.discountAmount ? `🎟️ *Discount:* -৳${sanitizedOrder.discountAmount.toLocaleString()}\n` : ""}🚚 *Delivery:* ৳${sanitizedOrder.deliveryCharge.toLocaleString()}
🏷️ *Grand Total:* ৳${sanitizedOrder.totalAmount.toLocaleString()}

${paymentInfo}
━━━━━━━━━━━━━━━━━━
⚡ *Automatic Website Dispatch*`;

      let dispatchedVia = "Server Log";
      let dispatchStatus = "Logged in Admin Portal";

      // 1. CallMeBot WhatsApp
      const rawKey = (settings.callmebotApiKey || "").trim();
      if (rawKey && isValidCallMeBotKey(rawKey)) {
        try {
          const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
            phone
          )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(rawKey)}`;
          const response = await fetch(url);
          const text = await response.text();
          if (text.includes("ERROR:") || text.toLowerCase().includes("error")) {
            dispatchedVia = "CallMeBot Gateway";
            dispatchStatus = `API Error`;
          } else {
            dispatchedVia = "CallMeBot Direct WhatsApp";
            dispatchStatus = "Delivered";
          }
        } catch {
          dispatchedVia = "CallMeBot Gateway";
          dispatchStatus = "Network Error";
        }
      }

      // 2. Telegram (multiple devices)
      if (settings.telegramBotToken) {
        const chatIds = Array.from(
          new Set(
            [settings.telegramChatId, settings.telegramChatId2]
              .filter(Boolean)
              .flatMap((id: string) => id.split(/[,;\s]+/))
              .map((id) => sanitizeString(id, 100).trim())
              .filter((id) => id.length > 0)
          )
        );
        if (chatIds.length > 0) {
          const tgResults = await Promise.allSettled(
            chatIds.map((cid) =>
              fetch(
                `https://api.telegram.org/bot${encodeURIComponent(
                  settings.telegramBotToken.trim()
                )}/sendMessage`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chat_id: cid, text: message }),
                }
              )
            )
          );
          if (tgResults.some((r) => r.status === "fulfilled")) {
            const tag = chatIds.length > 1 ? `Telegram (${chatIds.length} Devices)` : "Telegram";
            dispatchedVia = dispatchedVia === "Server Log" ? tag : `${dispatchedVia} + ${tag}`;
            dispatchStatus = "Delivered";
          }
        }
      }

      // 3. Custom webhook
      if (settings.customWebhookUrl) {
        try {
          await fetch(settings.customWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, message, order: sanitizedOrder }),
            signal: AbortSignal.timeout(8000),
          });
          dispatchedVia = dispatchedVia === "Server Log" ? "Custom Webhook" : `${dispatchedVia} + Webhook`;
          dispatchStatus = "Dispatched";
        } catch (hookErr) {
          console.warn("[Auto Notification] Webhook error:", hookErr);
        }
      }

      // Record in analytics (capped)
      const analytics = readAnalytics();
      analytics.orderNotifications.unshift({
        orderId: sanitizedOrder.id,
        customerName: sanitizedOrder.fullName,
        totalAmount: sanitizedOrder.totalAmount,
        targetPhone: phone,
        dispatchedVia,
        dispatchStatus,
        timestamp: new Date().toISOString(),
      });
      if (analytics.orderNotifications.length > 50)
        analytics.orderNotifications = analytics.orderNotifications.slice(0, 50);
      writeAnalytics(analytics);

      res.json({
        success: true,
        orderId: sanitizedOrder.id,
        dispatchedVia,
        dispatchStatus,
        targetPhone: phone,
        previewUrl: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to dispatch notification." });
    }
  });

  // ─── SPA serving ──────────────────────────────────────────────────────────
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(ROOT, "dist");
    app.use(express.static(distPath, { maxAge: "7d", index: false }));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found" });
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[server] Unhandled error:", err);
    res.status(err.status || 500).json({ error: isProd ? "Server error" : err?.message || "Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (${isProd ? "production" : "dev"})`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
