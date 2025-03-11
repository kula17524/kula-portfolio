import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import BloomEffect from "../components/BloomEffect";
import SphereWithPoints from "../components/SphereWithPoints";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { EffectComposer } from "@react-three/postprocessing";
import FloatingBubbles from "../components/FloatingBubbles";
import ResponsiveCamera from "../features/useResponsiveCamera";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#001122" }}>
      <>
        <Canvas
          key={Date.now()}
          style={{
            height: "100vh",
            width: "100vw",
            zIndex: 2,
            top: 0,
            left: 0,
            background: "#001122",
          }}
          camera={{ position: [0, 0, 15], fov: 30 }} // カメラの位置と視野角を設定
        >
          <ResponsiveCamera />
          <SphereWithPoints />
          <BloomEffect />
          <ambientLight intensity={1} color="cyan" />

          <EffectComposer>
            <Fluid
              showBackground={true}
              backgroundColor="#001122"
              fluidColor="#001122"
            />
          </EffectComposer>

          <FloatingBubbles />
        </Canvas>
      </>
      <Box
        className="title-anim-box"
        sx={{
          position: "absolute",
          zIndex: 3,
          top: "10px",
          left: "10px",
          userSelect: "none",
          height: { xs: "3rem", sm: "4rem", md: "5rem", lg: "6rem" },
        }}
      >
        <Typography
          className="title-anim-p"
          fontSize={{ xs: "3rem", sm: "4rem", md: "5rem", lg: "6rem" }}
          fontWeight={"light"}
          sx={{
            color: "white",
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            userSelect: "none",
          }}
        >
          PORTFOLIO
        </Typography>
      </Box>
      <Box
        className="title-anim-box"
        sx={{
          zIndex: 3,
          position: "absolute",
          top: {
            xs: "calc(20px + 3rem)",
            sm: "calc(20px + 4rem)",
            md: "calc(20px + 5rem)",
            lg: "calc(20px + 6rem)",
          },
          userSelect: "none",
          left: "10px",
          height: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
        }}
      >
        <Typography
          className="title-anim-p"
          fontSize={{ xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" }}
          fontWeight={"light"}
          sx={{
            color: "white",
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            userSelect: "none",
          }}
        >
          - China Ohkura -
        </Typography>
      </Box>

      <Button
        onClick={() => navigate("/profile")}
        disableRipple
        component="span"
        className="title-anim-box line-1 cursor-pointer"
        sx={{
          border: "none",
          borderRadius: "none",
          position: "absolute",
          background: "transparent !important",
          cursor: "pointer",
          padding: "0 0 3px 0",
          top: {
            xs: "calc(100vh - 60px - 5rem)",
            sm: "calc(100vh - 60px - 6rem)",
            md: "calc(100vh - 60px - 7rem)",
            lg: "calc(100vh - 60px - 8rem)",
          },
          left: "20px",
          zIndex: 3,
        }}
      >
        <Typography
          className="title-anim-p line-1 cursor-pointer"
          sx={{
            color: "white",
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem", lg: "4rem" },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            fontWeight: "light",
            textTransform: "none",
            paddingBottom: "10px",
            zIndex: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: "2px", // 文字の下に線を引く
              width: "100%",
              height: "10px",
              background: "white",
              transform: "scaleX(0)", // 初期状態は非表示
              transformOrigin: "right",
              transition: "transform 0.3s ease-out", // なめらかに表示
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ホバー時に左から右へ表示
              transformOrigin: "left",
            },
            "&:active": {
              // ボタンが押された時のスタイル
              transform: "scale(0.95)", // ボタンを縮めるだけ
            },
          }}
        >
          PROFILE
        </Typography>
      </Button>
      <Button
        onClick={() => navigate("/work")}
        disableRipple
        component="span"
        className="title-anim-box line-1 cursor-pointer"
        sx={{
          border: "none",
          borderRadius: "none",
          position: "absolute",
          background: "transparent !important",
          cursor: "pointer",
          padding: "0 0 3px 0",
          top: {
            xs: "calc(100vh - 30px - 2.5rem)",
            sm: "calc(100vh - 30px - 3rem)",
            md: "calc(100vh - 30px - 3.5rem)",
            lg: "calc(100vh - 30px - 4rem)",
          },
          left: "20px",
          zIndex: 3,
        }}
      >
        <Typography
          className="title-anim-p line-1 cursor-pointer"
          sx={{
            color: "white",
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem", lg: "4rem" },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            fontWeight: "light",
            textTransform: "none",
            paddingBottom: "10px",
            zIndex: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: "2px", // 文字の下に線を引く
              width: "100%",
              height: "10px",
              background: "white",
              transform: "scaleX(0)", // 初期状態は非表示
              transformOrigin: "right",
              transition: "transform 0.3s ease-out", // なめらかに表示
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ホバー時に左から右へ表示
              transformOrigin: "left",
            },
            "&:focus::after": {
              transform: "scaleX(1)", // ホバー時に左から右へ表示
              transformOrigin: "left",
            },
            "&:active": {
              // ボタンが押された時のスタイル
              transform: "scale(0.95)", // ボタンを縮めるだけ
            },
          }}
        >
          WORK
        </Typography>
      </Button>

      <Box
        className="title-anim-box line-2"
        sx={{
          zIndex: 3,
          position: "absolute",
          top: "calc(100vh - 50px)",
          userSelect: "none",
          right: "10px",
        }}
      >
        <Typography
          className="title-anim-p line-2"
          fontSize="1rem"
          fontWeight={"light"}
          sx={{
            color: "white",
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            userSelect: "none",
          }}
        >
          Music by shivue Lounge
        </Typography>
      </Box>
    </div>
  );
};

export default Home;
