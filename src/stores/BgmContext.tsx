import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

interface BgmContextType {
  bgmPlaying: boolean;
  playBgm: () => void;
  stopBgm: () => void;
  audioElement: HTMLAudioElement | null;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

export const BgmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const bgmFile = "./bgm.mp3";

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!audioElementRef.current) {
      const audio = new Audio(bgmFile);
      audio.loop = true;
      audio.volume = 0.5;
      audioElementRef.current = audio;
    }
    return () => {
      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
    };
  }, []);

  const initializeAudioNodes = () => {
    if (!audioElementRef.current || !audioContextRef.current) return;

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(
        audioElementRef.current
      );
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      sourceNodeRef.current.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  };

  const playBgm = async () => {
    if (!audioContextRef.current || !audioElementRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume(); // AudioContextをアクティブ化
    }

    initializeAudioNodes();

    audioElementRef.current
      .play()
      .then(() => setBgmPlaying(true))
      .catch((error) => console.error("BGM再生エラー:", error));
  };

  const stopBgm = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setBgmPlaying(false);
  };

  return (
    <BgmContext.Provider
      value={{
        bgmPlaying,
        playBgm,
        stopBgm,
        audioElement: audioElementRef.current,
        audioContext: audioContextRef.current,
        sourceNode: sourceNodeRef.current,
        analyser: analyserRef.current,
        dataArray: dataArrayRef.current,
      }}
    >
      {children}
    </BgmContext.Provider>
  );
};

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) {
    throw new Error("useBgm must be used within a BgmProvider");
  }
  return context;
};
