'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { NarrativeState, useNarrativeScroll } from '@/hooks/useNarrativeScroll';
import { useAnimationChain } from '@/hooks/useAnimationChain';

interface NarrativeContextType {
  narrativeState: NarrativeState;
  animationState: (sectionId: string) => {
    isActive: boolean;
    isCompleted: boolean;
    isVisible: boolean;
    shouldAnimate: boolean;
  };
  animationChain: {
    currentAnimation: string | null;
    completedAnimations: string[];
    isPlaying: boolean;
    playAnimation: (animationId: string, skipChain?: boolean) => void;
    isAnimationActive: (animationId: string) => boolean;
    hasAnimationCompleted: (animationId: string) => boolean;
    getAnimationProgress: (animationId: string) => number;
    startChain: (startId: string) => void;
    resetChain: () => void;
  };
  scrollToChapter: (chapterId: string) => void;
}

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

export const useNarrative = () => {
  const context = useContext(NarrativeContext);
  if (!context) {
    throw new Error('useNarrative must be used within a NarrativeProvider');
  }
  return context;
};

interface NarrativeProviderProps {
  children: ReactNode;
}

export function NarrativeProvider({ children }: NarrativeProviderProps) {
  const narrativeScroll = useNarrativeScroll();
  const animationChain = useAnimationChain();

  const value: NarrativeContextType = {
    narrativeState: narrativeScroll.state,
    animationState: narrativeScroll.getAnimationState,
    animationChain,
    scrollToChapter: narrativeScroll.scrollToChapter
  };

  return (
    <NarrativeContext.Provider value={value}>
      {children}
    </NarrativeContext.Provider>
  );
} 