import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { WebGLUtils, WebGLPerformance } from '@/lib/utils';

const SCALE = 0.05; // Scale down SVG coordinates for Three.js

// Fallback component when WebGL is not available
const FallbackIcon = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 relative">
        {/* SVG Fallback */}
        <svg
          viewBox="0 0 167 125"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#f0f0f0', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M142.385 64C105.462 113.2 68.5385 113.2 31.6154 64L19.3077 51.7C64.4359 2.5 107.513 2.5 148.538 51.7L167 76.3L167 51.7C113.667 -13.9 60.3333 -13.9 7 51.7L25.4615 76.3C66.4872 125.5 109.564 125.5 154.692 76.3L142.385 64Z"
            fill="url(#iconGradient)"
            stroke="#ffffff"
            strokeWidth="1"
            filter="url(#glow)"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
        </svg>
      </div>
    </div>
  );
};

const Icon3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert SVG path to 3D shape, scaled down
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(142.385 * SCALE, 64 * SCALE);
    s.bezierCurveTo(105.462 * SCALE, 113.2 * SCALE, 68.5385 * SCALE, 113.2 * SCALE, 31.6154 * SCALE, 64 * SCALE);
    s.lineTo(19.3077 * SCALE, 51.7 * SCALE);
    s.bezierCurveTo(64.4359 * SCALE, 2.5 * SCALE, 107.513 * SCALE, 2.5 * SCALE, 148.538 * SCALE, 51.7 * SCALE);
    s.lineTo(167 * SCALE, 76.3 * SCALE);
    s.lineTo(167 * SCALE, 51.7 * SCALE);
    s.bezierCurveTo(113.667 * SCALE, -13.9 * SCALE, 60.3333 * SCALE, -13.9 * SCALE, 7 * SCALE, 51.7 * SCALE);
    s.lineTo(25.4615 * SCALE, 76.3 * SCALE);
    s.bezierCurveTo(66.4872 * SCALE, 125.5 * SCALE, 109.564 * SCALE, 125.5 * SCALE, 154.692 * SCALE, 76.3 * SCALE);
    s.lineTo(142.385 * SCALE, 64 * SCALE);
    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: 0.2,
    bevelThickness: 0.2
  }), []);

  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.center();
    return g;
  }, [shape, extrudeSettings]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#ffffff"
        metalness={1}
        roughness={0.1}
        envMapIntensity={2}
        emissive="#ffffff"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
};

// Enhanced Error Boundary for WebGL context issues
function WebGLErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error && (
        event.error.message.includes('WebGL') ||
        event.error.message.includes('context') ||
        event.error.message.includes('THREE.WebGLRenderer')
      )) {
        console.warn('WebGL context error detected, falling back to SVG:', event.error);
        WebGLPerformance.recordContextLoss();
        setError(event.error);
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <FallbackIcon />;
  }

  return <>{children}</>;
}

export const Hero3D = () => {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [shouldDisableWebGL, setShouldDisableWebGL] = useState(false);

  useEffect(() => {
    // Check if WebGL should be disabled due to performance issues
    if (WebGLPerformance.shouldDisableWebGL()) {
      console.warn('WebGL disabled due to performance issues');
      setShouldDisableWebGL(true);
      return;
    }

    // Check WebGL availability using the utility
    const available = WebGLUtils.isWebGLAvailable();
    setWebGLAvailable(available);

    if (!available) {
      console.warn('WebGL is not available, using fallback');
      return;
    }

    // Monitor for context loss
    const handleContextLost = () => {
      console.warn('WebGL context lost, switching to fallback');
      WebGLPerformance.recordContextLoss();
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setContextLost(false);
    };

    // Add event listeners for context loss/restore
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  // Show fallback if WebGL is not available, context is lost, or should be disabled
  if (webGLAvailable === false || contextLost || shouldDisableWebGL) {
    return <FallbackIcon />;
  }

  // Show loading while checking WebGL availability
  if (webGLAvailable === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ 
            toneMapping: THREE.ACESFilmicToneMapping, 
            outputColorSpace: THREE.SRGBColorSpace,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false,
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            // Set up error handling for the renderer
            const webglContext = gl.getContext();
            if (webglContext) {
              webglContext.getExtension('WEBGL_lose_context');
              
              // Handle context loss more gracefully
              gl.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                WebGLPerformance.recordContextLoss();
                console.warn('WebGL context lost, will attempt to restore');
              }, false);
            }
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            WebGLPerformance.recordContextLoss();
            setContextLost(true);
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <Environment preset="sunset" />
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          }>
            <Icon3D />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={2}
              enableDamping
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}; 