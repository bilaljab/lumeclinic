"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/components/motion/gsap";
import type { SpatialShowcaseItem } from "./types";
import { TEXTURE_WIDTH, optimizedTextureSrc } from "./textureSrc";

const SPACING = 1.7;
const DEPTH_STEP = 0.9;
const ROTATION_STEP = 0.42;
const NEIGHBOR_SCALE = 0.74;
const NEIGHBOR_OPACITY = 0.42;
const SETTLE_DURATION = 0.65;

type WindowedItem = { item: SpatialShowcaseItem; offset: number };

function computeWindow(items: SpatialShowcaseItem[], activeIndex: number, radius: number): WindowedItem[] {
  const result: WindowedItem[] = [];
  for (let offset = -radius; offset <= radius; offset++) {
    const index = activeIndex + offset;
    if (index < 0 || index >= items.length) continue;
    result.push({ item: items[index], offset });
  }
  return result;
}

function GalleryPlane({
  src,
  offset,
  geometry,
  rtl,
}: {
  src: string;
  offset: number;
  geometry: THREE.PlaneGeometry;
  rtl: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const enteredRef = useRef(false);
  const rawTexture = useLoader(THREE.TextureLoader, optimizedTextureSrc(src, TEXTURE_WIDTH));
  // TextureLoader defaults to NoColorSpace; the renderer's sRGB output then
  // applies its transfer function on top of already-sRGB photo data,
  // double-gamma-correcting it into the washed-out/overbright look the CSS
  // fallback stage (plain <Image>, no color-management pipeline) doesn't
  // have. `rawTexture` is a hook return value the React Compiler forbids
  // mutating (its cache is shared across every plane using this URL), so a
  // cheap per-plane `clone()` — same underlying decoded image, no refetch —
  // is what actually gets the corrected colorSpace, and this clone (unlike
  // the shared original) is ours to dispose.
  const texture = useMemo(() => {
    const clone = rawTexture.clone();
    clone.colorSpace = THREE.SRGBColorSpace;
    clone.needsUpdate = true;
    return clone;
  }, [rawTexture]);
  useEffect(() => () => texture.dispose(), [texture]);

  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 }),
    [texture],
  );
  const { invalidate } = useThree();
  const sign = rtl ? -1 : 1;

  // Materials are created per plane (only the map differs), so each one is
  // disposed as its plane leaves the active/neighbor window — same lifecycle
  // for the cloned texture above, via its own effect.
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const target = {
      x: offset * sign * SPACING,
      z: -Math.abs(offset) * DEPTH_STEP,
      rotY: offset * sign * -ROTATION_STEP,
      scale: offset === 0 ? 1 : NEIGHBOR_SCALE,
      opacity: offset === 0 ? 1 : NEIGHBOR_OPACITY,
    };

    if (!enteredRef.current) {
      // First appearance in the window: start one slot further out and
      // fade in, rather than snapping straight to its resting spot.
      enteredRef.current = true;
      const enterSign = Math.sign(offset || 1) * sign;
      gsap.set(mesh.position, { x: target.x + enterSign * SPACING * 0.6, z: target.z - DEPTH_STEP * 0.5 });
      gsap.set(mesh.scale, { x: target.scale * 0.9, y: target.scale * 0.9 });
      gsap.set(material, { opacity: 0 });
    }

    const tweens = [
      gsap.to(mesh.position, {
        x: target.x,
        z: target.z,
        duration: SETTLE_DURATION,
        ease: "power3.out",
        onUpdate: invalidate,
      }),
      gsap.to(mesh.rotation, {
        y: target.rotY,
        duration: SETTLE_DURATION,
        ease: "power3.out",
        onUpdate: invalidate,
      }),
      gsap.to(mesh.scale, {
        x: target.scale,
        y: target.scale,
        duration: SETTLE_DURATION,
        ease: "power3.out",
        onUpdate: invalidate,
      }),
      gsap.to(material, {
        opacity: target.opacity,
        duration: SETTLE_DURATION,
        ease: "power3.out",
        onUpdate: invalidate,
      }),
    ];
    invalidate();

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [offset, sign, material, invalidate]);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function GalleryScene({
  items,
  activeIndex,
  mode,
  rtl,
  neighborWindow,
}: {
  items: SpatialShowcaseItem[];
  activeIndex: number;
  mode: "treatment" | "doctor";
  rtl: boolean;
  neighborWindow: number;
}) {
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(mode === "doctor" ? 1.7 : 1.9, mode === "doctor" ? 1.7 : 1.27),
    [mode],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  const windowed = computeWindow(items, activeIndex, neighborWindow);

  return (
    <>
      <ambientLight intensity={1.4} />
      {windowed.map(({ item, offset }) => (
        <Suspense key={item.key} fallback={null}>
          <GalleryPlane src={item.image.src} offset={offset} geometry={geometry} rtl={rtl} />
        </Suspense>
      ))}
    </>
  );
}

export type SpatialStageWebGLProps = {
  items: SpatialShowcaseItem[];
  activeIndex: number;
  mode: "treatment" | "doctor";
  rtl: boolean;
  neighborWindow: number;
};

/**
 * Only the active item + a bounded window of neighbors are ever mounted as
 * meshes (see GalleryScene) — never the full collection. frameloop="demand"
 * keeps the canvas idle at rest; GSAP tweens on mesh/material properties
 * call invalidate() per tick during a transition and stop issuing frames
 * once they complete, so there is no permanent render loop.
 */
export function SpatialStageWebGL(props: SpatialStageWebGLProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 4.4], fov: 32 }}
      aria-hidden
    >
      <GalleryScene {...props} />
    </Canvas>
  );
}
