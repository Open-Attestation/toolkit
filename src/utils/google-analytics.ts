import { useEffect } from "react";
import ReactGA from "react-ga4";

/**
 * Initialise Google Analytics 4 only once (if GTAG_ID is provided)
 *
 * The ReactGA.send("pageview") is explicitly called afterwards because
 * the pageview event is not automatically triggered on first initialisation
 * but will be automatically triggered by the GA script on subsequent page views.
 */
export const useGoogleAnalytics = (): void => {
  useEffect(() => {
    try {
      ReactGA.initialize("G-GXV2BSGK4K");
      ReactGA.send("pageview");
    } catch (e) {
      console.error(e);
    }
  }, []);
};
