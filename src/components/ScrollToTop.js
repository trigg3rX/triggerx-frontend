import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'; // disable browser scroll restore
        }
    
        window.scrollTo(0, 0); // force scroll to top immediately
    }, [pathname]); // Re-run effect when pathname changes
    
    return null;
} 