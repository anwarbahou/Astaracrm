import React, { useState, useRef, useEffect } from 'react';
import PortfolioNav, { ICONS, TAB_NAMES } from './components/PortfolioNav';
import Header from './components/Header';
import PortfolioButton from './components/PortfolioButton';
import ProjectDisplay from './components/ProjectDisplay';
import ProjectCard from './components/ProjectCard';

const PROJECTS = [
  'Project 1',
  'Project 2',
  'Project 3',
];

// Add CSS for animation and hide scrollbar
const fadeSlideStyle = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.portfolio-fade-slide-in {
  animation: fadeSlideIn 0.4s cubic-bezier(.4,0,.2,1);
}
.portfolio-carousel::-webkit-scrollbar { display: none; }
.portfolio-carousel { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('portfolio-fade-slide-style')) {
  const style = document.createElement('style');
  style.id = 'portfolio-fade-slide-style';
  style.innerHTML = fadeSlideStyle;
  document.head.appendChild(style);
}

// Add this style tag if not already present
if (typeof document !== 'undefined' && !document.getElementById('portfolio-scrollbar-hide-style')) {
  const style = document.createElement('style');
  style.id = 'portfolio-scrollbar-hide-style';
  style.innerHTML = `
    .portfolio-scrollbar-hide::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}

const Portfolio: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false); // for user-select
  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  // For negative margin calculation
  const [carouselMargin, setCarouselMargin] = useState(0);

  useEffect(() => {
    function updateMargin() {
      const vw = window.innerWidth;
      setCarouselMargin((vw - 1400) / 2);
    }
    updateMargin();
    window.addEventListener('resize', updateMargin);
    return () => window.removeEventListener('resize', updateMargin);
  }, []);

  // Pointer events for drag-to-scroll
  const onPointerDown = (e: React.PointerEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    setDragging(true);
    startX.current = e.clientX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    const x = e.clientX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    setDragging(false);
    if (carouselRef.current) {
      carouselRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#15161A', paddingBottom: 48, boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', overflowX: 'hidden' }}>
      {/* Navigation always on the left */}
      <PortfolioNav selected={selected} setSelected={setSelected} />
      {/* Main 1400px content block */}
      <div style={{ width: 1400, minWidth: 0, maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative' }}>
        <Header title={TAB_NAMES[selected]} key={TAB_NAMES[selected]} />
        {selected === 0 && (
          <div
            tabIndex={0}
            ref={carouselRef}
            style={{
              width: '100vw',
              overflowX: 'auto',
              paddingTop: 32,
              marginLeft: -carouselMargin,
              position: 'relative',
              zIndex: 2,
              cursor: dragging ? 'grabbing' : 'grab',
              userSelect: dragging ? 'none' : 'auto',
              // Hide scrollbar for all browsers
              msOverflowStyle: 'none', // IE and Edge
              scrollbarWidth: 'none', // Firefox
            }}
            className="portfolio-scrollbar-hide"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <div
              className="portfolio-carousel"
              style={{ display: 'flex', gap: 32, width: 'max-content', minWidth: 0, paddingBottom: 8 }}
            >
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              <ProjectCard {...(dragging ? {style: {pointerEvents: 'none'}} : {})} />
              {/* Add more <ProjectCard /> as needed */}
            </div>
          </div>
        )}
        {selected === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 32, marginTop: 24, width: '100%' }}>
            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
              {PROJECTS.map((name, i) => (
                <PortfolioButton
                  key={name}
                  label={name}
                  selected={activeProject === i}
                  onClick={() => setActiveProject(i)}
                />
              ))}
            </div>
            <ProjectDisplay name={PROJECTS[activeProject]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio; 