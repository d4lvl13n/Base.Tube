'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { NarrativeState } from '@/hooks/useNarrativeScroll';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'money' | 'value' | 'feature' | 'pass';
  phase: NarrativeState['particlePhase'];
}

interface Props {
  narrativeState: NarrativeState;
  intensity?: number;
}

export default function NarrativeParticleSystem({ narrativeState, intensity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPhaseRef = useRef<NarrativeState['particlePhase']>(narrativeState.particlePhase);
  const narrativeStateRef = useRef(narrativeState);
  const intensityRef = useRef(intensity);

  // Update refs when props change
  useEffect(() => {
    narrativeStateRef.current = narrativeState;
    intensityRef.current = intensity;
  }, [narrativeState, intensity]);

  // Create particles based on phase
  const createParticle = useCallback((phase: NarrativeState['particlePhase']): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) {
      // Return a dummy particle if canvas is not available
      return {
        id: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 9999,
        maxLife: 9999,
        size: 0,
        color: 'transparent',
        type: 'money',
        phase
      };
    }

    const baseParticle = {
      id: Date.now() + Math.random(),
      life: 0,
      maxLife: 120 + Math.random() * 60,
      size: 3 + Math.random() * 2,
      phase
    };

    switch (phase) {
      case 'escaping':
        // Particles escape from center (creator) to edges (platforms)
        return {
          ...baseParticle,
          x: canvas.width / 2 + (Math.random() - 0.5) * 50,
          y: canvas.height / 2 + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          color: '#ff6b35',
          type: 'money'
        };

      case 'trapped':
        // Particles trapped in circular orbits (bad options)
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 50;
        return {
          ...baseParticle,
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          vx: Math.cos(angle + Math.PI / 2) * 2,
          vy: Math.sin(angle + Math.PI / 2) * 2,
          color: '#ff6b35', // Changed to brand orange
          type: 'money',
          size: 2 + Math.random() * 1.5 // Smaller to show trapped state
        };

      case 'flowing':
        // Particles flow in value wheel pattern
        return {
          ...baseParticle,
          x: Math.random() * canvas.width,
          y: 0,
          vx: (Math.random() - 0.5) * 2,
          vy: 2 + Math.random() * 2,
          color: '#fa7517', // Keeping secondary orange
          type: 'value'
        };

      case 'forming':
        // Particles form into feature shapes
        return {
          ...baseParticle,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          color: '#ff6b35', // Changed to brand orange
          type: 'feature',
          size: 4 + Math.random() * 3 // Larger to show forming state
        };

      case 'converging':
        // Particles converge to Genesis Pass
        return {
          ...baseParticle,
          x: Math.random() < 0.5 ? 0 : canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() < 0.5 ? 2 : -2,
          vy: (Math.random() - 0.5) * 2,
          color: '#fa7517', // Changed to secondary orange
          type: 'pass',
          size: 5 + Math.random() * 2 // Largest for importance
        };
    }
  }, []);

  // Update particle physics
  const updateParticle = useCallback((particle: Particle, phase: NarrativeState['particlePhase']) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particle.life++;
    const lifeRatio = particle.life / particle.maxLife;

    switch (phase) {
      case 'escaping':
        // Accelerate away from center
        const dx = particle.x - canvas.width / 2;
        const dy = particle.y - canvas.height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        particle.vx += (dx / dist) * 0.1;
        particle.vy += (dy / dist) * 0.1;
        break;

      case 'trapped':
        // Circular orbit with decay
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angleToCenter = Math.atan2(particle.y - centerY, particle.x - centerX);
        particle.vx = Math.cos(angleToCenter + Math.PI / 2) * 2 * (1 - lifeRatio * 0.5);
        particle.vy = Math.sin(angleToCenter + Math.PI / 2) * 2 * (1 - lifeRatio * 0.5);
        break;

      case 'flowing':
        // Sinusoidal flow
        particle.vx = Math.sin(particle.life * 0.05) * 3;
        particle.vy = 2 + Math.cos(particle.life * 0.03) * 0.5;
        break;

      case 'forming':
        // Attract to grid positions
        const gridX = Math.round(particle.x / 100) * 100;
        const gridY = Math.round(particle.y / 100) * 100;
        particle.vx += (gridX - particle.x) * 0.02;
        particle.vy += (gridY - particle.y) * 0.02;
        particle.vx *= 0.95; // Damping
        particle.vy *= 0.95;
        break;

      case 'converging':
        // Converge to center with spiral
        const targetX = canvas.width / 2;
        const targetY = canvas.height / 2;
        const angle = Math.atan2(particle.y - targetY, particle.x - targetX);
        particle.vx = -Math.cos(angle) * 3 + Math.cos(angle + Math.PI / 2) * 1;
        particle.vy = -Math.sin(angle) * 3 + Math.sin(angle + Math.PI / 2) * 1;
        break;
    }

    // Apply velocity
    particle.x += particle.vx;
    particle.y += particle.vy;
  }, []);

  // Store callbacks in refs to make them stable
  const createParticleRef = useRef(createParticle);
  const updateParticleRef = useRef(updateParticle);
  
  useEffect(() => {
    createParticleRef.current = createParticle;
    updateParticleRef.current = updateParticle;
  }, [createParticle, updateParticle]);

  // Render particles - stable function with no dependencies
  useEffect(() => {
    let frameId: number;
    
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        frameId = requestAnimationFrame(render);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      particlesRef.current = particlesRef.current.filter(particle => {
        if (particle.life >= particle.maxLife) return false;

        updateParticleRef.current(particle, narrativeStateRef.current.particlePhase);

        // Render particle with phase-based opacity
        const lifeAlpha = 1 - (particle.life / particle.maxLife);
        
        // Vary opacity based on phase for visual differentiation
        let phaseOpacity = 0.8;
        switch (particle.phase) {
          case 'trapped': phaseOpacity = 0.4; break; // Dimmer when trapped
          case 'flowing': phaseOpacity = 0.6; break;
          case 'forming': phaseOpacity = 0.7; break;
          case 'converging': phaseOpacity = 0.9; break; // Brightest when converging
        }
        
        ctx.save();
        ctx.globalAlpha = lifeAlpha * phaseOpacity;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.size * 3,
          particle.y - particle.size * 3,
          particle.size * 6,
          particle.size * 6
        );

        // Core
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        return true;
      });

      // Add new particles based on phase and intensity
      const targetCount = Math.floor(20 * intensityRef.current);
      while (particlesRef.current.length < targetCount) {
        const particle = createParticleRef.current(narrativeStateRef.current.particlePhase);
        if (particle) {
          particlesRef.current.push(particle);
        }
      }

      frameId = requestAnimationFrame(render);
    };
    
    frameId = requestAnimationFrame(render);
    animationFrameRef.current = frameId;
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Handle phase transitions
  useEffect(() => {
    if (lastPhaseRef.current !== narrativeState.particlePhase) {
      // Clear particles on phase change for clean transition
      particlesRef.current = [];
      lastPhaseRef.current = narrativeState.particlePhase;
    }
  }, [narrativeState.particlePhase]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <canvas
      ref={canvasRef}
      className="narrative-particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: 0.8
      }}
    />
  );
} 