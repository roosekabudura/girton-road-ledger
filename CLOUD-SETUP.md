# Cloud setup (Supabase): one upload updates everyone

Everything below is free. You do this once, about 20 minutes.

## 1. Create the Supabase project
1. Go to supabase.com, click **Start your project** and sign in (signing in with your GitHub account is fine).
2. Click **New project**. Name it `girton-road-ledger`, set a database password (save it somewhere safe, you will rarely need it),
   pick the region closest to you (South Africa if listed, otherwise Europe), choose the **Free** plan, click **Create new project**.
3. Wait 1 to 2 minutes until the project is ready.

## 2. Tighten sign-in settings
1. Left menu: **Authentication**, then the sign-in settings (**Sign In / Providers**) and open **Email**.
2. Switch **Confirm email** OFF (the app uses internal addresses that cannot receive mail).
3. Switch **Allow new users to sign up** OFF, so nobody else can create an account. Save.

## 3. Create the sign-ins
Open **Authentication > Users > Add user > Create new user**. Add these four.
For each, tick **Auto Confirm User** before creating. People only type their name in the app, never the email.

| Person | Email to type here | Password |
|---|---|---|
| You (uploader) | `admin@girton-ledger.app` | a strong password only you know |
| Leonard | `leonard@girton-ledger.app` | his number |
| Potiphar | `potiphar@girton-ledger.app` | his number |
| RTM | `rtm@girton-ledger.app` | his number |

In the app they sign in with **Admin**, **Leonard**, **Potiphar** or **RTM** plus the password. Capital letters do not matter.
Phone numbers are easy to guess, so ask each person to keep the app to themselves.
Passwords can be reset any time from the same Users list.

## 4. Create the tables and access rules
1. Left menu: **SQL Editor > New query**.
2. Open `supabase-setup.sql` from this project, copy everything, paste it in, click **Run**. It should say "Success".
   This creates the data tables and the rules: only the four people can read, and only you can write.

## 5. Connect the app
1. **Project Settings** (gear) > **API** (or **API Keys**).
2. Copy the **Project URL** and the **anon public** key (a newer project may call it the **publishable** key).
3. Open `src/supabase-config.js` and paste them between the quotes for `url` and `anonKey`. Save.
   These two values are not secret. The access rules from step 4 are what protect your data.

## 6. Put it on GitHub
1. Upload the project to your repository again (replace the files, keep the `.github` folder).
2. The repository must be **Public** for the free web link: **Settings > General > Danger Zone > Change visibility**.
   Your figures are not stored there, only the app itself.
3. **Settings > Pages > Build and deployment > Source: GitHub Actions**.
4. In the **Actions** tab these run: **Publish web app** (your hosted link, shown under Settings > Pages),
   **Build Android APK** (download `girton-road-ledger-apk` from the run's Artifacts), and **Keep Supabase awake**.

## 7. Publish your data (you, once)
1. Open the app, sign in as **Admin**.
2. **Upload & settings**: if your data is already on this device click **Publish all data to cloud**,
   otherwise upload your ledger, contractor and quotation files as before.
3. From now on every upload is published automatically. Exchange rate and unit budgets you change are shared too.

## What everyone else does
- **Hosted link:** open it in Chrome on Android, tap the three dots, **Add to Home screen**. It updates for everybody whenever you push a change.
- **APK:** install the file you send. It shows the same live data.
- Sign in with name and password. New uploads appear within a minute, or straight away when the app is reopened.
- With no internet the app shows its last saved copy. Signing out clears that copy from a viewer's phone.

## Keeping the free project awake
Free Supabase projects pause after a week with no activity. The **Keep Supabase awake** job sends a small request every 3 days.
GitHub switches scheduled jobs off in a repository with no changes for 60 days and emails you. If that happens, open
**Actions > Keep Supabase awake** and click **Enable workflow**.
If the project is ever paused, open supabase.com, select the project and click **Restore project**. Your data is kept.

## Adding or removing a person later
1. **Authentication > Users > Add user** with `name@girton-ledger.app` and a password, with **Auto Confirm User** ticked.
2. **Table Editor > members > Insert row**: email `name@girton-ledger.app`, role `viewer`.
   To remove someone, delete them from Users and delete their row in `members`. No app change or new APK is needed.
