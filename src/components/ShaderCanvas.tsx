import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useScroll, Text } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

// シェーダーコード（CodePen の実装に準拠）
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScrollDirection;
  float PI = 3.1415926535897932384626433832795;
  void main(){
    vUv = uv;
    vec3 pos = position;
    // 横方向の変形（振幅、振動数は uTime に依存）
    float amp = 0.03;
    float freq = 0.01 * uTime;
    // 縦方向の変形（スクロール方向に応じて反転）
    float tension = -0.001 * uTime;
    // スクロール方向によって y 座標の歪み方向を反転
    pos.x = pos.x + sin(pos.y * PI  * freq) * amp;
    pos.y += cos(pos.x * PI) * tension * uScrollDirection; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }`;
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uTime;
  void main(){
    // 画像とプレーンのアスペクト比を比較し、短い方に合わせる
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
    );
    // UV 調整してテクスチャを中央に配置
    vec2 fixedUv = vec2(
      (vUv.x - 0.5) * ratio.x + 0.5,
      (vUv.y - 0.5) * ratio.y + 0.5
    );
    vec2 offset = vec2(0.0, uTime * 0.0005);
    float r = texture2D(uTexture, fixedUv + offset).r;
    float g = texture2D(uTexture, fixedUv + offset * 0.5).g;
    float b = texture2D(uTexture, fixedUv).b;
    gl_FragColor = vec4(vec3(r, g, b), 1.0);
    float exposure = 1.0;
    vec3 color = texture2D(uTexture, fixedUv + offset).rgb * exposure;
    color = pow(color, vec3(1.0/0.6)); // ガンマ補正
    gl_FragColor = vec4(color, 1.0);
  }`;

// 画像データの型定義
interface ImageData {
  // 画像パス
  src: string;
  id: string;
  // 基準位置（スクロール開始時の座標、単位はワールド座標）
  x: number;
  y: number;
  narrowY: number;
  z: number;
  isLeft: boolean;
  // タイトルと説明文の位置
  titleX: number;
  titleY: number;
  titleNarrowY: number;
  // サイズ（ワールド単位、Canvas 内のカメラ設定に合わせる）
  width: number;
  height: number;
  // 内容
  title: string;
  titleLong: boolean;
  description: string;
  programming: boolean;
  design: boolean;
  planning: boolean;
}

