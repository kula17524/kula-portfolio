import React from "react";
import { useNavigate } from "react-router";
import { Box, Typography, Chip, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { GitHub, OpenInNew } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Text, Line } from "@react-three/drei";
import { motion } from "framer-motion";

// 順に光が広がるアニメーション
const igniteBorder = keyframes`
  0% { box-shadow: 0 0 2px rgba(255, 255, 255, 0.3); border-color: rgba(255, 255, 255, 0.3); }
  25% { box-shadow: 2px 0 6px rgba(255, 255, 255, 0.6); border-color: rgba(255, 255, 255, 0.6); }
  50% { box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 0.8); }
  75% { box-shadow: 0px 2px 18px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
`;

const OutlineCircle = () => {
  const points: [number, number, number][] = Array.from(
    { length: 1500 },
    (_, i) => {
      const angle: number = (i / 1500) * Math.PI * 2;
      return [Math.cos(angle) * 10, Math.sin(angle) * 10, -25]; // 半径5の円
    }
  );

  return (
    <Line
      points={points} // 円の点を指定
      color="white" // 枠線の色
      lineWidth={0.3} // 枠線の太さ
      opacity={0.5}
    />
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Canvas
        style={{
          height: "100dvh",
          width: "100dvw",
          background: "#001B33",
          overflow: "hidden",
          position: "fixed",
          zIndex: "-1",
        }}
        camera={{ position: [0, 0, 20], fov: 30 }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[0, 2, 5]} intensity={0.5} />
        <EffectComposer>
          <OutlineCircle />
          <Text
            font="./Fonts/Lora-VariableFont_wght.ttf"
            fontSize={4}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, -25]} // 奥に配置するためにz軸で位置を調整
            strokeColor="white" // 白抜き文字の線の色（黒）
            strokeWidth={0.02} // 白抜き文字の幅を調整
            strokeOpacity={0.5}
            maxWidth={200} // 文字が長くなり過ぎないようにする
            fillOpacity={0}
          >
            PROFILE
          </Text>
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
      <div
        style={{
          height: "100dvh",
          width: "100dvw",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box
          m={0}
          p={0}
          justifyContent="center"
          sx={{
            width: "90%",
            marginLeft: "5%", // 左側の余白
            marginRight: "5%", // 右側の余白
            marginTop: "5%",
          }}
        >
          <img
            src={"./img/profile/prof.png"}
            alt={"プロフィール画像"}
            style={{
              width: "min(60dvw, 60dvh)", // 画面の小さい方に合わせる
              height: "min(60dvw, 60dvh)", // 正方形にする
              objectFit: "cover",
              margin: "auto",
              display: "block",
              borderRadius: "50%",
            }}
          />

          <Box display="flex" alignItems="center">
            <Typography
              variant="h3"
              fontWeight="bold"
              color="white"
              gutterBottom
              fontFamily="Noto Sans JP"
            >
              大倉 千波
            </Typography>
            <Typography
              variant="h6"
              color="white"
              fontFamily="Noto Sans JP"
              sx={{ ml: 3 }}
            >
              おおくら ちな
            </Typography>
          </Box>
          <Typography
            fontSize={"1.1rem"}
            fontWeight="bold"
            color="white"
            gutterBottom
            fontFamily="Noto Sans JP"
          >
            和歌山大学システム工学部メディアデザインメジャー
            <br />
            デザインシステム計画研究室
          </Typography>

          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
            mt={3}
          >
            こんにちは！和歌山大学25卒の大倉千波と申します。
            <br />
            高校では美術部、大学ではゲーム制作団体(プログラマー部門)に所属していました。
            <br />
            メインはプログラマーですが、デザインや企画などを兼任・担当することも多いです。
            <br />
            制作についてもWeb、デスクトップアプリ、ゲームなど、ジャンルを問わず取り組んでいます。
          </Typography>

          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.8rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
            mt={1}
          >
            <span style={{ whiteSpace: "nowrap" }}>※</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              本サイトおよびGitHubには、これまでの制作物を幅広くまとめておりますが、
              卒業研究やアルバイト先への提供システムなど、セキュリティ等を考慮し掲載していないものもございます。
              ご理解のほど何卒よろしくお願いいたします。
            </span>
          </Typography>

          <Typography
            color="white"
            variant="h5"
            fontFamily={"Noto Sans JP"}
            fontWeight={"bold"}
            mt={3}
          >
            資格・実績
          </Typography>

          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2020年7月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              実用英語技能検定試験 2級 合格
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2021年9月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              TOEIC Listening & Reading Test 675点 取得
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2023年3月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              和歌山大学データサイエンス・AI教育プログラム ダイヤモンドレベル
              取得
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2023年4月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              ITパスポート試験 合格
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2024年2月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              基本情報技術者試験 合格
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span style={{ whiteSpace: "nowrap" }}>2025年3月：</span>
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              和歌山大学システム工学部メディアデザインメジャー 成績優秀学生
            </span>
          </Typography>
          <Typography
            color="#DDE7F0"
            fontFamily={"Noto Sans JP"}
            fontSize={"0.9rem"}
            display="flex"
            gap={0.1}
            alignItems="flex-start"
          >
            <span
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                fontSize: "0.7rem",
              }}
            >
              ※制作物に関する実績は、各作品の詳細をご確認ください。
            </span>
          </Typography>
        </Box>
        <Box
          marginTop={3}
          mb={3}
          display="flex"
          justifyContent="center"
          gap={2}
        >
          <IconButton
            key={"button_prof_1"}
            target="_blank"
            href={"https://github.com/kula17524"}
            rel="noopener noreferrer"
            component="a"
            sx={{
              color: "white",
              width: "9rem",
              borderColor: "white",
              borderStyle: "solid",
              borderRadius: "8px",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.9rem",
              fontFamily: "'Noto Sans JP','Montserrat', 'Roboto', sans-serif",
              transition: "all 0.3s ease-in-out",
              "&:hover, &:focus": {
                animation: `${igniteBorder} 0.3s linear forwards`,
              },
              "&.Mui-disabled": {
                color: "lightgray", // 文字色を変更
                borderColor: "lightgray", // 枠線の色を変更
                opacity: 0.5, // 透明度を調整（好みに応じて）
              },
            }}
          >
            <GitHub />
            GitHub
          </IconButton>
          <IconButton
            key={"button_prof_1"}
            target="_blank"
            href={
              "https://www.openbadge-global.com/ns/portal/openbadge/public/assertions/user/aUNaVitLOE5CamhrSklOV1E1S3VHUT09"
            }
            rel="noopener noreferrer"
            component="a"
            sx={{
              color: "white",
              width: "10rem",
              borderColor: "white",
              borderStyle: "solid",
              borderRadius: "8px",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.9rem",
              fontFamily: "'Noto Sans JP','Montserrat', 'Roboto', sans-serif",
              transition: "all 0.3s ease-in-out",
              "&:hover, &:focus": {
                animation: `${igniteBorder} 0.3s linear forwards`,
              },
              "&.Mui-disabled": {
                color: "lightgray", // 文字色を変更
                borderColor: "lightgray", // 枠線の色を変更
                opacity: 0.5, // 透明度を調整（好みに応じて）
              },
            }}
          >
            <OpenInNew />
            オープンバッジ
          </IconButton>
        </Box>

        <Box mb={5}></Box>
      </div>
    </div>
  );
};

export default Profile;
