'use client';

import { Environment, Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Floating Golden Sphere
function FloatingSphere({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

// Big Floating Ring
function FloatingRing({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[0.8, 0.25, 32, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={1}
          roughness={0.05}
          emissive="#D4AF37"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
}

// Minimal Sparkles
function MinimalSparkles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#D4AF37" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// 3D Scene - Sadece yüzükler ve toplar
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.15}
      />
      
      <ambientLight intensity={0.6} />
      <spotLight position={[15, 15, 15]} angle={0.3} penumbra={1} intensity={2.5} />
      <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={1.5} />
      <pointLight position={[5, 8, 5]} intensity={2} color="#D4AF37" />
      
      {/* Big floating rings */}
      <FloatingRing position={[-3, 3, -1]} scale={1.5} />
      <FloatingRing position={[4, 1, 0.5]} scale={1.3} />
      <FloatingRing position={[1, 4.5, -2]} scale={1.2} />
      
      {/* Floating spheres */}
      <FloatingSphere position={[-4, -2, 2]} scale={1} />
      <FloatingSphere position={[5, 2, 1]} scale={0.8} />
      <FloatingSphere position={[-2, 4, 0]} scale={0.6} />
      
      <MinimalSparkles />
      <Environment preset="city" />
    </>
  );
}

// Star Icon Component
function StarIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <svg className={sizeMap[size]} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0l3.708 8.292L24 12l-8.292 3.708L12 24l-3.708-8.292L0 12l8.292-3.708z" />
    </svg>
  );
}

// Main Hero Component
export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 8,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-[#0F0F0F]">
      {/* HAND IMAGE - Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="pointer-events-none absolute inset-0 z-[0]"
      >
        <div className="relative h-full w-full">
          <Image
            src="/images/hand-jewelry.png"
            alt="Hand with gold rings"
            fill
            className="object-cover object-center opacity-30"
            priority
            quality={95}
          />
        </div>
      </motion.div>

      {/* 3D Canvas Background - Yüzükler ve toplar */}
      <div className="absolute inset-0 z-[1]">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mx-auto w-full max-w-5xl text-center"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <h1 className="mb-6 font-cormorant text-6xl font-bold leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[11rem]">
            Her Parça
            <br />
            <span className="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Bir Hikaye
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mb-10 max-w-2xl font-inter text-base leading-relaxed text-white/60 sm:text-lg md:text-xl"
          >
            Premium kalitede çelik takılar ile tarzınızı yansıtın.
            Her parça özenle seçilmiş, sizin için tasarlandı.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative overflow-hidden rounded-full bg-gold-gradient px-10 py-4 font-inter font-semibold text-black shadow-2xl shadow-gold/40"
            >
              <span className="relative z-10">Koleksiyonu Keşfet</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass rounded-full px-10 py-4 font-inter font-semibold text-white"
            >
              Hakkımızda
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Product Card - Sol Üst */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05, x: 8 }}
          className="glass absolute left-12 top-[22%] hidden items-center gap-3 rounded-full px-4 py-3 lg:flex"
        >
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-gold/30 to-rose-gold/20">
            <div className="flex h-full w-full items-center justify-center text-xl">💍</div>
          </div>
          <div className="pr-1">
            <p className="font-inter text-xs font-semibold text-white">Radiant Bloom Ring</p>
            <p className="font-inter text-[10px] text-gold">₺299</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-black"
          >
            +
          </motion.button>
        </motion.div>

        {/* Design Your Story - Sol Alt */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          className="glass absolute bottom-[15%] left-12 hidden items-center gap-3 rounded-2xl p-3 lg:flex"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-white/10 text-2xl">
            💎
          </div>
          <div className="pr-2">
            <p className="mb-0.5 font-cormorant text-base font-bold text-white">Design Your Story</p>
            <p className="font-inter text-[10px] text-white/60">Create Your Own<br/>Custom Jewelry</p>
          </div>
        </motion.div>

        {/* WhatsApp Card - Sağ Alt */}
        <motion.a
          href="https://wa.me/905451125059"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={{ scale: 1.08, y: -5 }}
          className="glass absolute bottom-[15%] right-12 hidden cursor-pointer flex-col items-center rounded-xl px-5 py-4 lg:flex"
        >
          <div className="mb-2.5 flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                className="h-9 w-9 rounded-full border-2 border-[#0F0F0F] bg-gradient-to-br from-gold/50 to-rose-gold/50"
              />
            ))}
          </div>
          <span className="mb-1 font-inter text-2xl font-bold text-white">4.5k+</span>
          <p className="mb-2.5 font-inter text-[10px] text-white/60">Mutlu Müşteri</p>
          <div className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1.5">
            <span className="text-sm">💬</span>
            <span className="font-inter text-[10px] font-medium text-green-400">WhatsApp</span>
          </div>
        </motion.a>

        {/* Big Stars - Sağ Üst */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute right-24 top-[15%] hidden text-white/30 lg:block"
        >
          <StarIcon size="lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute right-16 top-[22%] hidden text-white/20 lg:block"
        >
          <StarIcon size="md" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="absolute right-48 top-[12%] hidden text-white/20 lg:block"
        >
          <StarIcon size="sm" />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-inter text-xs uppercase tracking-widest text-white/50">Kaydır</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/30">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mx-auto mt-1.5 h-2 w-2 rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-[#0F0F0F]/90" />
    </section>
  );
}