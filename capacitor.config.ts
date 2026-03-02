import type { CapacitorConfig } from '@capacitor/cli';

// ─── Per-Tenant Build Variables ─────────────────────────────
// Set these as environment variables in Codemagic (or locally) before running `cap sync`.
//
// Example for Bullard Tree Care:
//   APP_ID=app.arbordash.bullard
//   APP_NAME=Bullard Tree Care
//   COMPANY_CODE=bullardtreecare
//
// The COMPANY_CODE is passed as a query parameter to the web app so it can
// resolve the correct tenant branding without needing the tenant's hostname.

const APP_ID = process.env.APP_ID || 'app.arbordash.crew';
const APP_NAME = process.env.APP_NAME || 'ArborDash Crew';
const COMPANY_CODE = process.env.COMPANY_CODE || '';

// Build the server URL with company code for tenant branding resolution
const baseUrl = 'https://dashboard.arbordash.app';
const serverUrl = COMPANY_CODE
  ? `${baseUrl}?native=1&company=${COMPANY_CODE}`
  : `${baseUrl}?native=1`;

const config: CapacitorConfig = {
  appId: APP_ID,
  appName: APP_NAME,
  webDir: 'www',

  server: {
    // Load the web dashboard from the remote URL — no bundled assets needed.
    // Web deploys are instant for native users (no app update required).
    url: serverUrl,
    cleartext: false,
    // Allow navigation to tenant subdomains and the main platform domain
    allowNavigation: [
      'dashboard.arbordash.app',
      '*.arbordash.app',
      'api.arbordash.app',
    ],
  },

  plugins: {
    PushNotifications: {
      // iOS: present notification alert even when app is in foreground
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    BackgroundGeolocation: {
      // Android: notification shown while tracking in background
      backgroundMessage: `${APP_NAME} is tracking your location for crew management.`,
      backgroundTitle: 'Location Active',
    },
  },

  // iOS-specific settings
  ios: {
    // Allow inline media playback (needed for some map tiles)
    allowsLinkPreview: false,
    // Use WKWebView (default in Capacitor 6)
    contentInset: 'automatic',
  },

  // Android-specific settings
  android: {
    // Allow mixed content for development
    allowMixedContent: false,
    // Use Chrome Custom Tabs for OAuth redirects
    useLegacyBridge: false,
  },
};

export default config;
