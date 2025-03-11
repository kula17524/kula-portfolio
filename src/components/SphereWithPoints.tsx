import React, { useRef, useState, useEffect } from "react";
import { useBgm } from "../stores/BgmContext";
import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { throttle } from "lodash";

const SphereWithPoints: React.FC = () => {
  const { bgmPlaying, analyser, dataArray } = useBgm();
  const pointsRef = useRef<any>(null);
  const targetPosition = useRef({ x: 0, y: 0 }); // useRefでマウスの位置を管理
  const lastMousePosition = useRef({ x: 0, y: 0 }); // マウスの最後の位置
  const isMouseMoving = useRef(false); // マウスが動いているかどうかを管理
  const [radius, setRadius] = useState<number>(3);
  const count = 500;
  const positions = useRef<Float32Array>(new Float32Array(count * 3)); // 点の位置をuseRefで管理

  // 初期状態として球の表面に沿って点を配置
  for (let i = 0; i < count; i++) {
    const phi = Math.acos((2 * (i + 0.5)) / count - 1); // thetaの代わりにacosで球面上に均等に配置
    const theta = Math.PI * (1 + Math.sqrt(5)) * i; // Golden angle (黄金角) を使用

    positions.current[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x座標
    positions.current[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y座標
    positions.current[i * 3 + 2] = radius * Math.cos(phi); // z座標
  }

  // `mousemove`のイベントを最適化（throttleで頻度を減らす）
  const handleMouseMove = throttle((event: MouseEvent) => {
    const { clientX, clientY } = event;

    // 前回のマウス位置との移動量を計算
    const deltaX = clientX - lastMousePosition.current.x;
    const deltaY = clientY - lastMousePosition.current.y;

    // 移動量が一定の閾値を超えた場合にマウスが動いているとみなす
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      isMouseMoving.current = true;
      lastMousePosition.current = { x: clientX, y: clientY };
    } else {
      isMouseMoving.current = false; // 移動が小さい場合は動いていないとみなす
    }
  }, 16); // 16msごとに呼ばれる（約60fps）

  // マウスが画面外に出た場合の処理
  const handleMouseLeave = () => {
    isMouseMoving.current = false; // マウスが画面外に出た場合も動いていないとみなす
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 回転の補間とBGMの影響を受ける処理
  useFrame(() => {
    if (bgmPlaying && analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);
      const avgFrequency =
        dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setRadius(2 + (avgFrequency / 256) * 3.5);
    }

    if (pointsRef.current) {
      const constantRotationSpeedX = 0.005;
      const constantRotationSpeedY = 0.005;

      if (isMouseMoving.current) {
        const deltaX =
          (lastMousePosition.current.x / window.innerWidth) * 2 - 1;
        const deltaY =
          -(lastMousePosition.current.y / window.innerHeight) * 2 + 1;

        targetPosition.current = {
          x: deltaX * 0.05,
          y: deltaY * 0.05,
        };
      } else {
        targetPosition.current.x *= 0.95;
        targetPosition.current.y *= 0.95;
      }

      pointsRef.current.rotation.x -=
        constantRotationSpeedX + targetPosition.current.y;
      pointsRef.current.rotation.y +=
        constantRotationSpeedY + targetPosition.current.x;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions.current} frustumCulled={false}>
      <PointMaterial size={0.08} color="cyan" />
    </Points>
  );
};

export default SphereWithPoints;
