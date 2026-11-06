// Paste your two Supabase values here (see CLOUD-SETUP.md, step 5).
// While they are empty the app runs in local mode, exactly like before.
window.GIRTON_CLOUD = {
  adminUsername: 'admin',            // the uploader's sign-in name
  emailDomain: 'girton-ledger.app',  // internal only; people never type this
  supabase: {
    url: 'https://aribisaqbdvziwrjeuqc.supabase.co/rest/v1/',      // looks like https://abcdxyz.supabase.co
    anonKey: 'sb_publishable_vJamqXr9e_QGbx2HMFp2Cg_t7U0AtOC'   // the "anon public" key (or the "publishable" key)
  }
};
