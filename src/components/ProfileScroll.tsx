import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useScroll, Text } from "@react-three/drei";

// シェーダーコード（CodePen の実装に準拠）
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScrollDirection;
  float PI = 3.1415926535897932384626433832795;
  void main(){
    vUv = uv;
    vec3 pos = position;
    // 横方向の変形（振幅、振動数は uTime に依存）
    float amp = 0.03;
    float freq = 0.01 * uTime;
    // 縦方向の変形（スクロール方向に応じて反転）
    float tension = -0.001 * uTime;
    // スクロール方向によって y 座標の歪み方向を反転
    pos.x = pos.x + sin(pos.y * PI  * freq) * amp;
    pos.y += cos(pos.x * PI) * tension * uScrollDirection; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }`;
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uTime;
  void main(){
    // 画像とプレーンのアスペクト比を比較し、短い方に合わせる
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
    );
    // UV 調整してテクスチャを中央に配置
    vec2 fixedUv = vec2(
      (vUv.x - 0.5) * ratio.x + 0.5,
      (vUv.y - 0.5) * ratio.y + 0.5
    );
    vec2 offset = vec2(0.0, uTime * 0.0005);
    float r = texture2D(uTexture, fixedUv + offset).r;
    float g = texture2D(uTexture, fixedUv + offset * 0.5).g;
    float b = texture2D(uTexture, fixedUv).b;
    gl_FragColor = vec4(vec3(r, g, b), 1.0);
    float exposure = 1.0;
    vec3 color = texture2D(uTexture, fixedUv + offset).rgb * exposure;
    color = pow(color, vec3(1.0/0.6)); // ガンマ補正
    gl_FragColor = vec4(color, 1.0);
  }`;

const ImagePlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const tagRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const { size } = useThree();

  const breakpoint = 1.6;
  const [aspect, setAspect] = useState<number>(0);

  // ホバー状態を管理
  const [isHovered, setIsHovered] = useState(false);

  // スクロール方向の変化を追跡
  const scrollDirection = useRef(0);
  const [prevOffset, setPrevOffset] = useState(0);
  const [smoothDirection, setSmoothDirection] = useState(0);

  const texture = useLoader(THREE.TextureLoader, "./img/profile/prof.JPG");
  const uniforms = useRef({
    uTexture: { value: texture },
    uImageAspect: { value: 1 },
    uPlaneAspect: { value: 1 },
    uTime: { value: 0 },
    uScrollDirection: { value: scrollDirection.current },
  });

  useEffect(() => {
    if (texture.image) {
      uniforms.current.uImageAspect.value =
        texture.image.width / texture.image.height;
    }
  }, [texture]);

  useFrame(() => {
    const delta = scroll.delta;
    const direction = delta > prevOffset ? -1 : delta < prevOffset ? 1 : 0;
    setSmoothDirection((prev) => prev + (direction - prev) * 0.1);
    setAspect(size.width / size.height);

    setPrevOffset(delta);

    if (!meshRef.current || !textRef.current || !tagRef.current) return;
    // 場所

    meshRef.current.position.set(0, 0, -5);
    textRef.current.position.set(-3.1, -1, -5);
    tagRef.current.position.set(-3.1, -1.6, -5);

    // サイズ
    meshRef.current.scale.set(7, 7, 1);

    uniforms.current.uPlaneAspect.value = 1;
    uniforms.current.uTime.value = delta * 15000;
    uniforms.current.uScrollDirection.value = smoothDirection;
  });
  const [currentZ, setCurrentZ] = useState(0);
  const [targetZ, setTargetZ] = useState(0);
  const stiffness = 0.2; // バネの強さ
  const damping = 0.8;

  useEffect(() => {
    setAspect(size.width / size.height);
    let velocity = 0; // 速度
    let position = currentZ;
    if (aspect <= breakpoint) {
      if (size.width > 500) {
        setTargetZ(-5);
      } else if (size.width > 350) {
        setTargetZ(-10);
      } else {
        setTargetZ(-15);
      }
    } else {
      setTargetZ(0);
    }
    const springAnimation = () => {
      // バネの力で位置を更新
      const force = (targetZ - position) * stiffness - velocity * damping;
      velocity += force; // 速度を更新
      position += velocity; // 位置を更新

      // 目標に近づいたらアニメーションを終了
      if (Math.abs(targetZ - position) < 0.01 && Math.abs(velocity) < 0.01) {
        position = targetZ;
      }

      setCurrentZ(position);
    };

    const interval = setInterval(springAnimation, 16); // 約60fpsで更新

    return () => clearInterval(interval); // クリーンアップ
  }, [isHovered, targetZ, size]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = currentZ; // 位置を反映
    }
  });

  // 角丸の四角形の形状を作成
  const roundedRectShape = new THREE.Shape();
  const width = 1.7;
  const height = 0.4;
  const radius = 0.2; // 角の丸みの半径

  roundedRectShape.moveTo(-width / 2 + radius, height / 2); // 左上の角
  roundedRectShape.lineTo(width / 2 - radius, height / 2); // 上辺
  roundedRectShape.quadraticCurveTo(
    width / 2,
    height / 2,
    width / 2,
    height / 2 - radius
  ); // 右上角
  roundedRectShape.lineTo(width / 2, -height / 2 + radius); // 右辺
  roundedRectShape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2 - radius,
    -height / 2
  ); // 右下角
  roundedRectShape.lineTo(-width / 2 + radius, -height / 2); // 下辺
  roundedRectShape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2,
    -height / 2 + radius
  ); // 左下角
  roundedRectShape.lineTo(-width / 2, height / 2 - radius); // 左辺
  roundedRectShape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2 + radius,
    height / 2
  ); // 左上角

  // パスの頂点を取得
  const points = roundedRectShape.getPoints();

  // ラインジオメトリを作成
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // ラインのマテリアル（枠線だけなので線の色を指定）
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff, // 枠線の色
    linewidth: 5, // 枠線の太さ
  });

  // ラインを作成
  const line = new THREE.LineLoop(geometry, material);
  const line2 = new THREE.LineLoop(geometry, material);

  return (
    <>
      <mesh ref={meshRef}>
        <circleGeometry args={[0.5, 100]} />
        <shaderMaterial
          uniforms={uniforms.current}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <group ref={textRef}>
        <mesh key={"title"} position={new THREE.Vector3(0, 0, 0)}>
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.6}
            fontWeight={"normal"}
            color="#ffffff"
          >
            大倉千波
          </Text>
        </mesh>
      </group>

      <group ref={tagRef}>
        <mesh position={new THREE.Vector3(0.8, 0, 0)}>
          {/* 角丸四角形の枠線 */}
          <primitive object={line} />
          {/* 文字 */}
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.2}
            fontWeight={"normal"}
            color={"#ffffff"} // 白色
            anchorX="center"
            anchorY="middle"
          >
            GitHub
          </Text>
        </mesh>
        <mesh position={new THREE.Vector3(2.6, 0, 0)}>
          {/* 角丸四角形の枠線 */}
          <primitive object={line2} />
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.2}
            fontWeight={"normal"}
            color={"#ffffff"}
            anchorX="center"
            anchorY="middle"
          >
            オープンバッジ
          </Text>
        </mesh>
      </group>
    </>
  );
};

// ShaderCanvas コンポーネント
// このコンポーネントは、ScrollControls 内に配置され、ImagePlanes をレンダリングします。
const ProfileScroll: React.FC = () => {
  return <ImagePlane />;
};

export default ProfileScroll;
