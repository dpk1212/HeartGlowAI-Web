(function() {
  // Function to fix paths - runs immediately
  function fixPaths() {
    const currentUrl = window.location.href;
    let newUrl = currentUrl;
    let pathChanged = false;

    // --- Start of Path Correction Logic ---

    // Fix double dashboard prefix (most common issue)
    const doubleDashboardPrefix = '/dashboard/dashboard/';
    if (currentUrl.includes(doubleDashboardPrefix)) {
      newUrl = currentUrl.replace(doubleDashboardPrefix, '/dashboard/');
      console.log('[fix-path] Double dashboard path fixed:', newUrl);
      pathChanged = true;
    }

    // Add other necessary checks here if needed, for example:
    // const needsBasePathPrefix = '/create';
    // if (currentUrl.endsWith(needsBasePathPrefix) && !currentUrl.includes('/dashboard'+needsBasePathPrefix)) {
    //   newUrl = '/dashboard' + needsBasePathPrefix;
    //   console.log('[fix-path] Added missing base path:', newUrl);
    //   pathChanged = true;
    // }
    
    // --- End of Path Correction Logic ---

    // Only update history state if a change was made
    if (pathChanged && newUrl !== currentUrl) {
      try {
        window.history.replaceState({}, document.title, newUrl);
        console.log('[fix-path] URL path fixed via replaceState to:', newUrl);
      } catch (e) {
        console.error('[fix-path] Error using replaceState:', e);
        // Fallback or alternative handling if replaceState fails (unlikely)
      }
    }
  }

  // Run the path fixing check immediately on script load
  try {
    fixPaths();
  } catch(e) {
    console.error('[fix-path] Error running initial fixPaths:', e);
  }

})(); 