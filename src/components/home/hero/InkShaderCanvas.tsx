"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;

float dist(vec2 a, vec2 b) {
  return length(a - b);
}

void main() {
  vec2 uv = v_uv;
  uv.x *= u_res.x / max(u_res.y, 1.0);

  float v = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 p = vec2(
      0.35 + 0.2 * sin(u_time * 0.7 + fi * 1.7),
      0.45 + 0.18 * cos(u_time * 0.55 + fi * 2.1)
    );
    float d = dist(uv, p);
    float ink = 0.55 + 0.35 * sin(u_time + fi);
    v += ink * exp(-d * d * 18.0);
  }

  vec3 col = mix(vec3(0.976, 0.976, 0.976), vec3(1.0, 0.467, 0.133), clamp(v, 0.0, 1.0));
  gl_FragColor = vec4(col, clamp(v * 0.85 + 0.15, 0.0, 1.0));
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type InkShaderCanvasProps = {
  /** When false, the draw loop pauses. */
  active: boolean;
  className?: string;
};

/**
 * Tiny WebGL ink preview for the Code hover panel.
 * Pauses when inactive or off-screen; no-ops if WebGL is unavailable.
 */
export default function InkShaderCanvas({
  active,
  className,
}: InkShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    const draw = (now: number) => {
      if (!activeRef.current || !visible) {
        raf = 0;
        return;
      }
      resize();
      gl.clearColor(0.976, 0.976, 0.976, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (raf || !activeRef.current || !visible) return;
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) kick();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    kick();

    // Expose kick for active toggles via custom event
    const onKick = () => kick();
    canvas.addEventListener("ink-kick", onKick);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("ink-kick", onKick);
      if (raf) cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    canvasRef.current?.dispatchEvent(new Event("ink-kick"));
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}
