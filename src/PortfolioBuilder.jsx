
import { useEffect, useState } from 'react';

const defaultPortfolio = {
  name: 'Jawad Riaz',
  role: 'Aspiring Machine Learning Engineer',
  about: 'I am a technology enthusiast interested in building useful applications with software development and machine learning.',
  email: '',
  location: 'Pakistan',
  skills: 'Python, Machine Learning, C++, HTML, CSS',
  projects: [
    {
      id: 'default-project',
      title: 'AI Portfolio Builder',
      description:
        'A web application that helps people create professional portfolios with AI-powered assistance.',
    },
  ],
  education: [],
  experience: [],
  certifications: [],
  github: 'https://github.com/Jawad03stu',
  linkedin: '',
};

let nextEntryId = 0;

function createEntryId(existingIds = new Set()) {
  let id;

  do {
    id =
      globalThis.crypto?.randomUUID?.() ??
      `entry-${Date.now()}-${nextEntryId++}`;
  } while (existingIds.has(id));

  return id;
}

function normalizeEntries(entries, fields, usedIds = new Set(), withPresent = false) {
  if (!Array.isArray(entries)) return [];

  return entries
    .filter(
      (entry) => entry && typeof entry === 'object' && !Array.isArray(entry)
    )
    .map((entry) => {
      const savedId =
        typeof entry.id === 'string' || typeof entry.id === 'number'
          ? String(entry.id)
          : '';
      const id =
        savedId && !usedIds.has(savedId) ? savedId : createEntryId(usedIds);

      usedIds.add(id);

      return fields.reduce(
        (normalized, field) => {
          normalized[field] =
            typeof entry[field] === 'string' ? entry[field] : '';
          return normalized;
        },
        withPresent ? { id, present: entry.present === true } : { id }
      );
    });
}

