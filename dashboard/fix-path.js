// Client-side script to fix path issues
(function() {
  const currentUrl = window.location.href;
  let newUrl = currentUrl;
  
  // Fix double dashboard issue
  if (currentUrl.includes('/dashboard/dashboard/')) {
    newUrl = currentUrl.replace('/dashboard/dashboard/', '/dashboard/');
    console.log('Double dashboard path fixed:', newUrl);
  }
  
  // Fix other known problematic paths
  const problematicPaths = [
    '/dashboard/create',
    '/dashboard/connections/add'
  ];
  
  problematicPaths.forEach(path => {
    if (currentUrl.includes(path)) {
      // Remove the first /dashboard from the path
      const fixedPath = path.replace('/dashboard', '');
      newUrl = currentUrl.replace(path, '/dashboard' + fixedPath);
      console.log(`Problematic path fixed: ${path} → /dashboard${fixedPath}`);
    }
  });
  
  // Only update if we made a change
  if (newUrl !== currentUrl) {
    window.history.replaceState({}, document.title, newUrl);
    console.log('URL path fixed to:', newUrl);
  }
})(); 