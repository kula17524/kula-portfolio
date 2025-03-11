import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import BloomEffect from "../components/BloomEffect";
import SphereWithPoints from "../components/SphereWithPoints";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { EffectComposer } from "@react-three/postprocessing";
import FloatingBubbles from "../components/FloatingBubbles";
import ResponsiveCamera from "../stores/useResponsiveCamera";
import CloseIcon from "@mui/icons-material/Close";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#001B33" }}>
      <>
        <Canvas
          key={Date.now()}
          style={{
            height: "100vh",
            width: "100vw",
            zIndex: 2,
            top: 0,
            left: 0,
            background: "#001B33",
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
              backgroundColor="#001B33"
              fluidColor="#001B33"
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
          userSelect: "none",
          height: { xs: "3rem", sm: "4rem", md: "5rem", lg: "6rem" },
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-80%)",
        }}
      >
        <Typography
          className="title-anim-p"
          fontSize={{ xs: "3rem", sm: "4rem", md: "5rem", lg: "6rem" }}
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
          userSelect: "none",
          height: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
          top: "50%",
          left: "50%",
          transform: "translate(-50%,30%)",
        }}
      >
        <Typography
          className="title-anim-p"
          fontSize={{ xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" }}
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
            xs: "calc(100vh - 60px - 3rem)",
            sm: "calc(100vh - 60px - 4rem)",
            md: "calc(100vh - 60px - 5rem)",
            lg: "calc(100vh - 60px - 6rem)",
          },
          left: "20px",
          zIndex: 3,
        }}
      >
        <Typography
          className="title-anim-p line-1 cursor-pointer"
          sx={{
            color: "white",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            textTransform: "none",
            paddingBottom: "5px",
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
            xs: "calc(100vh - 30px - 2rem)",
            sm: "calc(100vh - 30px - 2.5rem)",
            md: "calc(100vh - 30px - 3rem)",
            lg: "calc(100vh - 30px - 3.5rem)",
          },
          left: "20px",
          zIndex: 3,
        }}
      >
        <Typography
          className="title-anim-p line-1 cursor-pointer"
          sx={{
            color: "white",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            textTransform: "none",
            paddingBottom: "5px",
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

      <Box sx={{ position: "absolute", top: 1, right: 10, zIndex: 3 }}>
        <Stack direction="row" spacing={0.3}>
          {[...Array(3)].map((_, index) => (
            <Typography
              key={`cross_${index}`}
              fontSize="4rem"
              fontWeight={"light"}
              sx={{
                color: "white",
                fontFamily: "'Montserrat', 'Roboto', sans-serif",
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              ×
            </Typography>
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
