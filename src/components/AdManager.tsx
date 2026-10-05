import { useEffect, useRef } from 'react';

// ============================================================
// AD MANAGER COMPONENT
// Handles all ad placements: banners, popunder, and social bar
// ============================================================

// Helper to safely inject external scripts
function injectScript(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.src = src;
  script.id = id;
  script.async = true;
  document.body.appendChild(script);
}

// Helper to inject inline script (for atOptions)
function injectInlineScript(code: string, id: string): void {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.innerHTML = code;
  document.body.appendChild(script);
}

// ============================================================
// GLOBAL ADS (Popunder + SocialBar) - Load once on mount
// ============================================================
export function GlobalAds() {
  useEffect(() => {
    // Popunder Ad
    injectScript(
      'https://pl31670726.profitableratecpmnetwork.com/bc/a1/2e/bca12e71b6e18b448d2a39bec7b115d5.js',
      'ad-popunder'
    );

    // SocialBar Ad
    injectScript(
      'https://pl31670725.profitableratecpmnetwork.com/4b/df/76/4bdf7646ef1760eb0ce548e90749fc41.js',
      'ad-socialbar'
    );
  }, []);

  return null;
}

// ============================================================
// 728x90 LEADERBOARD BANNER (Desktop)
// ============================================================
export function AdLeaderboard728x90() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject atOptions for 728x90
    injectInlineScript(
      `atOptions = {
        'key' : '7a3512634add8a01e01d8d066472f5cc',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`,
      'ad-728x90-options'
    );

    // Inject invoke script
    injectScript(
      'https://www.highrevenueformat.com/7a3512634add8a01e01d8d066472f5cc/invoke.js',
      'ad-728x90-invoke'
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex justify-center items-center bg-gray-100 border-b border-gray-200 py-2 min-h-[90px] w-full overflow-hidden"
      style={{ minHeight: '90px' }}
    >
      <div className="text-xs text-gray-400 absolute top-1 right-2">Advertisement</div>
    </div>
  );
}

// ============================================================
// 320x50 MOBILE BANNER (Sticky Bottom)
// ============================================================
export function AdMobileBanner320x50() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject atOptions for 320x50
    injectInlineScript(
      `atOptions = {
        'key' : 'c68d0c23ea94ccad7c3816156f370e0f',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };`,
      'ad-320x50-options'
    );

    // Inject invoke script
    injectScript(
      'https://www.highrevenueformat.com/c68d0c23ea94ccad7c3816156f370e0f/invoke.js',
      'ad-320x50-invoke'
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-300 flex justify-center items-center shadow-lg"
      style={{ minHeight: '50px', height: '50px' }}
    >
      <div className="text-xs text-gray-400 absolute top-0 right-2">Ad</div>
    </div>
  );
}

// ============================================================
// IN-CONTENT AD (Between sections) - Desktop only
// ============================================================
export function AdInContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    // Create a container for the ad
    const adContainer = document.createElement('div');
    adContainer.id = 'ad-incontent-container';
    adContainer.style.display = 'flex';
    adContainer.style.justifyContent = 'center';
    adContainer.style.alignItems = 'center';
    adContainer.style.minHeight = '90px';
    containerRef.current.appendChild(adContainer);

    // Inject atOptions for 728x90 (reuse the leaderboard key)
    injectInlineScript(
      `atOptions = {
        'key' : '7a3512634add8a01e01d8d066472f5cc',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`,
      'ad-incontent-options'
    );

    // Inject invoke script
    injectScript(
      'https://www.highrevenueformat.com/7a3512634add8a01e01d8d066472f5cc/invoke.js',
      'ad-incontent-invoke'
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex justify-center items-center bg-gray-50 border-y border-gray-200 py-4 my-8 min-h-[100px] w-full"
    >
      <div className="text-xs text-gray-400">— Advertisement —</div>
    </div>
  );
}

// ============================================================
// COMBINED AD MANAGER - Use this in App
// ============================================================
export function AdManager() {
  return (
    <>
      <GlobalAds />
      <AdLeaderboard728x90 />
      <AdMobileBanner320x50 />
    </>
  );
}
