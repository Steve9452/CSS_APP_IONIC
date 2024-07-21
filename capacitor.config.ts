import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.cssuca.app',
  appName: 'css_app',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      prompt: "select_account",
      serverClientId: "906270140776-2mu590prtgmi7or3fl4hop6j2c3njdvd.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    },
  }
};

export default config;
