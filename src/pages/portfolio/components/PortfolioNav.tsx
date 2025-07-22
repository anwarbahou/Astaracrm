import React, { useEffect, useState } from 'react';

export const ICONS = [
  // Home
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="home"><path d="M3 10.5L12 4L21 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10.5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  // Ruler (Projects)
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="ruler"><rect x="3" y="10" width="18" height="4" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  // Palette (About)
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="palette"><path d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 13.6569 19.6569 15 18 15H17C16.4477 15 16 15.4477 16 16V17C16 18.6569 14.6569 20 13 20H12Z" stroke="currentColor" strokeWidth="2"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="12" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg>
  ),
  // Camera (Gallery)
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="camera"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="2"/><path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke="currentColor" strokeWidth="2"/></svg>
  ),
  // LinkedIn
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="linkedin"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/><path d="M7 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="7" cy="7" r="1" fill="currentColor"/><path d="M11 17V13C11 12.4477 11.4477 12 12 12H13C13.5523 12 14 12.4477 14 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 17V15C17 13.8954 16.1046 13 15 13C13.8954 13 13 13.8954 13 15V17" stroke="currentColor" strokeWidth="2"/></svg>
  ),
  // Dribbble
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="dribbble"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12C2 12 6 10 12 10C18 10 22 12 22 12" stroke="currentColor" strokeWidth="2"/><path d="M12 2C14 6 16 10 16 12C16 14 14 18 12 22" stroke="currentColor" strokeWidth="2"/></svg>
  ),
];

export const TAB_NAMES = [
  'Home',
  'Projects',
  'About',
  'Gallery',
  'LinkedIn',
  'Dribbble',
];

const MENU_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="7" width="20" height="2.5" rx="1.25" fill="#BFC2CB" />
    <rect x="4" y="13" width="20" height="2.5" rx="1.25" fill="#BFC2CB" />
    <rect x="4" y="19" width="20" height="2.5" rx="1.25" fill="#BFC2CB" />
  </svg>
);

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const PortfolioNav = ({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    const onResize = () => {
      setMobile(isMobile());
      if (!isMobile()) setOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Mobile: morph button into nav
  if (mobile) {
    const navWidth = open ? '82px' : '56px';
    const navHeight = open ? 420 : 56;
    const navBorderRadius = open ? 40 : 28;
    const navPadding = open ? '16px 0' : '0';
    const navBoxShadow = open
      ? '0px 12px 32px 0px rgba(0,0,0,0.70)'
      : '0px 6px 24px rgba(0,0,0,0.60)';
    const navTransition = 'all 0.35s cubic-bezier(.4,0,.2,1)';
    return (
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 200,
          width: navWidth,
          height: navHeight,
          borderRadius: navBorderRadius,
          background: 'linear-gradient(180deg, rgba(40,40,45,0.60) 0%, rgba(30,30,35,0.40) 100%)',
          boxShadow: navBoxShadow,
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: open ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          padding: navPadding,
          gap: 0,
          cursor: 'pointer',
          transition: navTransition,
          overflow: 'hidden',
        }}
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        {!open && MENU_ICON}
        {open && (
          <>
            {ICONS.slice(0, 4).map((icon, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSelected(i); setOpen(false); }}
                style={{
                  width: 48,
                  height: 48,
                  marginBottom: 8,
                  border: 'none',
                  outline: 'none',
                  borderRadius: 24,
                  background: selected === i ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: selected === i ? '#fff' : '#AAAEB9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.25s, color 0.25s, transform 0.18s',
                }}
                aria-label={`Tab ${i}`}
              >
                {icon}
              </button>
            ))}
            {/* Divider */}
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.12)', margin: '16px 0' }} />
            {ICONS.slice(4).map((icon, i) => (
              <button
                key={i+4}
                onClick={e => { e.stopPropagation(); setSelected(i+4); setOpen(false); }}
                style={{
                  width: 48,
                  height: 48,
                  marginBottom: i === 1 ? 0 : 8,
                  border: 'none',
                  outline: 'none',
                  borderRadius: 24,
                  background: selected === i+4 ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: selected === i+4 ? '#fff' : '#AAAEB9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.25s, color 0.25s, transform 0.18s',
                }}
                aria-label={`Tab ${i+4}`}
              >
                {icon}
              </button>
            ))}
          </>
        )}
      </div>
    );
  }

  // Desktop: show nav as a normal flex child
  return (
  <div
    style={{
      width: 64,
      height: 420,
      background: 'linear-gradient(180deg, rgba(40,40,45,0.60) 0%, rgba(30,30,35,0.40) 100%)',
      borderRadius: 40,
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      gap: 0,
      zIndex: 10,
      overflow: 'visible',
        boxShadow: scrolled
          ? '0px 12px 32px 0px rgba(0,0,0,0.70), 0px 2px 8px 0px rgba(0,0,0,0.30)'
          : '0px 6px 9px rgba(0, 0, 0, 0.60)',
        marginRight: 32,
        marginTop: 32,
        transition: 'box-shadow 0.3s, transform 0.3s',
        transform: scrolled ? 'translateY(8px) scale(1.01)' : 'none',
    }}
  >
    {ICONS.slice(0, 4).map((icon, i) => (
      <button
        key={i}
        onClick={() => setSelected(i)}
        style={{
          width: 48,
          height: 48,
          marginBottom: 8,
          border: 'none',
          outline: 'none',
          borderRadius: 24,
          background: selected === i ? 'rgba(255,255,255,0.12)' : 'transparent',
          color: selected === i ? '#fff' : '#AAAEB9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.25s, color 0.25s, transform 0.18s',
        }}
        aria-label={`Tab ${i}`}
      >
        {icon}
      </button>
    ))}
    {/* Divider */}
    <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.12)', margin: '16px 0' }} />
    {ICONS.slice(4).map((icon, i) => (
      <button
        key={i+4}
        onClick={() => setSelected(i+4)}
        style={{
          width: 48,
          height: 48,
          marginBottom: i === 1 ? 0 : 8,
          border: 'none',
          outline: 'none',
          borderRadius: 24,
          background: selected === i+4 ? 'rgba(255,255,255,0.12)' : 'transparent',
          color: selected === i+4 ? '#fff' : '#AAAEB9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.25s, color 0.25s, transform 0.18s',
        }}
        aria-label={`Tab ${i+4}`}
      >
        {icon}
      </button>
    ))}
  </div>
);
};

export default PortfolioNav; 