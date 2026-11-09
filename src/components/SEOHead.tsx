/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, canonical, product }) => {
  useEffect(() => {
    // 1. Set DOM Title
    const formattedTitle = `${title} | MUSK - Technology For Smartness`;
    document.title = formattedTitle;

    // Helper functions to upsert meta tags
    const setMetaTag = (attribute: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Set Basic Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', 'MUSK, gadgets Bangladesh, smart watch prices Dhaka, wireless earbuds, premium apple gadgets bdt, musk tech bangladesh, electronic accessories');

    // 3. Set Canonical URL
    const canonicalURL = canonical || window.location.href;
    setLinkTag('canonical', canonicalURL);

    // 4. Set Open Graph (OG) Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', product ? 'product' : 'website');
    setMetaTag('property', 'og:url', canonicalURL);
    setMetaTag('property', 'og:image', product?.images[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop');
    setMetaTag('property', 'og:site_name', 'MUSK Bangladesh');

    // 5. Set Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', product?.images[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop');

    // 6. JSON-LD Structured Data Schema Insertion
    // Remove existing dynamic script elements if any
    const existingScript = document.getElementById('musk-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const scriptObj = document.createElement('script');
    scriptObj.id = 'musk-jsonld-schema';
    scriptObj.type = 'application/ld+json';

    let schemaData: any = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': 'MUSK - Technology For Smartness',
      'url': window.location.origin,
      'image': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      'description': description,
      'telephone': '+8801555123456',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Bhuiyan Market, Mithachara',
        'addressLocality': 'Mirsharai',
        'addressRegion': 'Chattogram',
        'postalCode': '4310',
        'addressCountry': 'BD'
      },
      'priceRange': '৳৳'
    };

    // Replace with specific Product schema if product detail is provided
    if (product) {
      const price = product.discountPrice || product.regularPrice;
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'image': product.images,
        'description': product.description,
        'sku': product.sku,
        'mpn': product.sku,
        'brand': {
          '@type': 'Brand',
          'name': product.brandName
        },
        'offers': {
          '@type': 'Offer',
          'url': canonicalURL,
          'priceCurrency': 'BDT',
          'price': price.toString(),
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'MUSK Online Store BD'
          }
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': product.rating.toString(),
          'reviewCount': product.ratingCount.toString()
        }
      };
    }

    scriptObj.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(scriptObj);

  }, [title, description, canonical, product]);

  return <React.Fragment />;
};
