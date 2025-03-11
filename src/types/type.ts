export type Shader = {
  uniforms: Record<string, { value: any }>;
  vertexShader: string;
  fragmentShader: string;
};
