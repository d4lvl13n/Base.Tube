'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface Chapter {
  id: string;
  section: string;
  trigger: number; // Scroll position in viewport heights
  status: 'waiting' | 'active' | 'completed';
}

export interface NarrativeState {
  currentChapter: number;
  chapters: Chapter[];
  scrollProgress: number;
  particlePhase: 'escaping' | 'trapped' | 'flowing' | 'forming' | 'converging';
}

// Define story chapters with their scroll triggers - moved outside to prevent recreation
const NARRATIVE_CHAPTERS: Omit<Chapter, 'status'>[] = [
  { id: 'hero', section: 'hero-section', trigger: 0 },
  { id: 'problem', section: 'manifesto-section', trigger: 0.5 },
  { id: 'solution', section: 'howto-section', trigger: 1.2 },
  { id: 'proof', section: 'usp2-section', trigger: 2.2 },
  { id: 'urgency', section: 'perks-section', trigger: 3.2 }
];

export const useNarrativeScroll = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [particlePhase, setParticlePhase] = useState<NarrativeState['particlePhase']>('escaping');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chapters with status
  const initialChapters: Chapter[] = NARRATIVE_CHAPTERS.map((ch, index) => ({
    ...ch,
    status: index === 0 ? 'active' : 'waiting'
  }));

  const [chapterStates, setChapterStates] = useState(initialChapters);

  // Calculate scroll progress and update chapter states
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate progress as viewport heights scrolled
    const viewportsScrolled = scrollY / windowHeight;
    setScrollProgress(viewportsScrolled);

    // Detect scrolling state
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);

    // Update current chapter and states
    let newChapter = 0;
    const updatedChapters = NARRATIVE_CHAPTERS.map((chapter, index) => {
      if (viewportsScrolled >= chapter.trigger) {
        newChapter = index;
        return { 
          ...chapter, 
          status: viewportsScrolled > chapter.trigger + 0.5 ? 'completed' : 'active' 
        } as Chapter;
      }
      return { ...chapter, status: 'waiting' } as Chapter;
    });

    setCurrentChapter(newChapter);
    setChapterStates(updatedChapters);

    // Update particle phase based on chapter
    switch (newChapter) {
      case 0: setParticlePhase('escaping'); break;
      case 1: setParticlePhase('trapped'); break;
      case 2: setParticlePhase('flowing'); break;
      case 3: setParticlePhase('forming'); break;
      case 4: setParticlePhase('converging'); break;
    }
  }, []); // Empty dependency array since NARRATIVE_CHAPTERS is constant

  // Set up scroll listener
  useEffect(() => {
    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  // Smooth scroll to chapter
  const scrollToChapter = useCallback((chapterId: string) => {
    const chapter = NARRATIVE_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter) return;

    const targetSection = document.querySelector(`.${chapter.section}`);
    if (targetSection) {
      const yOffset = chapter.trigger * window.innerHeight;
      window.scrollTo({
        top: yOffset,
        behavior: 'smooth'
      });
    }
  }, []); // Empty dependency array since NARRATIVE_CHAPTERS is constant

  // Get animation state for a specific section
  const getAnimationState = useCallback((sectionId: string) => {
    const chapter = chapterStates.find(ch => ch.id === sectionId);
    return {
      isActive: chapter?.status === 'active',
      isCompleted: chapter?.status === 'completed',
      isVisible: chapter?.status !== 'waiting',
      shouldAnimate: chapter?.status === 'active' && !isScrolling
    };
  }, [chapterStates, isScrolling]);

  return {
    currentChapter,
    chapters: chapterStates,
    scrollProgress,
    particlePhase,
    isScrolling,
    scrollToChapter,
    getAnimationState,
    state: {
      currentChapter,
      chapters: chapterStates,
      scrollProgress,
      particlePhase
    } as NarrativeState
  };
}; 