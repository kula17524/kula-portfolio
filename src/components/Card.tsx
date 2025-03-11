import { useState, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

type CardProps = {
  textureUrl: string;
  title: string;
  description: string;
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  imageWidth?: number;
  imageHeight?: number;
  position?: [number, number, number];
};

const Card: React.FC<CardProps> = ({
  textureUrl,
  title,
  description,
  backgroundColor = "#001B33", // 背景色を透明に変更
  headerColor = "#001B33",
  borderColor = "#001B33", // 縁の色を白に設定
  width = 3,
  height = 5,
  imageWidth = 2.2,
  imageHeight = 2.2,
  position = [0, 1, 0],
}) => {
  const ref = useRef<THREE.Group>(null);

  // publicディレクトリから画像を読み込む
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  // スクロール位置を保持する状態
  const [scrollY, setScrollY] = useState(0);

  // スクロールイベントのリスナーを設定
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // スクロール位置を更新
    };

    window.addEventListener("scroll", handleScroll);

    // コンポーネントがアンマウントされる際にイベントリスナーを解除
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      // refを使ってclassNameを直接適用する方法
      ref.current.userData.className = "cursor-pointer";
    }
  }, []);

  // スクロール位置に基づいてカードの位置を動的に変更
  const dynamicPosition: [number, number, number] = [
    position[0],
    position[1] + scrollY * 0.01, // スクロールに合わせて位置を調整
    position[2],
  ];

  // カスタムのShaderMaterialでぼかし効果を作成
  const glowShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(borderColor) },
      intensity: { value: 1.5 },
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float intensity;
      varying vec3 vPosition;
      void main() {
        float len = length(vPosition);
        gl_FragColor = vec4(color * intensity * (1.0 - len), 1.0);
      }
    `,
  });

  return (
    <group ref={ref} name="card" position={dynamicPosition}>
      {/* RoundedBoxの縁に白い色を設定し、ShaderMaterialを適用 */}
      <RoundedBox
        position={[0, 0, -0.3]}
        args={[width + 0.2, height + 0.2, 0.25]}
        radius={0.1}
        smoothness={4}
      >
        <primitive object={glowShaderMaterial} transparent opacity={0} />
      </RoundedBox>

      {/* 背景を透明に設定 */}
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={backgroundColor} transparent opacity={0} />
      </mesh>

      {/* ヘッダー部分 */}
      <mesh position={[0, height / 2 - 0.3, -0.1]}>
        <planeGeometry args={[width, 0.5]} />
        <meshStandardMaterial color={headerColor} transparent opacity={0} />
      </mesh>

      <Text
        position={[0, height / 2 - 0.3, 0]}
        fontSize={0.275}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {title}
      </Text>

      {/* 画像 */}
      <mesh position={[0, 0.5, -0.05]}>
        <planeGeometry args={[imageWidth + 0.1, imageHeight + 0.1]} />
        <meshStandardMaterial color="white" transparent opacity={0} />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[imageWidth, imageHeight]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* 説明部分 */}
      <mesh position={[0, -1.6, -0.05]}>
        <planeGeometry args={[width - 0.4, 1.5]} />
        <meshStandardMaterial color="#001B33" transparent opacity={0} />
      </mesh>

      <Text
        position={[0, -1.6, 0]}
        fontSize={0.15}
        color="white"
        maxWidth={width - 0.4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.5}
      >
        {description}
      </Text>
    </group>
  );
};

export default Card;
