import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

/**
 * Sends a GA4 page_view on every client-side route change. Without this, only
 * the first URL loaded is counted (SPA navigations are invisible to GA).
 */
export const GaPageViewTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const page =
            typeof window !== "undefined"
                ? window.location.pathname + window.location.search
                : location.pathname + location.search;

        ReactGA.send({
            hitType: "pageview",
            page,
            title: typeof document !== "undefined" ? document.title : undefined,
        });
    }, [location]);

    return null;
};
