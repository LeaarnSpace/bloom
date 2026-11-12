import { MOTION_ATTR, MOTION_READY_ATTR } from "./motion";

// Inline script for <head>. Runs before first paint and turns motion on (so the
// hero's entrance starts hidden) only when the visitor allows motion. If the
// page's JS hasn't started ScrollReveal within 4s (slow or failed load), motion
// is switched off again so content waiting to be revealed shows anyway.
export const motionBootScript = `(function(){try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: no-preference)").matches)return;d.setAttribute("${MOTION_ATTR}","");setTimeout(function(){if(!d.hasAttribute("${MOTION_READY_ATTR}"))d.removeAttribute("${MOTION_ATTR}")},4000)}catch(e){}})();`;
