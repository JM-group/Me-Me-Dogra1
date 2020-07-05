package com.mashtub;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.taluttasgiran.ReactNativeCountriesPackage;
import io.invertase.firebase.RNFirebasePackage;
import org.reactnative.camera.RNCameraPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnfs.RNFSPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.fullstack.oauth.OAuthManagerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.masteratul.downloadmanager.ReactNativeDownloadManagerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.RNPlayAudio.RNPlayAudioPackage;
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.chrisbianca.cameraroll.RNCameraRollPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeCountriesPackage(),
            new RNFirebasePackage(),
            new RNCameraPackage(),
            new RNSoundPackage(),
            new RNFSPackage(),
            new RNGoogleSigninPackage(),
            new OAuthManagerPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeDownloadManagerPackage(),
            new AsyncStoragePackage(),
            new RNPlayAudioPackage(),
            new RNSoundPlayerPackage(),
            new ImagePickerPackage(),
            new CameraRollPackage(),
            new RNCameraRollPackage(),
            new LinearGradientPackage(),
            new OrientationPackage(),
            new KCKeepAwakePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new RNEventEmitterPackage(),
            new RNGestureHandlerPackage(),
            new RNAudioRecorderPlayerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
