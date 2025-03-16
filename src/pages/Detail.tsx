import React from "react";
import { useNavigate } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Detail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => navigate("/work")}
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
          top: {
            xs: "calc(100vh - 20px - 1.2rem)",
            sm: "calc(100vh - 20px - 1.5rem)",
            md: "calc(100vh - 20px - 1.8rem)",
            lg: "calc(100vh - 20px - 2.1rem)",
          },
          left: "20px",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          "&:active": {
            // ボタンが押された時のスタイル
            transform: "scale(0.95)", // ボタンを縮めるだけ
          },
        }}
      >
        <ArrowBackIosIcon
          className="title-anim-p cursor-pointer"
          sx={{
            color: "white",
            display: "inline-block",
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "1.8rem",
              lg: "2.1rem",
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
              sm: "1.5rem",
              md: "1.8rem",
              lg: "2.1rem",
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

export default Detail;
