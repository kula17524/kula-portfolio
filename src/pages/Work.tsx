import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Scroll, ScrollControls, Text, Line } from "@react-three/drei";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Typography, Button } from "@mui/material";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import ShaderCanvas from "../components/ShaderCanvas";

const OutlineCircle = () => {
  const points: [number, number, number][] = Array.from(
    { length: 1500 },
    (_, i) => {
      const angle: number = (i / 1500) * Math.PI * 2;
      return [Math.cos(angle) * 6, Math.sin(angle) * 6, -10]; // 半径5の円
    }
  );

  return (
    <Line
      points={points} // 円の点を指定
      color="white" // 枠線の色
      lineWidth={0.5} // 枠線の太さ
      opacity={0.5}
    />
  );
};

const ScrollControlsWrapper = () => {
  const { size } = useThree();
  const [pages, setPages] = useState(1); // ステートでページ数を管理
  const prevPages = useRef(pages);

  // `ShaderCanvas` の全 `ImagePlane` の y 座標を取得
  const calculatePages = () => {
    const aspectRatio = size.width / size.height;

    // `pages` をスクロール範囲に応じて計算
    return aspectRatio > 1.6 ? 9.5 : 13.3; // 1ページあたり10の高さ
  };

  // 初回レンダリング & 画面リサイズ時に `pages` を更新
  useLayoutEffect(() => {
    const updatePages = () => {
      const newPages = calculatePages();
      if (newPages !== prevPages.current) {
        setPages(newPages);
        prevPages.current = newPages;
      }
    };

    updatePages(); // 初回設定
    window.addEventListener("resize", updatePages); // リサイズ時に更新
    return () => window.removeEventListener("resize", updatePages); // クリーンアップ
  }, [size]);

  return (
    <ScrollControls damping={0.2} pages={pages}>
      <Scroll>
        <ShaderCanvas />
      </Scroll>
    </ScrollControls>
  );
};

const Work: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          background: "#001B33",
          overflow: "hidden",
        }}
        camera={{ position: [0, 0, 20], fov: 30 }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[0, 2, 5]} intensity={0.5} />
        <EffectComposer>
          <OutlineCircle />
          <Text
            font="./Fonts/Lora-VariableFont_wght.ttf"
            fontSize={3}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, -10]} // 奥に配置するためにz軸で位置を調整
            strokeColor="white" // 白抜き文字の線の色（黒）
            strokeWidth={0.02} // 白抜き文字の幅を調整
            strokeOpacity={0.5}
            maxWidth={200} // 文字が長くなり過ぎないようにする
            fillOpacity={0}
          >
            WORK
          </Text>
          <ScrollControlsWrapper />
          <Fluid
            radius={0.03}
            curl={7}
            swirl={5}
            distortion={1}
            force={2}
            pressure={0.94}
            densityDissipation={0.98}
            velocityDissipation={0.99}
            intensity={0.3}
            rainbow={false}
            blend={0}
            showBackground={true}
            backgroundColor="#001B33"
            fluidColor="#001B33"
          />
        </EffectComposer>
      </Canvas>

      <Button
        onClick={() => navigate("/")}
        disableRipple
        component="span"
        className="title-anim-box cursor-pointer"
        sx={{
          border: "none",
          borderRadius: "none",
          position: "absolute",
          background: "transparent !important",
          cursor: "pointer",
          padding: "0 0 3px 0",
          top: "20px",
          left: "20px",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowBackIosIcon
          className="title-anim-p cursor-pointer"
          sx={{
            color: "white",
            display: "inline-block",
            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
              md: "1.6rem",
              lg: "1.8rem",
            },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            textTransform: "none",
            paddingBottom: "9px",
            zIndex: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: "2px", // 文字の下に線を引く
              width: "100%",
              height: "5px",
              background: "white",
              transform: "scaleX(0)", // 初期状態は非表示
              transformOrigin: "right",
              transition: "transform 0.3s ease-out", // なめらかに表示
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ホバー時に左から右へ表示
              transformOrigin: "left",
            },
          }}
        />
        <Typography
          className="title-anim-p cursor-pointer"
          sx={{
            color: "white",
            display: "inline-block",
            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
              md: "1.6rem",
              lg: "1.8rem",
            },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            textTransform: "none",
            paddingBottom: "10px",
            zIndex: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: "2px", // 文字の下に線を引く
              width: "100%",
              height: "5px",
              background: "white",
              transform: "scaleX(0)", // 初期状態は非表示
              transformOrigin: "right",
              transition: "transform 0.3s ease-out", // なめらかに表示
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ホバー時に左から右へ表示
              transformOrigin: "left",
            },
          }}
        >
          MENU
        </Typography>
      </Button>
    </div>
  );
};

export default Work;
