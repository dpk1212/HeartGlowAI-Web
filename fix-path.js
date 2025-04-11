// Client-side script to fix the double dashboard path issue
(function() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/dashboard/dashboard/')) {
    // Replace double dashboard with single dashboard
    const newUrl = currentUrl.replace('/dashboard/dashboard/', '/dashboard/');
    window.history.replaceState({}, document.title, newUrl);
    console.log('URL path fixed:', newUrl);
  }
})(); 