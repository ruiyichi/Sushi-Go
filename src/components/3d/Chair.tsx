import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

const Chair = ({ position }: { position: [x: number, y: number, z: number];}) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshLambertMaterial color={0x613b1c} />
    </mesh>
  );
}

export default Chair;