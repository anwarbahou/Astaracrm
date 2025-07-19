import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

const SCALE = 0.05; // Scale down SVG coordinates for Three.js

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

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error('3D Render Error:', err);
    return <div style={{ color: 'red' }}>3D Render Error: {String(err)}</div>;
  }
}

export const Hero3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <Environment preset="sunset" />
        <ErrorBoundary>
          <Suspense fallback={null}>
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
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}; 