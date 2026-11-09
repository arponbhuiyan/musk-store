/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  listDriveFiles,
  uploadMultipartToDrive,
  updateDriveFileContent,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDrive';
import {
  HardDrive,
  Upload,
  RefreshCw,
  Trash2,
  ExternalLink,
  Search,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Folder,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  CloudUpload,
  Save,
  X
} from 'lucide-react';

interface GoogleDriveManagerProps {
  mode?: 'admin' | 'customer';
}

interface PendingConfirmation {
  type: 'delete' | 'overwrite';
  title: string;
  description: string;
  itemsList: string[];
  onConfirm: () => Promise<void>;
}

export const GoogleSignInButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}> = ({ onClick, disabled, label = 'Sign in with Google' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="gsi-material-button"
  >
    <div className="gsi-material-button-state"></div>
    <div className="gsi-material-button-content-wrapper">
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ display: 'block' }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
      </div>
      <span className="gsi-material-button-contents">{label}</span>
      <span style={{ display: 'none' }}>{label}</span>
    </div>
  </button>
);

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({ mode = 'admin' }) => {
  const { products, orders, coupons, loginUser } = useApp();

  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Explicit confirmation modal state for destructive/mutating operations
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmation | null>(null);
  const [isExecutingConfirm, setIsExecutingConfirm] = useState<boolean>(false);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage((prev) => (prev?.text === text ? null : prev));
    }, 5000);
  };

  const fetchFiles = useCallback(async (query?: string) => {
    setIsLoadingFiles(true);
    try {
      const items = await listDriveFiles(query);
      setFiles(items);
      setNeedsAuth(false);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') {
        setNeedsAuth(true);
      } else {
        showNotice('error', err?.message || 'Could not fetch Google Drive files.');
      }
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
        setNeedsAuth(false);
        fetchFiles();
      },
      () => {
        setGoogleUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [fetchFiles]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setNeedsAuth(false);
        if (result.user.email) {
          loginUser({
            fullName: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email
          });
        }
        await fetchFiles(searchQuery);
        showNotice('success', `Connected to Google Drive as ${result.user.email}`);
      }
    } catch (err: any) {
      showNotice('error', err?.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setNeedsAuth(true);
    setFiles([]);
    setSelectedFileIds([]);
    showNotice('success', 'Disconnected from Google Drive.');
  };

  // Backup Store Data JSON to Drive
  const handleBackupStoreJson = async () => {
    setIsUploading(true);
    try {
      const dateStamp = new Date().toISOString().split('T')[0];
      const fileName = `THE-MUSK-Store-Backup-${dateStamp}.json`;
      const backupPayload = {
        store: 'THE MUSK - Technology For Smartness',
        exportedAt: new Date().toISOString(),
        exportedBy: googleUser?.email || 'Store Admin',
        counts: {
          products: products.length,
          orders: orders.length,
          coupons: coupons.length
        },
        products,
        orders,
        coupons
      };
      const created = await uploadMultipartToDrive(
        fileName,
        JSON.stringify(backupPayload, null, 2),
        'application/json'
      );
      showNotice('success', `Saved "${created.name}" to your Google Drive!`);
      await fetchFiles(searchQuery);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') setNeedsAuth(true);
      else showNotice('error', err?.message || 'Failed to save backup to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  // Export Orders CSV to Drive
  const handleExportOrdersCsv = async () => {
    setIsUploading(true);
    try {
      const dateStamp = new Date().toISOString().split('T')[0];
      const fileName = `THE-MUSK-Orders-${dateStamp}.csv`;
      const headers = [
        'Order ID',
        'Tracking Number',
        'Date',
        'Customer Name',
        'Phone',
        'Email',
        'City',
        'Address',
        'Payment Method',
        'Payment Status',
        'Order Status',
        'Total Amount (BDT)'
      ];
      const rows = orders.map((o) => [
        o.id,
        o.trackingNumber,
        new Date(o.createdAt).toLocaleDateString(),
        `"${(o.fullName || '').replace(/"/g, '""')}"`,
        `"${(o.phone || '').replace(/"/g, '""')}"`,
        `"${(o.email || '').replace(/"/g, '""')}"`,
        `"${(o.city || '').replace(/"/g, '""')}"`,
        `"${(o.address || '').replace(/"/g, '""')}"`,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        String(o.totalAmount)
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const created = await uploadMultipartToDrive(fileName, csvContent, 'text/csv');
      showNotice('success', `Exported "${created.name}" (${orders.length} orders) to Google Drive!`);
      await fetchFiles(searchQuery);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') setNeedsAuth(true);
      else showNotice('error', err?.message || 'Failed to export orders CSV to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload any user-selected file to Google Drive
  const handleFileInputUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const created = await uploadMultipartToDrive(
        file.name,
        file,
        file.type || 'application/octet-stream'
      );
      showNotice('success', `Uploaded "${created.name}" to Google Drive!`);
      await fetchFiles(searchQuery);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') setNeedsAuth(true);
      else showNotice('error', err?.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Request explicit confirmation before overwriting an existing file on Google Drive
  const requestOverwriteFileWithBackup = (file: DriveFileItem) => {
    setPendingConfirm({
      type: 'overwrite',
      title: `Overwrite "${file.name}" in Google Drive?`,
      description:
        'This will replace the existing contents of this file in your Google Drive with the latest store backup data (products, orders, and coupons).',
      itemsList: [file.name],
      onConfirm: async () => {
        const backupPayload = {
          store: 'THE MUSK - Technology For Smartness',
          updatedAt: new Date().toISOString(),
          products,
          orders,
          coupons
        };
        await updateDriveFileContent(
          file.id,
          file.name,
          JSON.stringify(backupPayload, null, 2),
          'application/json'
        );
        showNotice('success', `Updated "${file.name}" in Google Drive.`);
        await fetchFiles(searchQuery);
      }
    });
  };

  // Request explicit confirmation before deleting 1 or more files from Google Drive
  const requestDeleteFiles = (targetFiles: DriveFileItem[]) => {
    if (targetFiles.length === 0) return;
    setPendingConfirm({
      type: 'delete',
      title:
        targetFiles.length === 1
          ? `Delete "${targetFiles[0].name}" from Google Drive?`
          : `Delete ${targetFiles.length} files from Google Drive?`,
      description:
        'This action permanently deletes the selected file(s) from your Google Drive and cannot be undone.',
      itemsList: targetFiles.map((f) => f.name),
      onConfirm: async () => {
        for (const f of targetFiles) {
          await deleteDriveFile(f.id);
        }
        setSelectedFileIds((prev) =>
          prev.filter((id) => !targetFiles.some((tf) => tf.id === id))
        );
        showNotice(
          'success',
          `Deleted ${targetFiles.length} file(s) from Google Drive.`
        );
        await fetchFiles(searchQuery);
      }
    });
  };

  const executeConfirmedAction = async () => {
    if (!pendingConfirm) return;
    setIsExecutingConfirm(true);
    try {
      await pendingConfirm.onConfirm();
      setPendingConfirm(null);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') {
        setNeedsAuth(true);
        setPendingConfirm(null);
      } else {
        showNotice('error', err?.message || 'Operation failed.');
      }
    } finally {
      setIsExecutingConfirm(false);
    }
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatBytes = (sizeStr?: string) => {
    if (!sizeStr) return 'Google Doc / Folder';
    const bytes = Number(sizeStr);
    if (isNaN(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder size={18} className="text-amber-500" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv'))
      return <FileSpreadsheet size={18} className="text-emerald-600" />;
    if (mimeType.includes('json') || mimeType.includes('javascript'))
      return <FileCode size={18} className="text-cyan-600" />;
    if (mimeType.includes('image')) return <ImageIcon size={18} className="text-purple-600" />;
    return <FileText size={18} className="text-blue-600" />;
  };

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HardDrive size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-950 leading-tight">
                Google Drive Cloud Workspace
              </h3>
              <p className="text-xs text-gray-500">
                {mode === 'admin'
                  ? 'Backup store catalog & orders, upload product assets, and manage files in your Google Drive.'
                  : 'Access your Google Drive files, save order invoices, and manage cloud documents.'}
              </p>
            </div>
          </div>
        </div>

        {!needsAuth && googleUser && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono font-semibold text-blue-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{googleUser.email}</span>
            </div>
            <button
              type="button"
              onClick={handleGoogleDisconnect}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut size={13} />
              Disconnect Drive
            </button>
          </div>
        )}
      </div>

      {/* Status Notice Banner */}
      {statusMessage && (
        <div
          className={`mt-5 p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Auth Gate: Official "Sign in with Google" Button */}
      {needsAuth ? (
        <div className="py-12 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <HardDrive size={28} />
          </div>
          <h4 className="text-base font-extrabold text-gray-900 mb-2">
            Connect Your Google Drive Account
          </h4>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Sign in with your Google account to browse your Google Drive files, upload store assets, and back up orders or product catalogs directly to Google Drive.
          </p>
          <div className="flex justify-center">
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              label={isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Action Toolbar: Store Backups & File Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleBackupStoreJson}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all cursor-pointer shadow-xs"
            >
              <Save size={15} className="text-primary" />
              {isUploading ? 'Saving to Drive...' : 'Backup Store JSON to Drive'}
            </button>

            <button
              type="button"
              onClick={handleExportOrdersCsv}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet size={15} />
              {isUploading ? 'Exporting...' : `Export Orders CSV (${orders.length})`}
            </button>

            <label className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all cursor-pointer shadow-xs">
              <CloudUpload size={15} />
              <span>{isUploading ? 'Uploading...' : 'Upload File to Drive'}</span>
              <input
                type="file"
                onChange={handleFileInputUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Search & Bulk Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchFiles(searchQuery);
              }}
              className="flex-1 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files in your Google Drive..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isLoadingFiles}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => fetchFiles(searchQuery)}
                disabled={isLoadingFiles}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
                title="Refresh Google Drive files"
              >
                <RefreshCw size={15} className={isLoadingFiles ? 'animate-spin' : ''} />
              </button>
            </form>

            {selectedFileIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const targets = files.filter((f) => selectedFileIds.includes(f.id));
                  requestDeleteFiles(targets);
                }}
                className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedFileIds.length})
              </button>
            )}
          </div>

          {/* Files Table */}
          <div className="border border-gray-150 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-150 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4 w-8">
                      <input
                        type="checkbox"
                        checked={files.length > 0 && selectedFileIds.length === files.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFileIds(files.map((f) => f.id));
                          } else {
                            setSelectedFileIds([]);
                          }
                        }}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Modified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingFiles ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
                        Loading your Google Drive files...
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
                        No files found in your Google Drive matching this view.
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedFileIds.includes(file.id)}
                            onChange={() => toggleSelectFile(file.id)}
                            className="rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(file.mimeType)}
                            <span className="truncate max-w-[260px] sm:max-w-[360px]" title={file.name}>
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                          {formatBytes(file.size)}
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Open in Google Drive"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {file.mimeType.includes('json') && (
                              <button
                                type="button"
                                onClick={() => requestOverwriteFileWithBackup(file)}
                                className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Overwrite with latest store backup"
                              >
                                <Upload size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => requestDeleteFiles([file])}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete file from Google Drive"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Destructive / Mutating Operations */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  pendingConfirm.type === 'delete'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-gray-950">
                  {pendingConfirm.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {pendingConfirm.description}
                </p>
              </div>
            </div>

            {pendingConfirm.itemsList.length > 0 && (
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-3 mb-5 max-h-36 overflow-y-auto">
                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block mb-1.5">
                  Affected File(s) ({pendingConfirm.itemsList.length}):
                </span>
                <ul className="text-xs font-semibold text-gray-800 space-y-1">
                  {pendingConfirm.itemsList.map((name, i) => (
                    <li key={i} className="truncate">
                      • {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isExecutingConfirm}
                onClick={() => setPendingConfirm(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecutingConfirm}
                onClick={executeConfirmedAction}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  pendingConfirm.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isExecutingConfirm
                  ? 'Processing...'
                  : pendingConfirm.type === 'delete'
                  ? 'Confirm Delete'
                  : 'Confirm Overwrite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
