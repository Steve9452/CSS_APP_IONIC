import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cssuca.app',
  appName: 'css_app',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "prompt": "select_account",
      "serverClientId": "906270140776-0eigrho9jc14fi00m8ebnhdm7sem0i02.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
