
import { useState } from 'react';

function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState({
    name: 'Jawad Riaz',
    role: 'Aspiring Machine Learning Engineer',
    about:
      'I am a technology enthusiast interested in building useful applications with software development and machine learning.',
    email: '',
    location: 'Pakistan',
    skills: 'Python, Machine Learning, C++, HTML, CSS',
    projectTitle: 'AI Portfolio Builder',
    projectDescription:
      'A web application that helps people create professional portfolios with AI-powered assistance.',
    github: 'https://github.com/Jawad03stu',
    linkedin: '',
  });

  const updateField = (field, value) => {
    setPortfolio((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const skills = portfolio.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="builder-page">
      <header className="builder-header">
        <a className="logo" href="/">
          Portify<span>AI</span>
        </a>

        <span className="builder-status">Draft portfolio</span>

        <a className="btn btn-outline" href="/">
          Back to home
        </a>
      </header>

      <div className="builder-heading">
        <p className="eyebrow">PORTFOLIO WORKSPACE</p>
        <h1>Build your professional profile.</h1>
        <p>
          Add your details and see your portfolio update instantly.
        </p>
      </div>

      <main className="builder-layout">
        <section className="builder-form">
          <div className="builder-section-heading">
            <span>01</span>
            <div>
              <h2>Personal information</h2>
              <p>Introduce yourself professionally.</p>
            </div>
          </div>

          <label htmlFor="name">Full name</label>
          <input
            id="name"
            value={portfolio.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Your full name"
          />

          <label htmlFor="role">Professional title</label>
          <input
            id="role"
            value={portfolio.role}
            onChange={(event) => updateField('role', event.target.value)}
            placeholder="e.g. Frontend Developer"
          />

          <label htmlFor="about">About me</label>
          <textarea
            id="about"
            rows="5"
            value={portfolio.about}
            onChange={(event) => updateField('about', event.target.value)}
            placeholder="Write a short professional introduction"
          />

          <div className="builder-two-columns">
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={portfolio.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={portfolio.location}
                onChange={(event) => updateField('location', event.target.value)}
                placeholder="City, country"
              />
            </div>
          </div>

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>02</span>
            <div>
              <h2>Skills</h2>
              <p>Separate each skill with a comma.</p>
            </div>
          </div>

          <label htmlFor="skills">Your skills</label>
          <input
            id="skills"
            value={portfolio.skills}
            onChange={(event) => updateField('skills', event.target.value)}
            placeholder="Python, React, SQL"
          />

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>03</span>
            <div>
              <h2>Featured project</h2>
              <p>Showcase one project you have worked on.</p>
            </div>
          </div>

          <label htmlFor="projectTitle">Project name</label>
          <input
            id="projectTitle"
            value={portfolio.projectTitle}
            onChange={(event) =>
              updateField('projectTitle', event.target.value)
            }
            placeholder="Your project name"
          />

          <label htmlFor="projectDescription">Project description</label>
          <textarea
            id="projectDescription"
            rows="4"
            value={portfolio.projectDescription}
            onChange={(event) =>
              updateField('projectDescription', event.target.value)
            }
            placeholder="Explain what your project does"
          />

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>04</span>
            <div>
              <h2>Social links</h2>
              <p>Give visitors a way to explore your work.</p>
            </div>
          </div>

          <label htmlFor="github">GitHub URL</label>
          <input
            id="github"
            type="url"
            value={portfolio.github}
            onChange={(event) => updateField('github', event.target.value)}
            placeholder="https://github.com/username"
          />

          <label htmlFor="linkedin">LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            value={portfolio.linkedin}
            onChange={(event) => updateField('linkedin', event.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </section>

        <section className="builder-preview">
          <div className="preview-heading">
            <div>
              <span className="live-indicator" />
              LIVE PREVIEW
            </div>
            <span>Personal portfolio</span>
          </div>

          <article className="portfolio-card">
            <div className="portfolio-card-top">
              <div className="portfolio-avatar">
                {portfolio.name.trim().charAt(0).toUpperCase() || '?'}
              </div>

              <span className="portfolio-location">
                {portfolio.location || 'Your location'}
              </span>
            </div>

            <h2>{portfolio.name || 'Your name'}</h2>
            <h3>{portfolio.role || 'Your professional title'}</h3>

            <p className="portfolio-about">
              {portfolio.about || 'Your introduction will appear here.'}
            </p>

            <div className="portfolio-preview-divider" />

            <h4>Skills & expertise</h4>
            <div className="portfolio-skill-list">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span key={`${skill}-${index}`}>{skill}</span>
                ))
              ) : (
                <span>Add your skills</span>
              )}
            </div>

            <div className="portfolio-preview-divider" />

            <h4>Featured project</h4>
            <div className="portfolio-project-card">
              <span className="portfolio-project-number">PROJECT 01</span>
              <h3>{portfolio.projectTitle || 'Your project name'}</h3>
              <p>
                {portfolio.projectDescription ||
                  'Your project description will appear here.'}
              </p>
            </div>

            {(portfolio.email || portfolio.github || portfolio.linkedin) && (
              <>
                <div className="portfolio-preview-divider" />
                <h4>Connect with me</h4>

                <div className="portfolio-links">
                  {portfolio.email && (
                    <a href={`mailto:${portfolio.email}`}>Email ↗</a>
                  )}

                  {portfolio.github && (
                    <a
                      href={portfolio.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {portfolio.linkedin && (
                    <a
                      href={portfolio.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </>
            )}
          </article>

          <p className="preview-disclaimer">
            This is a local preview. Your portfolio has not been published.
          </p>
        </section>
      </main>
    </div>
  );
}

export default PortfolioBuilder;
