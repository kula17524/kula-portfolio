import React from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Scroll, ScrollControls, Image } from "@react-three/drei";
import { motion } from "framer-motion";
import { create } from "zustand";
import { motion as motion3D } from "framer-motion-3d"; // ✅ 3Dオブジェクト用のmotion
import ResponsiveCamera from "../stores/useResponsiveCamera";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Typography, Button } from "@mui/material";
import { Fluid } from "@whatisjery/react-fluid-distortion";

// Itemの型定義
type ItemType = {
  image: string;
  title: string;
};

// Zustandストアの型定義
type StoreType = {
  selectedItem: ItemType | null;
  setSelectedItem: (item: ItemType | null) => void;
};

// Zustandストア作成
const useStore = create<StoreType>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));

// アイテムリスト
const items: ItemType[] = [
  { image: "/img/lume.png", title: "Item 1" },
  { image: "/img/lume2.png", title: "Item 2" },
];

const Work: React.FC = () => {
  const navigate = useNavigate();
  const { selectedItem, setSelectedItem } = useStore();

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        style={{ height: "100vh", width: "100vw", background: "#001B33" }}
      >
        <ResponsiveCamera />
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 2, 5]} intensity={1.5} />
        <EffectComposer>
          <ScrollControls pages={3} damping={0.2}>
            <Scroll>
              {items.map((item, index) => (
                <motion3D.group
                  key={index}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  position={[
                    ((index % 3) - 1) * 2.7,
                    4 - Math.floor(index / 3),
                    0,
                  ]}
                  onClick={() => setSelectedItem(item)}
                >
                  <Image url={item.image} scale={[2.5, 3]} />
                </motion3D.group>
              ))}
            </Scroll>
          </ScrollControls>
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
      {selectedItem && (
        <DetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
      )}
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

// DetailViewの型定義
type DetailViewProps = {
  item: ItemType;
  onBack: () => void;
};

const DetailView: React.FC<DetailViewProps> = ({ item, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.img
        src={item.image}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "50%", borderRadius: "10px" }}
      />
      <Typography variant="h4" color="white" mt={2}>
        {item.title}
      </Typography>
      <Button onClick={onBack} sx={{ color: "white", mt: 2 }}>
        <ArrowBackIosIcon /> BACK
      </Button>
    </motion.div>
  );
};

export default Work;
