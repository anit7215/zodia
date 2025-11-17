import React, { Suspense } from 'react';
import { useGLTF, Sphere } from '@react-three/drei';

interface Model3DProps {
  rank: number;
  isMySign: boolean;
  modelPath?: string;
}

const DefaultSphere: React.FC = () => {
  return (
    <Sphere args={[0.15, 32, 32]}>
      <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} />
    </Sphere>
  );
};

const LoadedModel: React.FC<{ path: string }> = ({ path }) => {
  const { scene } = useGLTF(path, true);
  return <primitive object={scene} scale={8} />;
};

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Model loading failed, showing default sphere:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Model3D: React.FC<Model3DProps> = ({ modelPath }) => {
  if (modelPath) {
    return (
      <ModelErrorBoundary fallback={<DefaultSphere />}>
        <Suspense fallback={<DefaultSphere />}>
          <LoadedModel path={modelPath} />
        </Suspense>
      </ModelErrorBoundary>
    );
  }

  return <DefaultSphere />;
};
