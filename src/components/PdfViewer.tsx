import React, { useState, useEffect, useMemo, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button, Card, CardContent, Typography } from "@mui/material";
import money from "../pdf/money.pdf";
import gamekj from "../pdf/gamekj.pdf";
import heater_report from "../pdf/heater_report.pdf";
import heater_concept from "../pdf/heater_concept.pdf";
import seikyo from "../pdf/review.pdf";
import reocom_plan from "../pdf/reocom_plan.pdf";
import reocom_guide from "../pdf/reocom_guide.pdf";
import { keyframes } from "@emotion/react";
import "../styles/index.css";

// 順に光が広がるアニメーション
const igniteBorder = keyframes`
  0% { box-shadow: 0 0 2px rgba(255, 255, 255, 0.3); border-color: rgba(255, 255, 255, 0.3); }
  25% { box-shadow: 2px 0 6px rgba(255, 255, 255, 0.6); border-color: rgba(255, 255, 255, 0.6); }
  50% { box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 0.8); }
  75% { box-shadow: 0px 2px 18px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); }
`;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth * 0.7);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // PDF の読み込み完了時の処理
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Memoizing options object for Document component to avoid unnecessary re-renders
  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth * 0.7);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    switch (pdfUrl) {
      case "money":
        setFile(money);
        break;
      case "gamekj":
        setFile(gamekj);
        break;
      case "heater_report":
        setFile(heater_report);
        break;
      case "heater_concept":
        setFile(heater_concept);
        break;
      case "seikyo":
        setFile(seikyo);
        break;
      case "reocom_plan":
        setFile(reocom_plan);
        break;
      case "reocom_guide":
        setFile(reocom_guide);
        break;
      default:
        setFile(null);
        break;
    }
  }, [pdfUrl]);

  return (
    <Card
      ref={pdfContainerRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "auto",
        textAlign: "center",
        backgroundColor: "transparent",
      }}
    >
      <CardContent>
        {/* PDF の表示 */}
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          <Page
            pageNumber={pageNumber}
            width={windowWidth}
            className="pdf-page"
          />
        </Document>

        {/* ページ送り機能 */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="cursor-pointer"
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            前のページ
          </Button>
          <Typography
            variant="body1"
            display="inline"
            color={"white"}
            sx={{
              margin: "0 10px",
              fontFamily: "'Noto Sans JP','Montserrat', 'Roboto', sans-serif",
            }}
          >
            {pageNumber} / {numPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={numPages !== null && pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="cursor-pointer"
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: "1px",
              borderImageSlice: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            次のページ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfViewer;
