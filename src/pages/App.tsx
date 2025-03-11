import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";
import Home from "./Home";
import { useBgm } from "../stores/BgmContext";
import Profile from "./Profile";
import Work from "./Work";
import { Button, Stack, Box, Typography } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { keyframes } from "@emotion/react";

// 順に光が広がるアニメーション
const igniteBorder = keyframes`
  0% { box-shadow: 0 0 2px rgba(255, 255, 255, 0.3); border-color: rgba(255, 255, 255, 0.3); }
  25% { box-shadow: 2px 0 6px rgba(255, 255, 255, 0.6); border-color: rgba(255, 255, 255, 0.6); }
  50% { box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 0.8); }
  75% { box-shadow: 0px 2px 18px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
`;

const AudioPrompt: React.FC<{ onSelect: (play: boolean) => void }> = ({
  onSelect,
}) => {
  return (
    <motion.div
      key="audioPrompt"
      className="audio-prompt"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
        sx={{ backgroundColor: "#001122" }}
      >
        <Typography
          variant="h5"
          color="white"
          gutterBottom
          sx={{
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            marginBottom: 5,
          }}
        >
          Shall we play the sound?
        </Typography>
        <Stack direction="row" spacing={4}>
          <Button
            className="cursor-pointer"
            onClick={() => onSelect(true)}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 24px",
              fontSize: "1.1rem",
              fontFamily: "'Montserrat', 'Roboto', sans-serif",
              transition: "all 0.3s ease-in-out",
              "&:hover, &:focus": {
                animation: `${igniteBorder} 0.3s linear forwards`,
              },
            }}
          >
            <VolumeUpIcon fontSize="large" className="cursor-pointer" />
            ON
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => onSelect(false)}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 24px",
              fontSize: "1.1rem",
              fontFamily: "'Montserrat', 'Roboto', sans-serif",
              transition: "all 0.3s ease-in-out",
              "&:hover, &:focus": {
                animation: `${igniteBorder} 0.3s linear forwards`,
              },
            }}
          >
            <VolumeOffIcon fontSize="large" className="cursor-pointer" />
            OFF
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { playBgm, bgmPlaying, stopBgm } = useBgm(); // BGM制御用
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // 2秒後にローディング終了 → 音声確認画面へ
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAudioSelection = (playBgmFlag: boolean) => {
    setIsAudioEnabled(playBgmFlag);
    if (playBgmFlag) {
      playBgm(); // BGM再生
    } else {
      stopBgm(); // BGM停止
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <Loading />
        </motion.div>
      ) : isAudioEnabled === null ? (
        <AudioPrompt onSelect={handleAudioSelection} />
      ) : (
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/work" element={<Work />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
