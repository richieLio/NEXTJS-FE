import { useGLTF, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from 'three';
import React, { useRef, useEffect, useState } from "react";

export default function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef<THREE.Group>();

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3()).length();
  scene.scale.set(1.5, 1.5, 1.5);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = 0;
      modelRef.current.rotation.x = Math.PI / 9;
    }
  }, []);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <primitive object={scene} ref={modelRef} />
      <PerspectiveCamera makeDefault position={[0, size*0.5, size*1.1]} />
    </>
  );
}
