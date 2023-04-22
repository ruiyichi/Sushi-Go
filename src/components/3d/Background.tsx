import * as THREE from 'three';
import { Canvas, ThreeElements } from '@react-three/fiber';
import Chair from './Chair';

const Background = () => {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} />

      <Chair position={[-4.5, 0.4, 0.5]} />
      <Chair position={[-4.5, 0.4, -0.5]} />
      <Chair position={[4.5, 0.4, 0.5]} />
      <Chair position={[4.5, 0.4, -0.5]} />

    </Canvas>
  );
}

export default Background;