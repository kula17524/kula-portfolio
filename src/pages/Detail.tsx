import React from "react";
import { useNavigate } from "react-router";
import { Box, Typography, Chip, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useParams } from "react-router-dom";
import PdfViewer from "../components/PdfViewer";
import ReactPlayer from "react-player";
import { projectData } from "../types/type";
import { GitHub, OpenInNew, Public } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import Grid from "@mui/material/Grid2";

// 順に光が広がるアニメーション
const igniteBorder = keyframes`
  0% { box-shadow: 0 0 2px rgba(255, 255, 255, 0.3); border-color: rgba(255, 255, 255, 0.3); }
  25% { box-shadow: 2px 0 6px rgba(255, 255, 255, 0.6); border-color: rgba(255, 255, 255, 0.6); }
  50% { box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 0.8); }
  75% { box-shadow: 0px 2px 18px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
`;

// 型定義を追加
interface ButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}
const isYouTube = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const project = projectData[id as keyof typeof projectData];
  const images = [
    { src: project.image1, title: project.image1title },
    { src: project.image2, title: project.image2title },
    { src: project.image3, title: project.image3title },
  ].filter((img) => img.src !== "none" && img.title !== "none");

  const isVideoYouTube = isYouTube(project.url);

  // ボタン用のリストを作成し、"none" のものを除外
  const buttons: ButtonProps[] = [
    project.github !== "none" && {
      href: project.github,
      icon: <GitHub />,
      label: "GitHub",
    },
    project.release !== "none" && {
      href: project.release,
      icon: <OpenInNew />,
      label: "公開先へ移動",
    },
    !isVideoYouTube &&
      project.url !== "none" && {
        href: project.url,
        icon: <Public />,
        label: "参考サイト",
      },
  ].filter(Boolean) as ButtonProps[];

  if (!project) {
    return <p>データが見つかりません</p>;
  }
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
          BACK
        </Typography>
      </Button>

      <div
        style={{
          height: "100vh",
          width: "100vw",
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
          }}
        >
          {project.thumbnail != "none" && (
            <img
              src={project.thumbnail}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "100vw",
                maxHeight: "100vh",
                objectFit: "contain",
                margin: "auto",
                display: "block",
                borderRadius: "10px",
              }}
            />
          )}
          {project.title != "none" && (
            <Typography
              variant="h3"
              fontWeight={"bold"}
              color="white"
              gutterBottom
              fontFamily={"Noto Sans JP"}
            >
              {project.title}
            </Typography>
          )}
          {project.genre != null && (
            <Box
              display="flex"
              justifyContent="left"
              gap={2}
              sx={{ marginBottom: 4 }}
            >
              <Chip
                label="プログラミング"
                variant="outlined"
                sx={{
                  width: "125px",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "normal",
                  borderRadius: "15px",
                  borderWidth: "1.5px",
                  borderColor: project.genre.program ? "#ffffff" : "#4C5F70",
                  color: project.genre.program ? "#ffffff" : "#4C5F70",
                }}
              />
              <Chip
                label="デザイン"
                variant="outlined"
                sx={{
                  width: "125px",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "normal",
                  borderRadius: "15px",
                  borderWidth: "1.5px",
                  borderColor: project.genre.design ? "#ffffff" : "#4C5F70",
                  color: project.genre.design ? "#ffffff" : "#4C5F70",
                }}
              />
              <Chip
                label="企画"
                variant="outlined"
                sx={{
                  width: "125px",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "normal",
                  borderRadius: "15px",
                  borderWidth: "1.5px",
                  borderColor: project.genre.plan ? "#ffffff" : "#4C5F70",
                  color: project.genre.plan ? "#ffffff" : "#4C5F70",
                }}
              />
            </Box>
          )}
          <Typography
            color="white"
            variant="h5"
            fontFamily={"Noto Sans JP"}
            fontWeight={"bold"}
          >
            概要
          </Typography>
          {project.date != "none" && (
            <Typography
              color="#DDE7F0"
              fontFamily={"Noto Sans JP"}
              fontSize={"0.9rem"}
              display="flex"
              gap={0.1}
              alignItems="flex-start"
            >
              <span style={{ whiteSpace: "nowrap" }}>制作時期：</span>
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.date}
              </span>
            </Typography>
          )}
          {project.period != "none" && (
            <Typography
              color="#DDE7F0"
              fontFamily={"Noto Sans JP"}
              fontSize={"0.9rem"}
              display="flex"
              gap={0.1}
              alignItems="flex-start"
            >
              <span style={{ whiteSpace: "nowrap" }}>制作期間：</span>
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.period}
              </span>
            </Typography>
          )}
          {project.member != "none" && (
            <Typography
              color="#DDE7F0"
              fontFamily={"Noto Sans JP"}
              fontSize={"0.9rem"}
              display="flex"
              gap={0.1}
              alignItems="flex-start"
            >
              <span style={{ whiteSpace: "nowrap" }}>制作人数：</span>
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.member}
              </span>
            </Typography>
          )}
          {project.tasks != "none" && (
            <Typography
              color="#DDE7F0"
              fontFamily={"Noto Sans JP"}
              fontSize={"0.9rem"}
              display="flex"
              gap={0.1}
              alignItems="flex-start"
            >
              <span style={{ whiteSpace: "nowrap" }}>担当箇所：</span>
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.tasks}
              </span>
            </Typography>
          )}
          {project.skill != "none" && (
            <Typography
              color="#DDE7F0"
              fontFamily={"Noto Sans JP"}
              fontSize={"0.9rem"}
              display="flex"
              gap={0.1}
              alignItems="flex-start"
            >
              <span style={{ whiteSpace: "nowrap" }}>使用技術：</span>
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.skill}
              </span>
            </Typography>
          )}

          {project.description != "none" && (
            <>
              <Typography
                color="white"
                variant="h5"
                fontFamily={"Noto Sans JP"}
                fontWeight={"bold"}
                sx={{ marginTop: 3 }}
              >
                詳細
              </Typography>
              <Typography
                color="#DDE7F0"
                fontFamily={"Noto Sans JP"}
                fontSize={"1rem"}
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {project.description}
              </Typography>
            </>
          )}

          {(project.award1 != "none" || project.award2 != "none") && (
            <>
              <Typography
                color="white"
                variant="h5"
                fontFamily={"Noto Sans JP"}
                fontWeight={"bold"}
                sx={{ marginTop: 3 }}
              >
                受賞歴
              </Typography>
              <Typography
                color="#DDE7F0"
                fontFamily={"Noto Sans JP"}
                fontSize={"0.9rem"}
                display="flex"
                gap={0.1}
                alignItems="flex-start"
              >
                {project.award1 != "none" && project.award1}
                {project.award2 != "none" && "、"}
                {project.award2 != "none" && project.award2}
              </Typography>
            </>
          )}
          {isVideoYouTube && (
            <>
              <Typography
                color="white"
                variant="h5"
                fontFamily={"Noto Sans JP"}
                fontWeight={"bold"}
                sx={{ marginTop: 3 }}
              >
                参考動画
              </Typography>
              <Box display="flex" justifyContent="center" marginBottom={3}>
                <ReactPlayer
                  url={project.url}
                  width="90%"
                  height="400px"
                  controls
                />
              </Box>
            </>
          )}
          {images && (
            <Grid
              container
              spacing={1}
              sx={{
                width: "100%",
                margin: 0,
                padding: 0,
                marginTop: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {images.map((img, index) => (
                <Grid
                  key={index}
                  container
                  direction="column"
                  alignItems="center"
                  sx={{ margin: 0, padding: 0 }}
                  size={{ xs: 4, sm: 4, md: 4 }}
                >
                  <Typography
                    color="white"
                    variant="h6"
                    fontFamily={"Noto Sans JP"}
                    fontWeight={"bold"}
                  >
                    {img.title}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          {images && (
            <Grid
              container
              spacing={1}
              sx={{
                width: "100%",
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {images.map((img, index) => (
                <Grid
                  key={`${index}_grid2`}
                  container
                  direction="column"
                  alignItems="center"
                  sx={{ margin: 0, padding: 0 }}
                  size={{ xs: 4, sm: 4, md: 4 }}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "10px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {project.pdf1 != "none" && (
            <>
              <Typography
                color="white"
                variant="h5"
                fontFamily={"Noto Sans JP"}
                fontWeight={"bold"}
                sx={{ marginTop: 3 }}
              >
                {project.pdf1title}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PdfViewer pdfUrl={project.pdf1} />
              </Box>
            </>
          )}
          {project.pdf2 != "none" && (
            <>
              <Typography
                color="white"
                variant="h5"
                fontFamily={"Noto Sans JP"}
                fontWeight={"bold"}
                sx={{ marginTop: 3 }}
              >
                {project.pdf2title}
              </Typography>
              <PdfViewer pdfUrl={project.pdf2} />
            </>
          )}
          {buttons.length > 0 && (
            <Box
              marginTop={3}
              mb={3}
              display="flex"
              justifyContent="center"
              gap={2}
            >
              {buttons.map((btn, index) => (
                <IconButton
                  key={index}
                  target="_blank"
                  href={btn.href}
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
                    fontFamily:
                      "'Noto Sans JP','Montserrat', 'Roboto', sans-serif",
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
                  {btn.icon}
                  {btn.label}
                </IconButton>
              ))}
            </Box>
          )}
          <Box mb={5}></Box>
        </Box>
      </div>
    </div>
  );
};

export default Detail;
