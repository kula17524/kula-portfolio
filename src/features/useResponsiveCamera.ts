import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

const ResponsiveCamera = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const updateCamera = () => {
      const aspect = size.width / size.height;
      const baseDistance = 15;
      let fov = 30;
      let distance = baseDistance;

      if (aspect > 1) {
        distance = baseDistance * 1.0;
      } else if (aspect > 0.8) {
        distance = baseDistance * 1.3;
      } else if (aspect > 0.6) {
        distance = baseDistance * 1.5;
      } else if (aspect > 0.5) {
        distance = baseDistance * 1.8;
      } else if (aspect > 0.4) {
        distance = baseDistance * 2.0;
      } else {
        distance = baseDistance * 2.3;
      }
      camera.fov = fov;
      camera.position.z = distance;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    };

    updateCamera();
    window.addEventListener("resize", updateCamera);
    return () => window.removeEventListener("resize", updateCamera);
  }, [camera, size]);

  return null; // JSX は不要
};

export default ResponsiveCamera;
