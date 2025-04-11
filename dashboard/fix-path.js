// Enhanced client-side script to fix path issues
(function() {
  const currentUrl = window.location.href;
  let newUrl = currentUrl;
  
  // Fix double dashboard issue
  if (currentUrl.includes('/dashboard/dashboard/')) {
    newUrl = currentUrl.replace('/dashboard/dashboard/', '/dashboard/');
    console.log('Double dashboard path fixed:', newUrl);
  }
  
  // Fix problematic paths with more specific patterns
  const problematicPaths = [
    { pattern: '/dashboard/create', fix: '/create' },
    { pattern: '/dashboard/connections/add', fix: '/connections/add' },
    { pattern: '/create', expectBase: true },
    { pattern: '/connections', expectBase: true }
  ];
  
  for (const pathConfig of problematicPaths) {
    if (currentUrl.includes(pathConfig.pattern)) {
      if (pathConfig.fix) {
        // Replace the problematic pattern with the fix
        newUrl = currentUrl.replace(pathConfig.pattern, '/dashboard' + pathConfig.fix);
        console.log(`Problematic path fixed: ${pathConfig.pattern} → /dashboard${pathConfig.fix}`);
      } else if (pathConfig.expectBase && !currentUrl.includes('/dashboard' + pathConfig.pattern)) {
        // If we expect the path to have a base path but it doesn't, add it
        const urlObj = new URL(currentUrl);
        const pathParts = urlObj.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart === pathConfig.pattern.substring(1)) {
          urlObj.pathname = '/dashboard' + pathConfig.pattern;
          newUrl = urlObj.toString();
          console.log(`Adding base path: ${urlObj.pathname} → /dashboard${pathConfig.pattern}`);
        }
      }
    }
  }
  
  // Fix authentication redirection issues
  if (currentUrl.includes('/login?redirect=')) {
    const redirectParam = new URLSearchParams(new URL(currentUrl).search).get('redirect');
    if (redirectParam && !redirectParam.startsWith('/dashboard')) {
      const newRedirect = '/dashboard' + redirectParam;
      newUrl = currentUrl.replace(`redirect=${redirectParam}`, `redirect=${newRedirect}`);
      console.log(`Fixed redirect parameter: ${redirectParam} → ${newRedirect}`);
    }
  }
  
  // Only update if we made a change
  if (newUrl !== currentUrl) {
    window.history.replaceState({}, document.title, newUrl);
    console.log('URL path fixed to:', newUrl);
    
    // If we're on a spinner page, try to reload to get the correct content
    const spinnerElement = document.querySelector('.animate-spin');
    if (spinnerElement && document.body.contains(spinnerElement)) {
      console.log('Spinner detected, reloading page to get correct content...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }
  
  // Enhance navigation links
  document.addEventListener('DOMContentLoaded', function() {
    // Fix all navigation links that might be problematic
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('/create') || href.startsWith('/connections')) {
        if (!href.startsWith('/dashboard')) {
          const fixedHref = '/dashboard' + href;
          link.setAttribute('href', fixedHref);
          console.log(`Fixed navigation link: ${href} → ${fixedHref}`);
        }
      }
    });
  });
})(); 