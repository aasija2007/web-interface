import React, { useState } from 'react';
import { ExternalLink, Layers } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projectsData } from '../data/portfolioData';

const categories = ['All', 'Web Apps', 'Management Systems', 'Python/Java'];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Featured Works</p>
          <h2 className="section-title">My Projects</h2>
        </div>

        {/* Category Filter Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: isActive ? 'var(--primary-gradient)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid ' + (isActive ? 'transparent' : 'var(--border-color)'),
                  boxShadow: isActive ? '0 6px 20px var(--glow-color)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '24px'
              }}
            >
              {/* Card Image Thumbnail */}
              <div
                style={{
                  width: '100%',
                  height: '210px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = 'var(--primary-gradient)';
                    e.target.parentNode.style.display = 'flex';
                    e.target.parentNode.style.alignItems = 'center';
                    e.target.parentNode.style.justifyContent = 'center';
                    e.target.parentNode.innerHTML = `<span style="font-weight:800; color:#fff; font-size:1.4rem;">${project.title}</span>`;
                  }}
                />

                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: '600'
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '10px', color: 'var(--text-main)' }}>
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '20px'
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Technologies Used */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '24px'
                    }}
                  >
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '14px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '16px'
                  }}
                >
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'var(--primary-gradient)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                    onClick={(e) => {
                      if (project.liveDemo === '#') {
                        e.preventDefault();
                        alert(`Live demo link for ${project.title} is coming soon!`);
                      }
                    }}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <GithubIcon size={16} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