function loadPortfolio() {
  try {
    const savedPortfolio = window.localStorage.getItem('portifyai-draft');

    if (!savedPortfolio) return defaultPortfolio;

    const parsedPortfolio = JSON.parse(savedPortfolio);
    if (
      !parsedPortfolio ||
      typeof parsedPortfolio !== 'object' ||
      Array.isArray(parsedPortfolio)
    ) {
      console.warn('The saved portfolio draft is invalid; using the defaults.');
      return defaultPortfolio;
    }

    const usedIds = new Set();
    let projects;
    if (Array.isArray(parsedPortfolio.projects)) {
      projects = normalizeEntries(
        parsedPortfolio.projects,
        ['title', 'description'],
        usedIds
      );
    } else if (
      Object.hasOwn(parsedPortfolio, 'projectTitle') ||
      Object.hasOwn(parsedPortfolio, 'projectDescription')
    ) {
      projects = normalizeEntries([
        {
          id: 'migrated-project',
          title:
            typeof parsedPortfolio.projectTitle === 'string'
              ? parsedPortfolio.projectTitle
              : '',
          description:
            typeof parsedPortfolio.projectDescription === 'string'
              ? parsedPortfolio.projectDescription
              : '',
        },
      ], ['title', 'description'], usedIds);
    } else {
      projects = normalizeEntries(
        defaultPortfolio.projects,
        ['title', 'description'],
        usedIds
      );
    }
    const education = normalizeEntries(
      parsedPortfolio.education ?? defaultPortfolio.education,
      ['institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'description'],
      usedIds,
      true
    );
    const experience = normalizeEntries(
      parsedPortfolio.experience ?? defaultPortfolio.experience,
      ['company', 'jobTitle', 'employmentType', 'startDate', 'endDate', 'location', 'description'],
      usedIds,
      true
    );
    const certifications = normalizeEntries(
      parsedPortfolio.certifications ?? defaultPortfolio.certifications,
      ['name', 'issuer', 'issueDate', 'expirationDate', 'credentialUrl'],
      usedIds
    );

    return {
      name:
        typeof parsedPortfolio.name === 'string'
          ? parsedPortfolio.name
          : defaultPortfolio.name,
      role:
        typeof parsedPortfolio.role === 'string'
          ? parsedPortfolio.role
          : defaultPortfolio.role,
      about:
        typeof parsedPortfolio.about === 'string'
          ? parsedPortfolio.about
          : defaultPortfolio.about,
      email:
        typeof parsedPortfolio.email === 'string'
          ? parsedPortfolio.email
          : defaultPortfolio.email,
      location:
        typeof parsedPortfolio.location === 'string'
          ? parsedPortfolio.location
          : defaultPortfolio.location,
      skills:
        typeof parsedPortfolio.skills === 'string'
          ? parsedPortfolio.skills
          : defaultPortfolio.skills,
      projects,
      education,
      experience,
      certifications,
      github:
        typeof parsedPortfolio.github === 'string'
          ? parsedPortfolio.github
          : defaultPortfolio.github,
      linkedin:
        typeof parsedPortfolio.linkedin === 'string'
          ? parsedPortfolio.linkedin
          : defaultPortfolio.linkedin,
    };
  } catch (error) {
    console.error('Could not load the portfolio draft.', error);
    return defaultPortfolio;
  }
}

function isValidEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidSocialUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatDate(value) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return '';

  const [, year, month, day] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

const sectionDefinitions = {
  education: {
    singular: 'education entry',
    addLabel: 'education',
    fields: [
      { name: 'institution', label: 'Institution name', required: true },
      { name: 'degree', label: 'Degree', required: true },
      { name: 'fieldOfStudy', label: 'Field of study' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    requiredFields: ['institution', 'degree'],
    nameField: 'institution',
    presentLabel: 'Currently studying here',
  },
  experience: {
    singular: 'work experience entry',
    addLabel: 'work experience',
    fields: [
      { name: 'company', label: 'Company name', required: true },
      { name: 'jobTitle', label: 'Job title', required: true },
      {
        name: 'employmentType',
        label: 'Employment type',
        type: 'select',
        options: [
          'Full-time',
          'Part-time',
          'Contract',
          'Freelance',
          'Internship',
          'Temporary',
          'Self-employed',
          'Other',
        ],
      },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'location', label: 'Location' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    requiredFields: ['company', 'jobTitle'],
    nameField: 'company',
    presentLabel: 'Currently working here',
  },
  certifications: {
    singular: 'certification',
    addLabel: 'certification',
    fields: [
      { name: 'name', label: 'Certification name', required: true },
      { name: 'issuer', label: 'Issuing organization', required: true },
      { name: 'issueDate', label: 'Issue date', type: 'date' },
      { name: 'expirationDate', label: 'Expiration date', type: 'date' },
      { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
    ],
    requiredFields: ['name', 'issuer'],
    nameField: 'name',
  },
};

function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState(loadPortfolio);
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    try {
      window.localStorage.setItem('portifyai-draft', JSON.stringify(portfolio));
    } catch (error) {
      console.error('Could not save the portfolio draft.', error);
    }
  }, [portfolio]);

  const updateField = (field, value) => {
    setPortfolio((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetPortfolio = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset your portfolio? This cannot be undone.'
    );

    if (!confirmed) return;

    setPortfolio({
      ...defaultPortfolio,
      projects: defaultPortfolio.projects.map((project) => ({ ...project })),
      education: [],
      experience: [],
      certifications: [],
    });
  };

  const updateEntry = (section, entryId, field, value) => {
    setPortfolio((previous) => ({
      ...previous,
      [section]: previous[section].map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addEntry = (section) => {
    const definition = sectionDefinitions[section];
    const fields = definition.fields.map((field) => field.name);
    const usedIds = new Set(
      ['projects', 'education', 'experience', 'certifications'].flatMap(
        (key) => portfolio[key].map((entry) => entry.id)
      )
    );
    const newEntry = fields.reduce(
      (entry, field) => ({ ...entry, [field]: '' }),
      {
        id: createEntryId(usedIds),
        ...(definition.presentLabel ? { present: false } : {}),
      }
    );

    setPortfolio((previous) => ({
      ...previous,
      [section]: [...previous[section], newEntry],
    }));
  };

  const removeEntry = (section, entry) => {
    const definition = sectionDefinitions[section];
    const title = entry[definition.nameField].trim() || definition.singular;
    if (!window.confirm(`Remove "${title}"?`)) return;

    setPortfolio((previous) => ({
      ...previous,
      [section]: previous[section].filter((item) => item.id !== entry.id),
    }));
  };

  const touchEntryField = (section, entryId, fieldName) => {
    setTouchedFields((previous) => ({
      ...previous,
      [`${section}-${entryId}-${fieldName}`]: true,
    }));
  };

  const renderEntriesEditor = (section) => {
    const definition = sectionDefinitions[section];

    return (
      <>
        {portfolio[section].map((entry, index) => (
          <div className="project-form-card" key={entry.id}>
            <div className="project-form-heading">
              <h4>{definition.singular[0].toUpperCase() + definition.singular.slice(1)} {index + 1}</h4>
              <button
                type="button"
                className="btn btn-outline"
                aria-label={`Remove ${definition.singular} ${index + 1}`}
                onClick={() => removeEntry(section, entry)}
              >
                Remove
              </button>
            </div>

            {definition.fields.map((field) => {
              if (field.name === 'endDate' && entry.present) return null;

              const inputId = `${section}-${entry.id}-${field.name}`;
              const isRequired = definition.requiredFields.includes(field.name);
              const fieldWasTouched =
                touchedFields[`${section}-${entry.id}-${field.name}`];
              const hasError = fieldWasTouched && (
                (isRequired && !entry[field.name].trim()) ||
                (field.type === 'url' &&
                  entry[field.name] &&
                  !isValidSocialUrl(entry[field.name]))
              );
              const errorMessage =
                isRequired && !entry[field.name].trim()
                  ? `${field.label} is required.`
                  : 'Enter a valid http or https URL.';
              const commonProps = {
                id: inputId,
                value: entry[field.name],
                required: field.required,
                'aria-invalid': hasError || undefined,
                'aria-describedby': hasError ? `${inputId}-error` : undefined,
                onBlur: () => touchEntryField(section, entry.id, field.name),
                onChange: (event) =>
                  updateEntry(section, entry.id, field.name, event.target.value),
              };

              return (
                <div key={field.name}>
                  <label htmlFor={inputId}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea {...commonProps} rows="4" />
                  ) : field.type === 'select' ? (
                    <select {...commonProps}>
                      <option value="">Select employment type</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...commonProps}
                      type={field.type || 'text'}
                      placeholder={field.type === 'url' ? 'https://example.com/credential' : undefined}
                    />
                  )}
                  {hasError && (
                    <p className="builder-field-error" id={`${inputId}-error`} role="alert">
                      {errorMessage}
                    </p>
                  )}
                </div>
              );
            })}

            {definition.presentLabel && (
              <label className="builder-checkbox-label" htmlFor={`${section}-${entry.id}-present`}>
                <input
                  id={`${section}-${entry.id}-present`}
                  type="checkbox"
                  checked={entry.present}
                  onChange={(event) =>
                    updateEntry(section, entry.id, 'present', event.target.checked)
                  }
                />
                {definition.presentLabel}
              </label>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addEntry(section)}
        >
          + Add {definition.addLabel}
        </button>
      </>
    );
  };

  const updateProject = (projectId, field, value) => {
    setPortfolio((previous) => ({
      ...previous,
      projects: previous.projects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addProject = () => {
    setPortfolio((previous) => ({
      ...previous,
      projects: [
        ...previous.projects,
        {
          id: createEntryId(new Set(previous.projects.map((project) => project.id))),
          title: '',
          description: '',
        },
      ],
    }));
  };

  const removeProject = (projectId, projectIndex, projectTitle) => {
    const projectName = projectTitle.trim() || `Project ${projectIndex + 1}`;
    if (!window.confirm(`Remove "${projectName}" from your portfolio?`)) return;

    setPortfolio((previous) => ({
      ...previous,
      projects: previous.projects.filter((project) => project.id !== projectId),
    }));
  };

  const skills = (portfolio.skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
  const emailIsValid = isValidEmail(portfolio.email);
  const githubIsValid = isValidSocialUrl(portfolio.github);
  const linkedinIsValid = isValidSocialUrl(portfolio.linkedin);

  return (
    <div className="builder-page">
      <header className="builder-header">
        <a className="logo" href="/">
          Portify<span>AI</span>
        </a>

        <span className="builder-status">Draft portfolio</span>

<button
  type="button"
  className="btn btn-outline"
  onClick={resetPortfolio}
>
  Reset draft
</button>

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
                aria-invalid={!emailIsValid}
                aria-describedby={!emailIsValid ? 'email-error' : undefined}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
              />
              {!emailIsValid && (
                <p className="builder-field-error" id="email-error" role="alert">
                  Enter a valid email address.
                </p>
              )}
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
              <h2>Projects</h2>
              <p>Showcase the projects you have worked on.</p>
            </div>
          </div>

          {portfolio.projects.map((project, index) => (
            <div className="project-form-card" key={project.id}>
              <div className="project-form-heading">
                <h4>Project {index + 1}</h4>
                <button
                  type="button"
                  className="btn btn-outline"
                  aria-label={`Remove project ${index + 1}`}
                  onClick={() => removeProject(project.id, index, project.title)}
                >
                  Remove
                </button>
              </div>

              <label htmlFor={`projectTitle-${project.id}`}>Project name</label>
              <input
                id={`projectTitle-${project.id}`}
                value={project.title}
                onChange={(event) =>
                  updateProject(project.id, 'title', event.target.value)
                }
                placeholder="Your project name"
              />

              <label htmlFor={`projectDescription-${project.id}`}>
                Project description
              </label>
              <textarea
                id={`projectDescription-${project.id}`}
                rows="4"
                value={project.description}
                onChange={(event) =>
                  updateProject(project.id, 'description', event.target.value)
                }
                placeholder="Explain what your project does"
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline"
            onClick={addProject}
          >
            + Add project
          </button>

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>04</span>
            <div>
              <h2>Education</h2>
              <p>Add your academic background.</p>
            </div>
          </div>

          {renderEntriesEditor('education')}

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>05</span>
            <div>
              <h2>Work experience</h2>
              <p>Highlight your professional experience.</p>
            </div>
          </div>

          {renderEntriesEditor('experience')}

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>06</span>
            <div>
              <h2>Certifications</h2>
              <p>Add professional certifications and credentials.</p>
            </div>
          </div>

          {renderEntriesEditor('certifications')}

          <div className="builder-divider" />

          <div className="builder-section-heading">
            <span>07</span>
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
            aria-invalid={!githubIsValid}
            aria-describedby={!githubIsValid ? 'github-error' : undefined}
            onChange={(event) => updateField('github', event.target.value)}
            placeholder="https://github.com/username"
          />
          {!githubIsValid && (
            <p className="builder-field-error" id="github-error" role="alert">
              Enter a valid http or https URL.
            </p>
          )}

          <label htmlFor="linkedin">LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            value={portfolio.linkedin}
            aria-invalid={!linkedinIsValid}
            aria-describedby={!linkedinIsValid ? 'linkedin-error' : undefined}
            onChange={(event) => updateField('linkedin', event.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          {!linkedinIsValid && (
            <p className="builder-field-error" id="linkedin-error" role="alert">
              Enter a valid http or https URL.
            </p>
          )}
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

            <h4>Projects</h4>
            {portfolio.projects.length ? (
              portfolio.projects.map((project, index) => (
                <div className="portfolio-project-card" key={project.id}>
                  <span className="portfolio-project-number">
                    PROJECT {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{project.title || 'Your project name'}</h3>
                  <p>
                    {project.description ||
                      'Your project description will appear here.'}
                  </p>
                </div>
              ))
            ) : (
              <p className="portfolio-project-empty">
                Add a project to showcase your work.
              </p>
            )}

            {portfolio.education.length > 0 && (
              <>
                <div className="portfolio-preview-divider" />
                <h4>Education</h4>
                {portfolio.education.map((entry) => {
                  const dates = [
                    formatDate(entry.startDate),
                    entry.present ? 'Present' : formatDate(entry.endDate),
                  ].filter(Boolean);

                  return (
                    <div className="portfolio-detail-card" key={entry.id}>
                      <h3>{entry.institution || 'Institution name'}</h3>
                      {(entry.degree || entry.fieldOfStudy) && (
                        <p className="portfolio-detail-subtitle">
                          {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {dates.length > 0 && (
                        <p className="portfolio-detail-meta">{dates.join(' – ')}</p>
                      )}
                      {entry.description && (
                        <p className="portfolio-detail-description">{entry.description}</p>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {portfolio.experience.length > 0 && (
              <>
                <div className="portfolio-preview-divider" />
                <h4>Work experience</h4>
                {portfolio.experience.map((entry) => {
                  const dates = [
                    formatDate(entry.startDate),
                    entry.present ? 'Present' : formatDate(entry.endDate),
                  ].filter(Boolean);
                  const details = [
                    entry.employmentType,
                    entry.location,
                    dates.length > 0 ? dates.join(' – ') : '',
                  ].filter(Boolean);

                  return (
                    <div className="portfolio-detail-card" key={entry.id}>
                      <h3>{entry.jobTitle || 'Job title'}</h3>
                      <p className="portfolio-detail-subtitle">
                        {entry.company || 'Company name'}
                      </p>
                      {details.length > 0 && (
                        <p className="portfolio-detail-meta">{details.join(' · ')}</p>
                      )}
                      {entry.description && (
                        <p className="portfolio-detail-description">{entry.description}</p>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {portfolio.certifications.length > 0 && (
              <>
                <div className="portfolio-preview-divider" />
                <h4>Certifications</h4>
                {portfolio.certifications.map((entry) => {
                  const dates = [
                    formatDate(entry.issueDate)
                      ? `Issued ${formatDate(entry.issueDate)}`
                      : '',
                    formatDate(entry.expirationDate)
                      ? `Expires ${formatDate(entry.expirationDate)}`
                      : '',
                  ].filter(Boolean);

                  return (
                    <div className="portfolio-detail-card" key={entry.id}>
                      <h3>{entry.name || 'Certification name'}</h3>
                      <p className="portfolio-detail-subtitle">
                        {entry.issuer || 'Issuing organization'}
                      </p>
                      {dates.length > 0 && (
                        <p className="portfolio-detail-meta">{dates.join(' · ')}</p>
                      )}
                      {entry.credentialUrl &&
                        isValidSocialUrl(entry.credentialUrl) && (
                          <a
                            className="portfolio-credential-link"
                            href={entry.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View credential ↗
                          </a>
                        )}
                    </div>
                  );
                })}
              </>
            )}

            {(emailIsValid && portfolio.email) ||
            (githubIsValid && portfolio.github) ||
            (linkedinIsValid && portfolio.linkedin) ? (
              <>
                <div className="portfolio-preview-divider" />
                <h4>Connect with me</h4>

                <div className="portfolio-links">
                  {emailIsValid && portfolio.email && (
                    <a href={`mailto:${portfolio.email}`}>Email ↗</a>
                  )}

                  {githubIsValid && portfolio.github && (
                    <a
                      href={portfolio.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {linkedinIsValid && portfolio.linkedin && (
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
            ) : null}
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
