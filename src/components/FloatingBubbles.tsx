import React, { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";

interface Bubble {
  id: number;
  position: THREE.Vector3;
  speed: number;
  scale: number;
  opacity: number;
}

const NUM_BUBBLES = 100; // 泡の数を減らしてパフォーマンス向上

const FloatingBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]); // stateで泡を管理

  // 泡を一定間隔で生成
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Math.random(),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 60, // ランダムなX位置
          -10, // 画面下
          (Math.random() - 0.5) * 5 // ランダムなZ位置
        ),
        speed: 0.01 + Math.random() * 0.03, // ランダムな上昇速度
        scale: 0.1 + Math.random() * 0.5, // ランダムなサイズ
        opacity: 0.1 + Math.random() * 0.5, // 透明度をランダムに設定（0.1から0.6）
      };

      setBubbles((prev) => {
        // `bubbles` 配列に新しい泡を追加
        const newBubbles = [...prev, newBubble];
        // 最大数に達した場合、古い泡を削除
        return newBubbles.slice(-NUM_BUBBLES);
      });
    }, 100); // 0.1秒ごとに生成

    return () => clearInterval(interval);
  }, []);

  // 泡の動きを更新
  useFrame(() => {
    setBubbles((prev) =>
      prev.map((bubble) => {
        const newY = bubble.position.y + bubble.speed;
        const newX = bubble.position.x + Math.sin(newY * 0.1) * 0.01; // ゆらぎを追加
        const newZ = bubble.position.z + Math.sin(newY * 0.1) * 0.01; // ゆらぎを追加

        return {
          ...bubble,
          position: new THREE.Vector3(newX, newY, newZ),
        };
      })
    );
  });

  return (
    <>
      {bubbles.map((bubble) => (
        <Sphere
          key={bubble.id}
          args={[bubble.scale, 64, 64]}
          position={bubble.position.toArray()}
        >
          <meshStandardMaterial
            transparent
            opacity={bubble.opacity} // 透明度をランダム値に設定
            color="lightblue"
            roughness={0.1}
            metalness={0.3}
          />
        </Sphere>
      ))}
    </>
  );
};

export default FloatingBubbles;
