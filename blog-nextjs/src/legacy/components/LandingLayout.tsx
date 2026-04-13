'use client';

import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import '../app/landing.css';
import '../app/header.css';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
        
        {/* GSAP and other landing page scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js" async />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js" async />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollToPlugin.min.js" async />
        <script src="https://unpkg.com/split-type" async />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt.js/1.8.1/vanilla-tilt.min.js" async />
      </Head>
      
      <div className="landing-wrapper">
        {/* Enhanced Header Component */}
        <Header />
        
        {/* Main Content */}
        <main className="landing-content">
          {children}
        </main>
        
        {/* Enhanced Footer */}
        <Footer />
      </div>
    </>
  );
} 