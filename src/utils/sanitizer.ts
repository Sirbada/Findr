// Input sanitization utilities for Findr
import DOMPurify from 'dompurify';

// Configuration for DOMPurify
const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  ALLOW_DATA_ATTR: false
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
};

/**
 * Sanitize plain text input
 */
export const sanitizeText = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .normalize('NFKC'); // Normalize unicode
};

/**
 * Sanitize and validate email
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, ''); // Keep only valid email chars
};

/**
 * Sanitize phone number (keep only digits and +)
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone.replace(/[^\d+]/g, '').trim();
};

/**
 * Sanitize URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
};

/**
 * Sanitize price/numeric input
 */
export const sanitizePrice = (price: string | number): number => {
  if (typeof price === 'number') {
    return Math.max(0, Math.round(price * 100) / 100); // Round to 2 decimals
  }
  
  if (!price || typeof price !== 'string') return 0;
  
  const cleaned = price.replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed * 100) / 100);
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>'"]/g, '') // Remove potentially dangerous chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit length
};

/**
 * Validate and sanitize UUID
 */
export const sanitizeUuid = (uuid: string): string => {
  if (!uuid || typeof uuid !== 'string') return '';
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(uuid.trim()) ? uuid.trim().toLowerCase() : '';
};

/**
 * Sanitize file name
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') return '';
  
  return fileName
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid file chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores
    .substring(0, 255); // Limit length
};

/**
 * Comprehensive form data sanitizer
 */
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }
    
    switch (key) {
      case 'email':
        sanitized[key] = sanitizeEmail(value);
        break;
      case 'phone':
        sanitized[key] = sanitizePhone(value);
        break;
      case 'price':
      case 'amount':
        sanitized[key] = sanitizePrice(value);
        break;
      case 'url':
      case 'website':
        sanitized[key] = sanitizeUrl(value);
        break;
      case 'id':
      case 'userId':
      case 'listingId':
        sanitized[key] = sanitizeUuid(value);
        break;
      case 'search':
      case 'query':
        sanitized[key] = sanitizeSearchQuery(value);
        break;
      case 'fileName':
        sanitized[key] = sanitizeFileName(value);
        break;
      case 'description':
      case 'content':
        sanitized[key] = sanitizeHtml(value);
        break;
      default:
        if (typeof value === 'string') {
          sanitized[key] = sanitizeText(value);
        } else {
          sanitized[key] = value;
        }
    }
  }
  
  return sanitized;
};

/**
 * Custom hook for sanitizing form inputs
 */
export const useSanitizedState = (initialValue: string = '', sanitizer = sanitizeText) => {
  const [value, setValue] = React.useState(initialValue);
  
  const setSanitizedValue = (newValue: string) => {
    setValue(sanitizer(newValue));
  };
  
  return [value, setSanitizedValue] as const;
};

// Add React import for hook
import React from 'react';