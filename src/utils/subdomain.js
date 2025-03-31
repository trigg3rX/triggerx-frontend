export const getSubdomain = () => {
    const host = window.location.host; // e.g., "rewards.triggerx.network"
    const parts = host.split('.');
    
    // Check if we're on a subdomain of triggerx.network
    if (parts.length === 3 && parts[1] === 'triggerx' && parts[2] === 'network') {
      return parts[0];
    }
    
    return '';
  };