// ImagePlane コンポーネント
// このコンポーネントは、各画像を Plane にしてシェーダーでゆがみを表現します。
// useScroll() によりスクロールの delta を取得し、それを uTime に反映しています。
interface ImagePlaneProps {
  data: ImageData;
}
const ImagePlane: React.FC<ImagePlaneProps> = ({ data }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const tagRef = useRef<THREE.Mesh>(null);
  const textSubRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const { size } = useThree();
  const navigate = useNavigate();

  const breakpoint = 1.6;
  const [aspect, setAspect] = useState<number>(0);

  // ホバー状態を管理
  const [isHovered, setIsHovered] = useState(false);

  // スクロール方向の変化を追跡
  const scrollDirection = useRef(0);
  const [prevOffset, setPrevOffset] = useState(0);
  const [smoothDirection, setSmoothDirection] = useState(0);

  const texture = useLoader(THREE.TextureLoader, data.src);
  const uniforms = useRef({
    uTexture: { value: texture },
    uImageAspect: { value: 1 },
    uPlaneAspect: { value: data.width / data.height },
    uTime: { value: 0 },
    uScrollDirection: { value: scrollDirection.current },
  });

  useEffect(() => {
    if (texture.image) {
      uniforms.current.uImageAspect.value =
        texture.image.width / texture.image.height;
    }
  }, [texture]);

  useFrame(() => {
    const delta = scroll.delta;
    const direction = delta > prevOffset ? -1 : delta < prevOffset ? 1 : 0;
    setSmoothDirection((prev) => prev + (direction - prev) * 0.1);
    setAspect(size.width / size.height);

    setPrevOffset(delta);

    if (
      !meshRef.current ||
      !textRef.current ||
      !textSubRef.current ||
      !tagRef.current
    )
      return;
    // 場所
    if (aspect <= breakpoint) {
      if (size.width > 500) {
        meshRef.current.position.set(0, data.narrowY, -5);
        textRef.current.position.set(-3.1, data.titleNarrowY, -5);
        tagRef.current.position.set(-3.1, data.titleNarrowY - 0.6, -5);
        textSubRef.current.position.set(-3.1, data.titleNarrowY - 1.2, -5);
      } else if (size.width > 350) {
        meshRef.current.position.set(0, data.narrowY, -10);
        textRef.current.position.set(-3.1, data.titleNarrowY, -10);
        tagRef.current.position.set(-3.1, data.titleNarrowY - 0.6, -10);
        textSubRef.current.position.set(-3.1, data.titleNarrowY - 1.2, -10);
      } else {
        meshRef.current.position.set(0, data.narrowY, -15);
        textRef.current.position.set(-3.1, data.titleNarrowY, -15);
        tagRef.current.position.set(-3.1, data.titleNarrowY - 0.6, -15);
        textSubRef.current.position.set(-3.1, data.titleNarrowY - 1.2, -15);
      }
    } else {
      meshRef.current.position.set(data.x, data.y, data.z);
      textRef.current.position.set(data.titleX, data.titleY, data.z + 2);
      if (data.isLeft)
        tagRef.current.position.set(data.titleX, data.titleY - 0.6, data.z + 2);
      else
        tagRef.current.position.set(
          data.titleX - 5.5,
          data.titleY - 0.6,
          data.z + 2
        );
      textSubRef.current.position.set(
        data.titleX,
        data.titleY - 1.2,
        data.z + 2
      );
    }
    if (data.titleLong) {
      textRef.current.position.y -= 0.3;
      tagRef.current.position.y -= 0.6;
      textSubRef.current.position.y -= 0.6;
    }
    // サイズ
    meshRef.current.scale.set(data.width, data.height, 1);

    uniforms.current.uPlaneAspect.value = data.width / data.height;
    uniforms.current.uTime.value = delta * 15000;
    uniforms.current.uScrollDirection.value = smoothDirection;
  });
  const [currentZ, setCurrentZ] = useState(0);
  const [targetZ, setTargetZ] = useState(0);
  const stiffness = 0.2; // バネの強さ
  const damping = 0.8;

  useEffect(() => {
    setAspect(size.width / size.height);
    let velocity = 0; // 速度
    let position = currentZ;
    if (aspect <= breakpoint) {
      if (size.width > 500) {
        setTargetZ(isHovered ? -2.5 : -5);
      } else if (size.width > 350) {
        setTargetZ(isHovered ? -7.5 : -10);
      } else {
        setTargetZ(isHovered ? -12.5 : -15);
      }
    } else {
      setTargetZ(isHovered ? data.z + 2.5 : data.z);
    }
    const springAnimation = () => {
      // バネの力で位置を更新
      const force = (targetZ - position) * stiffness - velocity * damping;
      velocity += force; // 速度を更新
      position += velocity; // 位置を更新

      // 目標に近づいたらアニメーションを終了
      if (Math.abs(targetZ - position) < 0.01 && Math.abs(velocity) < 0.01) {
        position = targetZ;
      }

      setCurrentZ(position);
    };

    const interval = setInterval(springAnimation, 16); // 約60fpsで更新

    return () => clearInterval(interval); // クリーンアップ
  }, [isHovered, targetZ, size]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = currentZ; // 位置を反映
    }
  });

  // 画像クリック時にページ遷移
  const handleClick = (id: string) => {
    navigate(`/${id}`); // 例: 詳細ページに遷移
  };

  // 角丸の四角形の形状を作成
  const roundedRectShape = new THREE.Shape();
  const width = 1.7;
  const height = 0.4;
  const radius = 0.2; // 角の丸みの半径

  roundedRectShape.moveTo(-width / 2 + radius, height / 2); // 左上の角
  roundedRectShape.lineTo(width / 2 - radius, height / 2); // 上辺
  roundedRectShape.quadraticCurveTo(
    width / 2,
    height / 2,
    width / 2,
    height / 2 - radius
  ); // 右上角
  roundedRectShape.lineTo(width / 2, -height / 2 + radius); // 右辺
  roundedRectShape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2 - radius,
    -height / 2
  ); // 右下角
  roundedRectShape.lineTo(-width / 2 + radius, -height / 2); // 下辺
  roundedRectShape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2,
    -height / 2 + radius
  ); // 左下角
  roundedRectShape.lineTo(-width / 2, height / 2 - radius); // 左辺
  roundedRectShape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2 + radius,
    height / 2
  ); // 左上角

  // パスの頂点を取得
  const points = roundedRectShape.getPoints();

  // ラインジオメトリを作成
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // ラインのマテリアル（枠線だけなので線の色を指定）
  const material1 = new THREE.LineBasicMaterial({
    color: data.programming ? 0xffffff : 0x4c5f70, // 枠線の色
    linewidth: 5, // 枠線の太さ
  });
  const material2 = new THREE.LineBasicMaterial({
    color: data.design ? 0xffffff : 0x4c5f70, // 枠線の色
    linewidth: 5, // 枠線の太さ
  });
  const material3 = new THREE.LineBasicMaterial({
    color: data.planning ? 0xffffff : 0x4c5f70, // 枠線の色
    linewidth: 5, // 枠線の太さ
  });

  // ラインを作成
  const line1 = new THREE.LineLoop(geometry, material1);
  const line2 = new THREE.LineLoop(geometry, material2);
  const line3 = new THREE.LineLoop(geometry, material3);

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={() => setIsHovered(true)} // ホバー時
        onPointerOut={() => setIsHovered(false)} // ホバーを外した時
        onClick={() => handleClick(data.id)} // クリック時
      >
        <planeGeometry args={[1, 1, 100, 100]} />
        <shaderMaterial
          uniforms={uniforms.current}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <group ref={textRef}>
        {data.title.split("\n").map((line, index) => (
          <mesh
            key={index}
            position={
              data.titleLong
                ? new THREE.Vector3(0, 0.3 - index * 0.6, 0)
                : new THREE.Vector3(0, 0, 0)
            }
          >
            <Text
              font="./Fonts/NotoSansJP-Bold.ttf"
              fontSize={0.6}
              fontWeight={"normal"}
              color="#ffffff"
              anchorX={data.isLeft || aspect <= breakpoint ? "left" : "right"}
              anchorY="middle"
            >
              {line}
            </Text>
          </mesh>
        ))}
      </group>

      <group ref={tagRef}>
        <mesh position={new THREE.Vector3(0.8, 0, 0)}>
          {/* 角丸四角形の枠線 */}
          <primitive object={line1} />
          {/* 文字 */}
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.2}
            fontWeight={"normal"}
            color={data.programming ? "#ffffff" : "#4C5F70"} // 白色
            anchorX="center"
            anchorY="middle"
          >
            プログラミング
          </Text>
        </mesh>
        <mesh position={new THREE.Vector3(2.6, 0, 0)}>
          {/* 角丸四角形の枠線 */}
          <primitive object={line2} />
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.2}
            fontWeight={"normal"}
            color={data.design ? "#ffffff" : "#4C5F70"}
            anchorX="center"
            anchorY="middle"
          >
            デザイン
          </Text>
        </mesh>

        <mesh position={new THREE.Vector3(4.4, 0, 0)}>
          {/* 角丸四角形の枠線 */}
          <primitive object={line3} />
          <Text
            font="./Fonts/NotoSansJP-Bold.ttf"
            fontSize={0.2}
            fontWeight={"normal"}
            color={data.planning ? "#ffffff" : "#4C5F70"}
            anchorX="center"
            anchorY="middle"
          >
            企画
          </Text>
        </mesh>
      </group>
      <group ref={textSubRef}>
        {data.description.split("\n").map((line, index) => (
          <mesh key={index} position={new THREE.Vector3(0, -index * 0.3, 0)}>
            <Text
              font="./Fonts/NotoSansJP-Regular.ttf"
              fontSize={0.25}
              fontWeight={"normal"}
              color="#ffffff"
              anchorX={data.isLeft || aspect <= breakpoint ? "left" : "right"}
              anchorY="middle"
            >
              {line}
            </Text>
          </mesh>
        ))}
      </group>
    </>
  );
};
// ImagePlanes コンポーネント
// ここでは、あらかじめ定義した画像データ配列を元に ImagePlane を生成します。
interface ImagePlanesProps {}
const ImagePlanes: React.FC<ImagePlanesProps> = () => {
  const imagesData: ImageData[] = [
    {
      src: "./img/nimeton/nimeton.jpeg",
      id: "nimeton",
      x: -3.1,
      y: 1,
      narrowY: 1,
      z: 3.58,
      isLeft: true,
      titleX: -0.8,
      titleY: 1.6,
      titleNarrowY: -0.3 - 5.13 / 3,
      width: 3.9,
      height: 5,
      title: "Nimetön",
      titleLong: false,
      description: "高校の美術部としての活動で制作した\n美術作品",
      programming: false,
      design: true,
      planning: false,
    },
    {
      src: "./img/egg/title.png",
      id: "egg",
      x: 3.1,
      y: -4.5,
      narrowY: -6.2,
      z: -2,
      isLeft: false,
      titleX: 0,
      titleY: -3.5,
      titleNarrowY: -7.2 - 3.37 / 3,
      width: 6,
      height: 3.37,
      title: "たまごの\nモーニングルーティーン",
      titleLong: true,
      description: "制限時間内に牧場から脱出する\n3Dアクションバカゲー",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/blumull/site.PNG",
      id: "blumull",
      x: -3.1,
      y: -10,
      narrowY: -13,
      z: 1.31,
      isLeft: true,
      titleX: -3 + 6.2 / 2,
      titleY: -9.1,
      titleNarrowY: -12.6 - 4.5 / 2,
      width: 6.2,
      height: 2.85,
      title: "BluMüll",
      titleLong: false,
      description:
        "ゴミ箱の位置を投稿してポイ捨てを防ぐ\nユーザー投稿型Webマッピングサービス",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/webdesign/matsubara.png",
      id: "webdesign",
      x: 3.1,
      y: -14.5,
      narrowY: -19.5,
      z: 0.78,
      isLeft: false,
      titleX: 0.1,
      titleY: -13.5,
      titleNarrowY: -20.7 - 3.77 / 3,
      width: 5.6,
      height: 3.77,
      title: "地元紹介サイト+α",
      titleLong: false,
      description:
        "地元紹介サイト、プログラミング学習支援サイトなど\n5種類のサイトまとめ",
      programming: true,
      design: true,
      planning: false,
    },
    {
      src: "./img/remotesoftware/pos.png",
      id: "software",
      x: -3.1,
      y: -20,
      narrowY: -26.5,
      z: 2.58,
      isLeft: true,
      titleX: -0.2,
      titleY: -19,
      titleNarrowY: -28 - 3.19 / 3,
      width: 5.5,
      height: 3.91,
      title: "リモートに適した\nソフトウェア提案",
      titleLong: true,
      description:
        "Withコロナ時代に適した\nオールインワンのタスク管理ソフトの提案",
      programming: false,
      design: true,
      planning: true,
    },
    {
      src: "./img/mouse/poster.jpg",
      id: "mouse",
      x: 3.1,
      y: -25.5,
      narrowY: -34.5,
      z: 0.54,
      isLeft: false,
      titleX: 0,
      titleY: -24.5,
      titleNarrowY: -35.7 - 3.89 / 3,
      width: 5.7,
      height: 4.03,
      title: "マウスデザインと\nポスター制作",
      titleLong: true,
      description:
        "個人に合わせた多様な持ち方ができる\nマウスのデザインおよび模型製作とポスター制作",
      programming: false,
      design: true,
      planning: true,
    },
    {
      src: "./img/money/title.png",
      id: "money",
      x: -3.1,
      y: -31,
      narrowY: -42.5,
      z: 0.29,
      isLeft: true,
      titleX: 0,
      titleY: -30,
      titleNarrowY: -43.7 - 3.85 / 3,
      width: 6,
      height: 3.85,
      title: "課金してもらえる\nゲームとは",
      titleLong: true,
      description: "どんなゲームがより課金してもらえるか\nについての分析と考察",
      programming: false,
      design: false,
      planning: true,
    },
    {
      src: "./img/package/mikuji.png",
      id: "package",
      x: 3.1,
      y: -36.5,
      narrowY: -50.5,
      z: 3,
      isLeft: false,
      titleX: 0.2,
      titleY: -35.5,
      titleNarrowY: -51.7 - 4.13 / 3,
      width: 5.5,
      height: 4.13,
      title: "製品パッケージと\nブースのデザイン",
      titleLong: true,
      description:
        "「えんぴつ御籤」の製品パッケージと展示ブースの\nデザインとポスター制作",
      programming: false,
      design: true,
      planning: true,
    },
    {
      src: "./img/gamekj/title.png",
      id: "rhythm",
      x: -3.1,
      y: -42,
      narrowY: -58,
      z: 3.88,
      isLeft: true,
      titleX: 0,
      titleY: -41,
      titleNarrowY: -59 - 3.32 / 3,
      width: 6,
      height: 3.32,
      title: "スマホ向け\nリズムゲーム分析",
      titleLong: true,
      description:
        "スマートフォン向けリズムゲームの\n人気や評価の要因についての分析と考察",
      programming: false,
      design: false,
      planning: true,
    },
    {
      src: "./img/seikyoapp/negative.png",
      id: "seikyo",
      x: 3.1,
      y: -48,
      narrowY: -66,
      z: 2.98,
      isLeft: false,
      titleX: 0.4,
      titleY: -47,
      titleNarrowY: -67.7 - 3.32 / 3,
      width: 5,
      height: 4.64,
      title: "大学生協アプリの\n問題点分析",
      titleLong: true,
      description:
        "大学生協アプリ(公式)に関する\nレビューに基づく問題点の分析と考察",
      programming: true,
      design: false,
      planning: false,
    },
    {
      src: "./img/lume/title.png",
      id: "lume",
      x: -3.1,
      y: -53.5,
      narrowY: -74,
      z: 0.33,
      isLeft: true,
      titleX: 0,
      titleY: -52.7,
      titleNarrowY: -75.2 - 3.71 / 3,
      width: 5.8,
      height: 3.71,
      title: "Lume.",
      titleLong: false,
      description: "射撃と同時に灯りがともる\nネットワーク対戦型3DFPSゲーム",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/kotatsu/kotatsu1.jpg",
      id: "kotatsu",
      x: 3.1,
      y: -58,
      narrowY: -81,
      z: -1.5,
      isLeft: false,
      titleX: 0,
      titleY: -57,
      titleNarrowY: -82.2 - 3.33 / 3,
      width: 6,
      height: 3.33,
      title: "走れ！撃て！\nKOTATSU-1グランプリ",
      titleLong: true,
      description:
        "ジェットエンジン付きのコタツで爆走する\n3Dレースシューティングゲーム",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/heater/top.png",
      id: "heater",
      x: -3.1,
      y: -63,
      narrowY: -89,
      z: 2.98,
      isLeft: true,
      titleX: 0,
      titleY: -62,
      titleNarrowY: -90.2 - 4.04 / 3,
      width: 5.8,
      height: 4.04,
      title: "ヒーターデザインと\nECサイト",
      titleLong: true,
      description:
        "人もドリンクも温められるヒーターの提案と\nECサイトのモックアップ制作",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/apart/page1.png",
      id: "apart",
      x: 3.1,
      y: -68.5,
      narrowY: -97,
      z: 3.75,
      isLeft: false,
      titleX: 0.2,
      titleY: -67.7,
      titleNarrowY: -98.2 - 3.89 / 3,
      width: 5.5,
      height: 3.89,
      title: "アパートデザイン",
      titleLong: false,
      description:
        "「古都鎌倉に息づく和モダンの家」をテーマとした\nワーケーションアパートのデザイン",
      programming: false,
      design: true,
      planning: true,
    },
    {
      src: "./img/reocom/title.png",
      id: "reocom",
      x: -3.1,
      y: -73.5,
      narrowY: -104,
      z: 1.85,
      isLeft: true,
      titleX: 0,
      titleY: -72.5,
      titleNarrowY: -105 - 3.19 / 3,
      width: 6,
      height: 3.19,
      title: "ReO.com",
      titleLong: false,
      description:
        "時間配分に着目し、原稿作成や発表練習ができる\n発表支援Webアプリ",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/nusumigui/title.png",
      id: "nusumigui",
      x: 3.1,
      y: -78,
      narrowY: -110.5,
      z: 3.41,
      isLeft: false,
      titleX: 0,
      titleY: -77.2,
      titleNarrowY: -111.5 - 3.37 / 3,
      width: 6,
      height: 3.37,
      title: "ぬすみぐいなう！",
      titleLong: false,
      description:
        "ギミックに耐えながらリンゴをちょうど40個集める\n2Dアクションゲーム",
      programming: true,
      design: false,
      planning: true,
    },
    {
      src: "./img/curler/curler.png",
      id: "curler",
      x: -3.1,
      y: -84,
      narrowY: -117.5,
      z: 2.83,
      isLeft: true,
      titleX: -2.9 + 4.5 / 2,
      titleY: -83,
      titleNarrowY: -118.7 - 4.5 / 3,
      width: 4.5,
      height: 4.5,
      title: "ビューラーの\n分析とデザイン",
      titleLong: true,
      description:
        "既存ビューラーの実験や分析と\n分析結果に基づくビューラーの新規デザインの提案",
      programming: false,
      design: true,
      planning: true,
    },
    {
      src: "./img/kawachi/logo.jpg",
      id: "kawachi",
      x: 3.1,
      y: -89,
      narrowY: -125.2,
      z: 1.3,
      isLeft: false,
      titleX: -1.7 + 1.5,
      titleY: -88.2,
      titleNarrowY: -126.2 - 1,
      width: 6,
      height: 3,
      title: "みなみてかわち！\nロゴデザイン",
      titleLong: true,
      description: "松原市観光サイト「みなみてかわち！」の\nロゴデザイン応募",
      programming: false,
      design: true,
      planning: false,
    },
    {
      src: "./img/oshikey/title.JPG",
      id: "oshikey",
      x: -3.1,
      y: -94,
      narrowY: -132,
      z: 2,
      isLeft: true,
      titleX: 0,
      titleY: -93.5,
      titleNarrowY: -133 - 3.38 / 3,
      width: 6,
      height: 3.38,
      title: "Oshikey",
      titleLong: false,
      description:
        "「推し活×地方創生」をテーマとした\nユーザー投稿型Webマッピングサービス",
      programming: true,
      design: true,
      planning: true,
    },
    {
      src: "./img/portfolio/portfolio.png",
      id: "portfolio",
      x: 3.1,
      y: -99,
      narrowY: -138.5,
      z: 3,
      isLeft: false,
      titleX: 0,
      titleY: -98.5,
      titleNarrowY: -139.7 - 3.26 / 3,
      width: 6,
      height: 3.26,
      title: "PORTFOLIO",
      titleLong: false,
      description: "本サイト",
      programming: true,
      design: true,
      planning: true,
    },
  ];
  return (
    <>
      {imagesData.map((data, index) => (
        <ImagePlane key={index} data={data} />
      ))}
    </>
  );
};

// ShaderCanvas コンポーネント
// このコンポーネントは、ScrollControls 内に配置され、ImagePlanes をレンダリングします。
const ShaderCanvas: React.FC = () => {
  return <ImagePlanes />;
};

export default ShaderCanvas;
