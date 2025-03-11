import React, { useMemo } from "react";
import { Point } from "@react-three/drei";
import * as THREE from "three";

const DNA: React.FC = () => {
  const numPoints = 100; // 点の数
  const radius = 5; // 螺旋の半径
  const height = 10; // 螺旋の高さ
  const twist = 5; // 螺旋のねじれ具合

  // 螺旋の形を計算
  const points = useMemo(() => {
    const tempPoints = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 * twist; // ねじれを加える
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (i / numPoints) * height; // 高さ方向
      tempPoints.push(new THREE.Vector3(x, y, z));
    }
    return tempPoints;
  }, [numPoints, radius, height, twist]);

  return (
    <group>
      {/* 点の集合体（DNAの一本） */}
      {points.map((point, index) => (
        <Point key={index} position={point} size={0.1}>
          <meshBasicMaterial color="cyan" />
        </Point>
      ))}
      {/* 二重螺旋のもう一本の点の集合体（もう一つのDNA） */}
      {points.map((point, index) => (
        <Point key={index} position={point.clone().negate()} size={0.1}>
          <meshBasicMaterial color="magenta" />
        </Point>
      ))}
    </group>
  );
};

export default DNA;
