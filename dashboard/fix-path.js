// Enhanced client-side script to fix path issues
(function() {
  // Execute this function immediately
  console.log('Path fixing script executing at:', window.location.href);
  
  // Function to fix paths - we'll call this immediately and also on DOMContentLoaded
  function fixPaths() {
    const currentUrl = window.location.href;
    let newUrl = currentUrl;
    let pathChanged = false;
    
    // Handle the specific error case we're seeing first
    if (currentUrl.includes('/dashboard/dashboard/create/')) {
      newUrl = currentUrl.replace('/dashboard/dashboard/create/', '/dashboard/create/');
      console.log('Fixed specific create path issue:', newUrl);
      pathChanged = true;
    }
    
    // More general double dashboard fix
    if (!pathChanged && currentUrl.includes('/dashboard/dashboard/')) {
      newUrl = currentUrl.replace('/dashboard/dashboard/', '/dashboard/');
      console.log('Double dashboard path fixed:', newUrl);
      pathChanged = true;
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
          pathChanged = true;
        } else if (pathConfig.expectBase && !currentUrl.includes('/dashboard' + pathConfig.pattern)) {
          // If we expect the path to have a base path but it doesn't, add it
          const urlObj = new URL(currentUrl);
          const pathParts = urlObj.pathname.split('/');
          const lastPart = pathParts[pathParts.length - 1];
          
          if (lastPart === pathConfig.pattern.substring(1)) {
            urlObj.pathname = '/dashboard' + pathConfig.pattern;
            newUrl = urlObj.toString();
            console.log(`Adding base path: ${urlObj.pathname} → /dashboard${pathConfig.pattern}`);
            pathChanged = true;
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
        pathChanged = true;
      }
    }
    
    // Only update if we made a change
    if (pathChanged && newUrl !== currentUrl) {
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
  }
  
  // Call fixPaths immediately
  fixPaths();
  
  // Also fix navigation links once DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, fixing navigation links...');
    
    // Run the path fixing again, just to be safe
    fixPaths();
    
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
  
  // As a last resort, catch any link clicks that might cause navigation issues
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      const href = link.getAttribute('href');
      
      // Only intercept relative links or links to the same origin
      if (href && (href.startsWith('/') || href.includes(window.location.origin))) {
        // Check for problematic patterns that could lead to 404s
        if ((href.startsWith('/create') || href.includes('/dashboard/dashboard/')) && 
            !href.startsWith('/dashboard/create')) {
          e.preventDefault();
          
          // Fix the href
          let fixedHref = href;
          if (href.includes('/dashboard/dashboard/')) {
            fixedHref = href.replace('/dashboard/dashboard/', '/dashboard/');
          } else if (href.startsWith('/create') && !href.startsWith('/dashboard/')) {
            fixedHref = '/dashboard' + href;
          }
          
          console.log(`Intercepted navigation to ${href}, redirecting to ${fixedHref}`);
          window.location.href = fixedHref;
        }
      }
    }
  });
})(); 