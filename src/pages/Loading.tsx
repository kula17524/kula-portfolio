import React from "react";
import { RingLoader } from "react-spinners";

const Loading: React.FC = () => {
  return (
    <div style={styles.container}>
      <RingLoader color="#ffffff" size={100} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    backgroundColor: "#001B33",
  } as React.CSSProperties,
};

export default Loading;
