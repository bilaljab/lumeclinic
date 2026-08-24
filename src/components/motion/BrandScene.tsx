"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { getColor } from "@/config/theme";

/**
 * Ashima/McEwan simplex noise (public domain) — one hand-rolled GLSL function,
 * no extra dependency, injected into MeshStandardMaterial's own vertex shader
 * via onBeforeCompile so the blob keeps real PBR lighting for free instead of
 * a fully hand-written lighting shader.
 */
const SIMPLEX_NOISE_GLSL = `
  vec3 mod289(vec3 x){return x-floor(x/289.0)*289.0;}
  vec4 mod289(vec4 x){return x-floor(x/289.0)*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

function readProgress(sectionId: string): number {
  const el = document.getElementById(sectionId);
  if (!el) return 0;
  const raw = getComputedStyle(el).getPropertyValue("--sc-p").trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

function OrganicBlob({ sectionId }: { sectionId: string }) {
  const meshRef = useRef<Mesh>(null);
  const uniforms = useRef({ uTime: { value: 0 }, uIntensity: { value: 0.05 } });

  useFrame(() => {
    const t = performance.now() / 1000;
    const progress = readProgress(sectionId);
    uniforms.current.uTime.value = t;
    uniforms.current.uIntensity.value = 0.05 + progress * 0.18;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08 + progress * Math.PI * 0.6;
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.15;
    }
  });

  return (
    // Tapered toward the top and elongated on Y: a suspended serum droplet
    // reads as "science made visible" for a skincare brand, not a generic
    // abstract blob — see the shader's taper term below for how the pinch
    // is formed.
    <mesh ref={meshRef} scale={[0.85, 1.3, 0.85]}>
      {/* detail 5 (~10k vertices): a lower subdivision reads as the banned
          low-poly-diorama look once noise displaces each vertex along its
          own normal — this needs enough density for the surface to stay
          soft and liquid rather than faceted. */}
      <icosahedronGeometry args={[1.4, 5]} />
      <meshStandardMaterial
        color={getColor("accent")}
        roughness={0.25}
        metalness={0.05}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.current.uTime;
          shader.uniforms.uIntensity = uniforms.current.uIntensity;
          shader.vertexShader = `
            uniform float uTime;
            uniform float uIntensity;
            ${SIMPLEX_NOISE_GLSL}
            ${shader.vertexShader}
          `.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            float tip = smoothstep(-1.4, 1.4, position.y);
            float taper = mix(1.0, 0.5, pow(tip, 1.6));
            transformed.xz *= taper;
            float freq = mix(0.7, 1.7, tip);
            float n = snoise(normal * freq + uTime * 0.1);
            transformed += normal * n * uIntensity * mix(1.0, 0.45, tip);
            `,
          );
        }}
      />
    </mesh>
  );
}

/**
 * The Brand Statement "Science" beat's one signature 3D moment
 * (LUME_CREATIVE_DIRECTION.md "3D Direction") — an abstract organic form,
 * rotation/distortion tied to the pinned section's scroll progress by
 * reading the --sc-p custom property the ScrollCraft engine already
 * publishes on the section element every frame. No ScrollTrigger, no
 * coupling to the engine's JS API.
 */
export function BrandScene({ sectionId }: { sectionId: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} color={getColor("canvas")} />
      <OrganicBlob sectionId={sectionId} />
    </Canvas>
  );
}
