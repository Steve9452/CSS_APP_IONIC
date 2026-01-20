package com.cssuca.app;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;

import androidx.appcompat.app.AppCompatDelegate;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import java.util.ArrayList;
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {

        // Handle the splash screen transition.
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        registerPlugin(GoogleAuth.class);
    }
}