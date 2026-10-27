import { Link } from 'react-router-dom'
import { projects } from '../catalog'
import './ProjectGallery.css'

export default function ProjectGallery() {
  return (
    <div className="gallery-page">
      <header className="cm-project-header">
        <a className="cm-skip-link" href="#project-content">Skip to projects</a>
        <a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima" /></a>
        <span className="cm-project-divider" aria-hidden="true" />
        <div className="cm-project-meta"><span>INTERACTIVE PRACTICE LAB</span><strong>Project Gallery</strong></div>
      </header>
      <main id="project-content" className="gallery" aria-labelledby="gallery-title">
        <section className="gallery-intro">
          <p className="gallery-eyebrow"><span className="live-dot" aria-hidden="true" /> YOUR CREATIVE SPACE TO PRACTICE</p>
          <h1 id="gallery-title">Small ideas.<br /><span>Stronger coding skills.</span></h1>
          <p className="gallery-copy">A hands-on collection of little tools and challenges. Choose a project, play around, and learn by doing.</p>
          <div className="gallery-meta"><span><span aria-hidden="true">✳</span> 8 interactive projects</span><span aria-hidden="true" className="meta-divider">·</span><span>Made to explore</span></div>
        </section>
        <section className="project-grid" aria-label="Browse all practice projects">
          {projects.map((project, index) => (
            <Link className="project-card" to={`/${project.path}`} key={project.path} style={{ animationDelay:`${index * 45}ms` }}>
              <div className="card-top"><span className="project-icon" aria-hidden="true">{project.icon}</span><span className="card-category">{project.category}</span><span className="card-arrow" aria-hidden="true">↗</span></div>
              <h2>{project.title}</h2><p>{project.description}</p>
              <span className="card-action">Open project <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </section>
      </main>
      <footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">8 INDEPENDENT PROJECTS</span></footer>
    </div>
  )
}
