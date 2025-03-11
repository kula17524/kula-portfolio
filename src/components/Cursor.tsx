import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

// カーソル位置を追跡するカスタムフック
const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return position;
};

const Cursor: React.FC = () => {
  const { x, y } = useMousePosition(); // マウス位置を取得
  const [isHoveredElement, setIsHoveredElement] = useState(false); // カーソルが選択できる要素上にいるか

  // カーソル位置をスムーズにアニメーション
  const cursorStyle = useSpring({
    left: x - 5,
    top: y - 5,
    backgroundColor: isHoveredElement ? "cyan" : "white", // カーソルが要素にホバー時に色変更
    boxShadow: isHoveredElement
      ? "0 0 12px 10px rgba(0, 255, 255, 1)" // シアン発光
      : "0 0 0px 0px rgba(0,0,0,0)",
    scale: isHoveredElement ? 1.1 : 1, // 要素上ではカーソルのサイズを大きく
    config: { mass: 0.1, tension: 300, friction: 10 },
  });

  // 枠線の位置をスムーズにアニメーション
  const borderStyle = useSpring({
    left: x - 15,
    top: y - 15,
    width: isHoveredElement ? 15 : 30, // 要素上では枠線が縮む
    height: isHoveredElement ? 15 : 30,
    opacity: isHoveredElement ? 0 : 1, // ホバー時、または要素上では枠線非表示
    borderColor: isHoveredElement ? "cyan" : "white", // 枠線の色をシアンに変更
    boxShadow: isHoveredElement
      ? "0 0 10px 2px rgba(0, 255, 255, 0.8)" // シアン発光
      : "0 0 0px 0px rgba(0,0,0,0)",
    config: { mass: 1, tension: 200, friction: 20 },
  });

  // マウスホバーイベントの処理
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 指定されたクラス名 'cursor-pointer' がある場合に反応
      if (
        target.classList.contains("cursor-pointer") ||
        target.closest("svg")
      ) {
        setIsHoveredElement(true);
      }
    };

    const handleMouseOut = () => {
      setIsHoveredElement(false);
    };

    // 全ての要素にマウスイベントリスナーを追加
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* 小さな点 (カーソル位置) */}
      <animated.div
        style={{
          position: "fixed",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 1000,
          ...cursorStyle,
        }}
      />

      {/* 遅れて追従する大きな円の枠線 */}
      <animated.div
        style={{
          position: "fixed",
          border: "2px solid white",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999,
          ...borderStyle,
        }}
      />
    </>
  );
};

export default Cursor;
