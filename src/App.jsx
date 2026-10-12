import PortfolioBuilder from './PortfolioBuilder.jsx';
import { useState } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  if (showBuilder) {
  return <PortfolioBuilder />;
}
  return (
    <div className="app">
     
<header className="navbar">
  <a
    href="#top"
    className="logo"
    onClick={() => setMenuOpen(false)}
  >
    Portify<span>AI</span>
  </a>

  <button
    className="menu-toggle"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-expanded={menuOpen}
  >
    {menuOpen ? '✕' : '☰'}
  </button>

  <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
    <a href="#features" onClick={() => setMenuOpen(false)}>
      Features
    </a>
    <a href="#templates" onClick={() => setMenuOpen(false)}>
      Templates
    </a>
    <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
      How it works
    </a>
  </nav>

  <div className="nav-actions">
    <button
      className="btn btn-outline"
      disabled
      title="Login will be implemented in a later step"
    >
      Log in
    </button>

    <button
  className="btn btn-primary"
  onClick={() => setShowBuilder(true)}
>
  Get started
</button>
  </div>
</header>


      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR CAREER, PRESENTED BETTER
            </p>

            <h1>
              Your work deserves
              <br />
              a <span>better portfolio.</span>
            </h1>

            <p className="hero-description">
              Create a professional portfolio in minutes.
              Showcase your projects, highlight your skills,
              and let AI help tell your story.
            </p>

            
<div className="hero-actions">
  <button
  className="btn btn-primary"
  onClick={() => setShowBuilder(true)}
>
  Build my portfolio →
</button>

  <a className="btn btn-outline" href="#templates">
    Explore templates
  </a>
</div>


            <p className="hero-note">
              No design skills required. Start for free.
            </p>
          </div>

          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-toolbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <p>yourportfolio.dev</p>
              </div>

              <div className="preview-content">
                <div className="preview-label">
                  PERSONAL PORTFOLIO
                </div>

                <div className="preview-avatar">JD</div>

                <h2>Jordan Davis</h2>
                <p className="preview-role">
                  Full-Stack Developer
                </p>

                <p className="preview-bio">
                  I build useful digital experiences
                  through thoughtful design and code.
                </p>

                <div className="preview-skills">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Python</span>
                </div>

                <div className="preview-project">
                  <div className="project-icon">01</div>
                  <div>
                    <h3>Analytics Dashboard</h3>
                    <p>A data-driven web application</p>
                  </div>
                  <span className="project-arrow">↗</span>
                </div>

                <div className="preview-project">
                  <div className="project-icon second">02</div>
                  <div>
                    <h3>AI Study Assistant</h3>
                    <p>An intelligent learning tool</p>
                  </div>
                  <span className="project-arrow">↗</span>
                </div>
              </div>
            </div>

            <div className="floating-badge">
              <span className="status-dot" />
              Portfolio ready to publish
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <p className="eyebrow">EVERYTHING IN ONE PLACE</p>
          <h2>Build your story. Show your value.</h2>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-number">01</div>
              <h3>AI writing assistant</h3>
              <p>
                Turn your experience and projects into
                clear, professional descriptions.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">02</div>
              <h3>Professional templates</h3>
              <p>
                Present your work with layouts designed
                to make your projects stand out.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">03</div>
              <h3>Your own public link</h3>
              <p>
                Publish your portfolio and share one link
                with recruiters and potential clients.
              </p>
            </article>
          </div>
        </section>

        <section className="templates" id="templates">
          <p className="eyebrow">MADE FOR YOUR NEXT OPPORTUNITY</p>
          <h2>One profile. Multiple possibilities.</h2>
          <p>
            We'll build customizable portfolio templates
            that let you present your work your way.
          </p>
        </section>

        <section className="how-it-works" id="how-it-works">
          <p className="eyebrow">SIMPLE BY DESIGN</p>
          <h2>From your details to your portfolio.</h2>

          <div className="steps-grid">
            <div>
              <span>01</span>
              <h3>Add your details</h3>
              <p>Enter your skills, education, and projects.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Make it yours</h3>
              <p>Choose a template and customize your page.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Publish and share</h3>
              <p>Get a public link to share your work.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="/" className="logo">
          Portify<span>AI</span>
        </a>
        <p>Build your next opportunity.</p>
        <p>© 2026 PortifyAI. Portfolio builder project.</p>
      </footer>
    </div>
  );
}

export default App;
