import React from 'react';

const fadeSlideStyle = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.portfolio-fade-slide-in {
  animation: fadeSlideIn 0.4s cubic-bezier(.4,0,.2,1);
}
`;
if (typeof document !== 'undefined' && !document.getElementById('portfolio-fade-slide-style')) {
  const style = document.createElement('style');
  style.id = 'portfolio-fade-slide-style';
  style.innerHTML = fadeSlideStyle;
  document.head.appendChild(style);
}

const Header = ({ title }: { title: string }) => (
  <div
    className="portfolio-fade-slide-in"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: 56,
      paddingRight: 56,
      paddingTop: 40,
      paddingBottom: 40,
      borderRadius: 40,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: 40,
      display: 'flex',
      background: 'rgba(30,30,35,0.85)',
      boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
      marginTop: 32,
    }}
    key={title}
  >
    <div style={{ color: 'white', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: '56px', wordWrap: 'break-word' }}>{title}</div>
    <div style={{ alignSelf: 'stretch', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '28px', wordWrap: 'break-word', color: 'rgba(255,255,255,0.7)' }}>
      This is the {title} page. You can customize this content for each section.
    </div>
  </div>
);

export default Header; 