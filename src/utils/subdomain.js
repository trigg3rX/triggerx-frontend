export const getSubdomain = () => {
    const host = window.location.host;
    const parts = host.split('.');
    
    // Check if we're on a subdomain of triggerx.network
    if (parts.length === 3 && parts[1] === 'triggerx' && parts[2] === 'network') {
      // Return empty string for app subdomain, otherwise return the subdomain
      return parts[0] === 'app' ? '' : parts[0];
    }
    
    return '';
  };