import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import CursorGlow from './components/CursorGlow';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import CertificatesSection from './components/CertificatesSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aasija_theme') || 'light';
  });
  const [activeSection, setActiveSection] = useState('home');

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aasija_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Scroll Spy for Navbar Active Link & Reveal Animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'skills', 'projects', 'certificates', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // IntersectionObserver for reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [loading]);

  return (
    <div className="portfolio-app">
      {loading && <Preloader onLoaded={() => setLoading(false)} />}
      
      <CursorGlow />
      <ParticleBackground />
      
      <Navbar
        activeSection={activeSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main>
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificatesSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
