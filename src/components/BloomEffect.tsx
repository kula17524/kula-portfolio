import React, { useRef, useEffect } from "react";
import { extend, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import * as THREE from "three";

// 必要なコンポーネントを extend で登録
extend({ EffectComposer, RenderPass, UnrealBloomPass });

const BloomEffect: React.FC = () => {
  const composer = useRef<EffectComposer | null>(null);
  const { scene, gl, size, camera } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#001B33");
    gl.setClearColor(0x001122, 0);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      30, // 強度
      1.2, // 半径
      0.5 // 閾値
    );

    composer.current = new EffectComposer(gl);
    composer.current.addPass(renderPass);
    composer.current.addPass(bloomPass);

    gl.setAnimationLoop(() => {
      composer.current?.render();
    });

    const handleResize = () => {
      composer.current?.setSize(size.width, size.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gl.setAnimationLoop(null);
      composer.current?.dispose();
    };
  }, [gl, scene, camera, size]);

  return null;
};

export default BloomEffect;
