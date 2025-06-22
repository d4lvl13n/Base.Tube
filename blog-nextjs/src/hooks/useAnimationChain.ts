'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface AnimationStep {
  id: string;
  duration: number;
  next?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface AnimationChainConfig {
  [key: string]: AnimationStep;
}

// Define the complete animation chain
export const defaultAnimationChain: AnimationChainConfig = {
  // Hero Section Animations
  heroLoader: { id: 'heroLoader', duration: 5000, next: 'heroReveal' },
  heroReveal: { id: 'heroReveal', duration: 1000, next: 'heroGlitch' },
  heroGlitch: { id: 'heroGlitch', duration: 200, next: 'revenueEscape' },
  revenueEscape: { id: 'revenueEscape', duration: 2000, next: 'revenueReturn' },
  revenueReturn: { id: 'revenueReturn', duration: 2000, next: 'heroCTA' },
  heroCTA: { id: 'heroCTA', duration: 500 },
  
  // Manifesto Section Animations
  manifestoReveal: { id: 'manifestoReveal', duration: 800, next: 'cardStrikes' },
  cardStrikes: { id: 'cardStrikes', duration: 1500, next: 'passFlip' },
  passFlip: { id: 'passFlip', duration: 800, next: 'manifestoStats' },
  manifestoStats: { id: 'manifestoStats', duration: 1200 },
  
  // How It Works Section Animations
  howItWorksFlow: { id: 'howItWorksFlow', duration: 1000, next: 'wheelSpin' },
  wheelSpin: { id: 'wheelSpin', duration: 2000, next: 'stepsReveal' },
  stepsReveal: { id: 'stepsReveal', duration: 1500 },
  
  // USP Section Animations
  uspFeatureForm: { id: 'uspFeatureForm', duration: 1200, next: 'uspBenefits' },
  uspBenefits: { id: 'uspBenefits', duration: 2000, next: 'uspComparison' },
  uspComparison: { id: 'uspComparison', duration: 1500 },
  
  // Perks Section Animations
  perksPassReveal: { id: 'perksPassReveal', duration: 1000, next: 'perksCounter' },
  perksCounter: { id: 'perksCounter', duration: 800, next: 'perksBenefits' },
  perksBenefits: { id: 'perksBenefits', duration: 1500, next: 'perksUrgency' },
  perksUrgency: { id: 'perksUrgency', duration: 1000 }
};

export const useAnimationChain = (chainConfig: AnimationChainConfig = defaultAnimationChain) => {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [completedAnimations, setCompletedAnimations] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbacksRef = useRef<Map<string, AnimationStep>>(new Map());

  // Register animation callbacks
  useEffect(() => {
    Object.entries(chainConfig).forEach(([key, step]) => {
      callbacksRef.current.set(key, step);
    });
  }, [chainConfig]);

  // Play a specific animation
  const playAnimation = useCallback((animationId: string, skipChain = false) => {
    const animation = callbacksRef.current.get(animationId);
    if (!animation || completedAnimations.has(animationId)) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set current animation
    setCurrentAnimation(animationId);
    setIsPlaying(true);

    // Call onStart callback
    animation.onStart?.();

    // Set up completion
    timeoutRef.current = setTimeout(() => {
      // Mark as completed
      setCompletedAnimations(prev => new Set([...prev, animationId]));
      setCurrentAnimation(null);
      setIsPlaying(false);

      // Call onComplete callback
      animation.onComplete?.();

      // Play next animation if not skipping chain
      if (!skipChain && animation.next) {
        playAnimation(animation.next);
      }
    }, animation.duration);
  }, [completedAnimations]);

  // Check if an animation is active
  const isAnimationActive = useCallback((animationId: string) => {
    return currentAnimation === animationId;
  }, [currentAnimation]);

  // Check if an animation has completed
  const hasAnimationCompleted = useCallback((animationId: string) => {
    return completedAnimations.has(animationId);
  }, [completedAnimations]);

  // Get animation progress (0-1)
  const getAnimationProgress = useCallback((animationId: string): number => {
    if (!isAnimationActive(animationId)) {
      return hasAnimationCompleted(animationId) ? 1 : 0;
    }
    // Would need more complex tracking for real-time progress
    return 0.5;
  }, [isAnimationActive, hasAnimationCompleted]);

  // Reset animation chain
  const resetChain = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentAnimation(null);
    setCompletedAnimations(new Set());
    setIsPlaying(false);
  }, []);

  // Start chain from a specific point
  const startChain = useCallback((startId: string) => {
    resetChain();
    playAnimation(startId);
  }, [resetChain, playAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentAnimation,
    completedAnimations: Array.from(completedAnimations),
    isPlaying,
    playAnimation,
    isAnimationActive,
    hasAnimationCompleted,
    getAnimationProgress,
    startChain,
    resetChain
  };
}; 