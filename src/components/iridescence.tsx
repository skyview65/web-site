"use client";

import { useEffect, useRef, useState } from "react";
import { VERT_SRC, FRAG_SRC } from "@/lib/iridescence-shader";

/**
 * The living iridescent ground. A fixed full-screen WebGL canvas painting a
 * slow nacre / oil-slick field (see iridescence-shader.ts). It sits behind the
 * whole site (z-0) and replaces the static `.bg-wash`.
 *
 * Robustness:
 * - Renders at a capped, slightly downscaled resolution (the field is soft, so
 *   this is invisible and much cheaper).
 * - Pauses when the tab is hidden; honors `prefers-reduced-motion` by drawing a
 *   single static frame and stopping the loop.
 * - On no-WebGL / context-loss it stays transparent and the CSS fallback
 *   (`.iri-fallback`, in globals.css) shows through.
 */
export function Iridescence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      setWebglOk(false);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 760;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) {
      setWebglOk(false);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      setWebglOk(false);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebglOk(false);
      return;
    }
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");
    const uMobile = gl.getUniformLocation(prog, "uMobile");
    gl.uniform1f(uIntensity, 1.0);
    gl.uniform1f(uMobile, mobile ? 1 : 0);

    const dprCap = mobile ? 1.0 : 1.4;
    const downscale = 0.7; // soft field hides the lower internal resolution

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * downscale;
      const w = Math.max(2, Math.floor(window.innerWidth * dpr));
      const h = Math.max(2, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    let raf = 0;
    let start = 0;
    let running = false;

    const frame = (now: number) => {
      if (!start) start = now;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running) raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduce) play();
    };
    const onResize = () => {
      resize();
      if (reduce || !running) {
        gl.uniform1f(uTime, 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      stop();
      setWebglOk(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    if (reduce) {
      gl.uniform1f(uTime, 6.0); // a pleasing static frame
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      play();
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!lost) {
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      }
    };
  }, []);

  return (
    <div className="iri" aria-hidden="true">
      <div className="iri-fallback" />
      {webglOk && <canvas ref={canvasRef} className="iri-canvas" />}
      <div className="iri-veil" />
    </div>
  );
}
