# Girton Road Ledger: build the APK

## One-time setup on your computer
1. Install **Node.js 18 or newer** (nodejs.org).
2. Install **Android Studio** (developer.android.com/studio). On first launch let it install the Android SDK.
   It includes the JDK 17 that Capacitor 6 needs.

## Build a test APK (debug)
Open a terminal in this folder and run:

```
npm install
npm run icons            # makes launcher icons from assets/ (optional but recommended)
npx cap add android      # first time only; creates the android/ folder
npm run sync             # copies the app into the Android project
cd android
./gradlew assembleDebug  # on Windows: gradlew.bat assembleDebug
```

Your APK is at `android/app/build/outputs/apk/debug/app-debug.apk`.
Copy it to your phone and open it. You may need to allow "Install unknown apps" for your file manager.

You can also run `npm run open` to open the project in Android Studio and use **Build > Build APK(s)**.

## Build a release APK (to share or publish)
1. Create a signing key once and keep it safe (you need the same key for every update):
   ```
   keytool -genkey -v -keystore girton-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias girton
   ```
2. In Android Studio: **Build > Generate Signed App Bundle / APK > APK**, choose the keystore, pick **release**.
3. The signed APK is in `android/app/release/`.

## App details you can change
| Detail | Where |
|---|---|
| App ID (package name) | `capacitor.config.json` → `appId` (currently `com.girtonroad.ledger`). Set it **before** `npx cap add android`. It cannot change after publishing. |
| App name | `capacitor.config.json` → `appName` |
| Version number / build number | `android/app/build.gradle` → `versionName` and `versionCode` (raise `versionCode` by 1 for every update) |
| Icon | replace the files in `assets/` and run `npm run icons` |
| App screens | edit `src/index.html`, then run `npm run sync` |

## Notes
- The app works offline. Chart.js, Excel and CSV libraries are bundled by `npm run prepare-www`.
- Your data is stored on the phone, inside the app. Uninstalling the app deletes it, so use **Back up all data** in Upload &amp; settings now and then.
- In the app, CSV, Excel and backup exports open the Android share sheet so you can save to Files, Drive or WhatsApp.
- The print report button is hidden in the app, since Android WebView cannot print this page.
- If you change `src/index.html`, run `npm run sync` and rebuild.

## Build on GitHub instead (no installs on your computer)
1. Create a free account at github.com and make a **new repository** (private is fine).
2. Upload everything from this folder to it, including the hidden `.github` folder.
   Easiest: install GitHub Desktop, add this folder, then Commit and Push.
3. Open the repository's **Actions** tab. The "Build Android APK" workflow starts by itself after the push.
   You can also start it with **Run workflow**.
4. When it shows a green tick (about 5 to 10 minutes), open the run and download
   **girton-road-ledger-apk** from the Artifacts section. Unzip it to get `app-debug.apk`.
5. Copy the APK to your phone and install it.

To update the app later, change `src/index.html`, push again, and download the new APK.
This builds the debug (test) version. A release APK for publishing needs a signing key stored as GitHub secrets.

## Live sync between phones
See **CLOUD-SETUP.md**. It covers the free Supabase database, sign-ins, the hosted link and the APK.
Until `src/supabase-config.js` is filled in, the app runs in local mode exactly as before.
