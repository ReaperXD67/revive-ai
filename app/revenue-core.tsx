'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion';
import * as THREE from 'three';

type RevenueCoreProps = {
  progress: MotionValue<number>;
};

type ShellPiece = THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhysicalMaterial> & {
  userData: {
    normal: THREE.Vector3;
    drift: number;
    phase: number;
  };
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (start: number, end: number, value: number) => {
  const amount = clamp01((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

function keyedValue(progress: number, points: Array<[number, number]>) {
  if (progress <= points[0][0]) return points[0][1];
  for (let index = 0; index < points.length - 1; index += 1) {
    const [fromProgress, fromValue] = points[index];
    const [toProgress, toValue] = points[index + 1];
    if (progress <= toProgress) {
      const local = smoothstep(fromProgress, toProgress, progress);
      return mix(fromValue, toValue, local);
    }
  }
  return points.at(-1)?.[1] ?? 0;
}

export function RevenueCore({ progress }: RevenueCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const compactScene = window.innerWidth < 760 || deviceMemory <= 4;
    const desiredPixelRatio = () => Math.min(
      window.devicePixelRatio,
      canvas.clientWidth < 760 || deviceMemory <= 4 ? 1.25 : 1.65,
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      stencil: false,
      powerPreference: 'high-performance',
    });
    let maxPixelRatio = desiredPixelRatio();
    let currentPixelRatio = maxPixelRatio;
    renderer.setPixelRatio(currentPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06110e, 0.055);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 0, 8.4);

    const root = new THREE.Group();
    const shell = new THREE.Group();
    const mechanism = new THREE.Group();
    const signalGroup = new THREE.Group();
    root.add(shell, mechanism, signalGroup);
    scene.add(root);

    const ivoryMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe7e3d7,
      metalness: 0.18,
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      emissive: 0x151c16,
      emissiveIntensity: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const shellPieces: ShellPiece[] = [];
    const longitudeCount = 8;
    const latitudeCount = 4;
    const phiGap = 0.035;
    const thetaGap = 0.045;

    for (let latitude = 0; latitude < latitudeCount; latitude += 1) {
      for (let longitude = 0; longitude < longitudeCount; longitude += 1) {
        const phiStart = longitude * ((Math.PI * 2) / longitudeCount) + phiGap;
        const phiLength = (Math.PI * 2) / longitudeCount - phiGap * 2;
        const thetaStart = latitude * (Math.PI / latitudeCount) + thetaGap;
        const thetaLength = Math.PI / latitudeCount - thetaGap * 2;
        const geometry = new THREE.SphereGeometry(
          2.36,
          compactScene ? 14 : 18,
          compactScene ? 9 : 12,
          phiStart,
          phiLength,
          thetaStart,
          thetaLength,
        );
        const material = ivoryMaterial.clone();
        if ((latitude + longitude) % 3 === 0) {
          material.color.setHex(0xb8b9ae);
          material.metalness = 0.38;
        }
        const piece = new THREE.Mesh(geometry, material) as ShellPiece;
        const phi = phiStart + phiLength / 2;
        const theta = thetaStart + thetaLength / 2;
        piece.userData = {
          normal: new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi),
            Math.cos(theta),
            Math.sin(theta) * Math.sin(phi),
          ).normalize(),
          drift: 0.5 + ((longitude * 17 + latitude * 11) % 10) / 12,
          phase: longitude * 0.67 + latitude * 1.13,
        };
        shellPieces.push(piece);
        shell.add(piece);
      }
    }

    const darkGlass = new THREE.MeshPhysicalMaterial({
      color: 0x07120f,
      metalness: 0.74,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x14251d,
      emissiveIntensity: 0.42,
    });
    const innerCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.24, compactScene ? 4 : 5), darkGlass);
    mechanism.add(innerCore);

    const innerWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.27, compactScene ? 1 : 2)),
      new THREE.LineBasicMaterial({ color: 0xbff739, transparent: true, opacity: 0.22 }),
    );
    mechanism.add(innerWire);

    const ringMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x16231d, metalness: 0.88, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x85724a, metalness: 0.92, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xbff739, emissive: 0x597d0f, emissiveIntensity: 1.1, metalness: 0.42, roughness: 0.24 }),
      new THREE.MeshStandardMaterial({ color: 0x28362f, metalness: 0.82, roughness: 0.18 }),
    ];
    const rings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>[] = [];
    [1.46, 1.73, 2.02, 2.24].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, index === 2 ? 0.035 : 0.07, 14, compactScene ? 84 : 120), ringMaterials[index]);
      ring.rotation.set(index * 0.48, index * 0.61, index * 0.28);
      ring.userData.initialRotation = ring.rotation.clone();
      rings.push(ring);
      mechanism.add(ring);
    });

    const energySpineMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9fb3b,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const energySpine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.052, 5.2, 10, 1, true),
      energySpineMaterial,
    );
    mechanism.add(energySpine);

    const studGeometry = new THREE.SphereGeometry(0.045, 8, 8);
    const studMaterial = new THREE.MeshStandardMaterial({ color: 0xa18449, metalness: 0.95, roughness: 0.15 });
    const studs = new THREE.InstancedMesh(studGeometry, studMaterial, 42);
    const studMatrix = new THREE.Matrix4();
    for (let index = 0; index < 42; index += 1) {
      const y = 1 - (index / 41) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = index * Math.PI * (3 - Math.sqrt(5));
      const position = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(2.39);
      studMatrix.makeTranslation(position.x, position.y, position.z);
      studs.setMatrixAt(index, studMatrix);
    }
    shell.add(studs);

    const signalGeometry = new THREE.OctahedronGeometry(0.16, 0);
    const signalMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xe6e2d4, metalness: 0.4, roughness: 0.36 }),
      new THREE.MeshStandardMaterial({ color: 0xbff739, emissive: 0x466208, emissiveIntensity: 0.8 }),
    ];
    const signalNodes: THREE.Mesh[] = [];
    for (let index = 0; index < 6; index += 1) {
      const node = new THREE.Mesh(signalGeometry, signalMaterials[index === 0 ? 1 : 0]);
      const angle = (index / 6) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 3.15, Math.sin(angle * 1.45) * 1.1, Math.sin(angle) * 3.15);
      signalNodes.push(node);
      signalGroup.add(node);
    }

    const particleCount = compactScene ? 180 : 320;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 3.2 + Math.random() * 7.4;
      const theta = Math.random() * Math.PI * 2;
      const vertical = (Math.random() - 0.5) * 7;
      particlePositions[index * 3] = Math.cos(theta) * radius;
      particlePositions[index * 3 + 1] = vertical;
      particlePositions[index * 3 + 2] = Math.sin(theta) * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8a86b,
      size: compactScene ? 0.028 : 0.024,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0xe9f1e8, 1.25);
    const key = new THREE.DirectionalLight(0xfff7dd, 5.2);
    key.position.set(-4, 5, 7);
    const limeLight = new THREE.PointLight(0xbff739, 34, 12, 1.7);
    limeLight.position.set(1.2, -0.6, 2.8);
    const warmLight = new THREE.PointLight(0xd6a85a, 22, 14, 1.8);
    warmLight.position.set(-3.4, -2.1, 2.4);
    scene.add(ambient, key, limeLight, warmLight);

    let currentProgress = progress.get();
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let renderedProgress = currentProgress;
    let previousProgress = renderedProgress;
    let kineticTilt = 0;
    let qualityElapsed = 0;
    let qualityFrames = 0;
    let lastQualityChange = -Infinity;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = new THREE.Timer();
    timer.connect(document);

    const unsubscribeProgress = progress.on('change', (latest) => {
      currentProgress = latest;
    });
    const handlePointer = (event: PointerEvent) => {
      targetPointerX = (event.clientX / window.innerWidth - 0.5) * 0.75;
      targetPointerY = (event.clientY / window.innerHeight - 0.5) * 0.45;
    };
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });
    motionPreference.addEventListener('change', handleMotionPreference);

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      maxPixelRatio = desiredPixelRatio();
      if (currentPixelRatio > maxPixelRatio) {
        currentPixelRatio = maxPixelRatio;
        renderer.setPixelRatio(currentPixelRatio);
      }
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const tuneRenderQuality = (rawDelta: number, timestamp: number) => {
      if (rawDelta <= 0 || rawDelta > 0.25) return;
      qualityElapsed += rawDelta;
      qualityFrames += 1;
      if (qualityElapsed < 1.2) return;

      const averageFrame = qualityElapsed / qualityFrames;
      const canChange = timestamp - lastQualityChange > 1800;
      let nextPixelRatio = currentPixelRatio;
      if (canChange && averageFrame > 1 / 48 && currentPixelRatio > 1) {
        nextPixelRatio = Math.max(1, currentPixelRatio - 0.15);
      } else if (canChange && averageFrame < 1 / 58 && currentPixelRatio < maxPixelRatio - 0.04) {
        nextPixelRatio = Math.min(maxPixelRatio, currentPixelRatio + 0.1);
      }

      if (nextPixelRatio !== currentPixelRatio) {
        currentPixelRatio = nextPixelRatio;
        renderer.setPixelRatio(currentPixelRatio);
        resize();
        lastQualityChange = timestamp;
      }
      qualityElapsed = 0;
      qualityFrames = 0;
    };

    const renderLoop = (timestamp: number) => {
      timer.update(timestamp);
      const rawDelta = timer.getDelta();
      const delta = Math.min(Math.max(rawDelta, 1 / 240), 0.05);
      tuneRenderQuality(rawDelta, timestamp);

      renderedProgress = reducedMotion
        ? 0.73
        : THREE.MathUtils.damp(renderedProgress, clamp01(currentProgress), 8.5, delta);
      const p = clamp01(renderedProgress);
      const progressVelocity = (p - previousProgress) / delta;
      previousProgress = p;
      kineticTilt = THREE.MathUtils.damp(
        kineticTilt,
        THREE.MathUtils.clamp(progressVelocity * 0.035, -0.075, 0.075),
        7,
        delta,
      );
      const dismantle = keyedValue(p, [
        [0, 0],
        [0.16, 0.08],
        [0.3, 1.25],
        [0.52, 2.35],
        [0.67, 2.65],
        [0.79, 0.5],
        [1, 0.08],
      ]);
      const revealSignals = smoothstep(0.12, 0.3, p) * (1 - smoothstep(0.42, 0.56, p));
      const guardrailAlignment = smoothstep(0.38, 0.61, p);
      const recoveredGlow = smoothstep(0.68, 0.82, p);
      const shellOpacity = keyedValue(p, [
        [0, 1],
        [0.28, 0.92],
        [0.5, 0.64],
        [0.68, 0.58],
        [0.82, 0.2],
        [0.93, 0.56],
        [1, 0.92],
      ]);

      shellPieces.forEach((piece) => {
        const oscillation = Math.sin(p * 9 + piece.userData.phase) * 0.08 * dismantle;
        const distance = dismantle * piece.userData.drift;
        piece.position.copy(piece.userData.normal).multiplyScalar(distance + oscillation);
        piece.rotation.x = piece.userData.normal.y * dismantle * 0.17;
        piece.rotation.y = piece.userData.normal.x * dismantle * 0.19;
        piece.material.opacity = shellOpacity;
        piece.material.depthWrite = piece.material.opacity > 0.4;
      });
      studs.visible = dismantle < 1.45 || recoveredGlow > 0.35;

      signalNodes.forEach((node, index) => {
        node.visible = revealSignals > 0.02;
        node.scale.setScalar(revealSignals * (1 + Math.sin(p * 12 + index) * 0.06));
        node.rotation.x = p * (1.2 + index * 0.12);
        node.rotation.y = p * (1.6 + index * 0.14);
      });

      rings.forEach((ring, index) => {
        const initial = ring.userData.initialRotation as THREE.Euler;
        const alignedX = index % 2 === 0 ? Math.PI / 2 : 0;
        ring.rotation.x = mix(initial.x + p * 1.2 * (index + 1), alignedX, guardrailAlignment * 0.76);
        ring.rotation.y = mix(initial.y + p * 0.72 * (index + 1), 0, guardrailAlignment * 0.7);
        ring.rotation.z = mix(initial.z + p * 0.88 * (index + 1), 0, guardrailAlignment * 0.8);
      });

      darkGlass.emissiveIntensity = 0.42 + recoveredGlow * 1.55;
      (innerWire.material as THREE.LineBasicMaterial).opacity = 0.2 + recoveredGlow * 0.68;
      limeLight.intensity = 25 + recoveredGlow * 45;
      energySpineMaterial.opacity = 0.12 + revealSignals * 0.18 + recoveredGlow * 0.44;
      energySpine.scale.y = 0.74 + dismantle * 0.07 + recoveredGlow * 0.12;
      particleMaterial.opacity = 0.36 + dismantle * 0.055 + recoveredGlow * 0.12;

      pointerX = THREE.MathUtils.damp(pointerX, targetPointerX, 7.2, delta);
      pointerY = THREE.MathUtils.damp(pointerY, targetPointerY, 7.2, delta);
      const cameraZ = keyedValue(p, [
        [0, 9.6],
        [0.22, 8.25],
        [0.46, 6.35],
        [0.6, 5.45],
        [0.74, 7.15],
        [0.9, 6.4],
        [1, 8],
      ]);
      const cameraY = keyedValue(p, [[0, 0.2], [0.34, -0.15], [0.58, 0.18], [0.76, 0], [1, 0.25]]);
      const mobile = canvas.clientWidth < 760;
      const storyShift = mobile ? 0 : keyedValue(p, [
        [0, 1.5],
        [0.22, 1.6],
        [0.38, -1.35],
        [0.55, 1.25],
        [0.7, -1.25],
        [0.84, 0],
        [1, 0],
      ]);
      const storyScale = mobile ? 0.84 : keyedValue(p, [
        [0, 0.9],
        [0.22, 0.86],
        [0.38, 0.92],
        [0.56, 0.98],
        [0.7, 0.94],
        [0.84, 0.82],
        [1, 0.88],
      ]);
      camera.position.x = reducedMotion ? 0 : pointerX;
      camera.position.y = cameraY - (reducedMotion ? 0 : pointerY);
      camera.position.z = cameraZ;
      camera.lookAt(0, 0, 0);

      root.position.x = storyShift;
      root.position.y = Math.sin(p * Math.PI * 3) * 0.055;
      root.scale.setScalar(storyScale);
      root.rotation.y = p * Math.PI * 2.55;
      root.rotation.x = Math.sin(p * Math.PI * 2) * 0.18;
      root.rotation.z = reducedMotion ? 0 : kineticTilt;
      mechanism.rotation.z = -p * 1.1;
      mechanism.scale.setScalar(0.97 + recoveredGlow * 0.045);
      particles.rotation.y = p * 0.8;
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(renderLoop);

    return () => {
      renderer.setAnimationLoop(null);
      timer.dispose();
      unsubscribeProgress();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
      motionPreference.removeEventListener('change', handleMotionPreference);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry?.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="revenue-core-canvas"
      role="img"
      aria-label="A scroll-controlled three-dimensional revenue recovery engine that separates into failure signals, aligns its guardrails, and reassembles around recovered revenue."
    />
  );
}
