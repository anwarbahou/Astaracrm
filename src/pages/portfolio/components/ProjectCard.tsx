import React from 'react';
import Vector from '../svgs/Vector.svg';

const ProjectCard = ({ style = {}, ...rest }: { style?: React.CSSProperties } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    draggable={false}
    style={{
      width: 600,
      height: 464,
      padding: 0,
      position: 'relative',
      background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.02) 100%)',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.60)',
      overflow: 'hidden',
      borderRadius: 40,
      outline: '1px rgba(255, 255, 255, 0.20) solid',
      outlineOffset: '-1px',
      backdropFilter: 'blur(12px)',
      display: 'inline-block',
      ...style,
    }}
    {...rest}
  >
    {/* Full-card image */}
    <img src="https://picsum.photos/600/464" alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
    {/* Overlay content at the bottom */}
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      padding: '24px 40px 24px 40px',
      background: 'linear-gradient(0deg, rgba(21,22,26,0.85) 70%, rgba(21,22,26,0.2) 100%)',
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
    }}>
      <div data-size="L" style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
        <div data-style="Round" style={{ width: 32, height: 32, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={Vector} alt="icon" style={{ width: 24, height: 24, display: 'block' }} />
        </div>
      </div>
      <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: 22, fontFamily: 'Inter', fontWeight: 700, lineHeight: '28px', wordWrap: 'break-word' }}>
          Project title
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>
          Project description
        </div>
      </div>
    </div>
  </div>
);

export default ProjectCard; 