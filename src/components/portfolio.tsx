"use client";
/* Images are static public assets; export intentionally uses native image elements. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Download,
  MapPin,
  Menu,
  Moon,
  Sun,
  X,
  Building2,
  Mail,
  Phone,
  Linkedin,
} from "lucide-react";
import { usePreferences } from "@/context/preferences";
import { assetPath, safeExternalUrl } from "@/lib/paths";
import { formatDate, visibleSections } from "@/lib/profile";
import { Blueprint } from "./blueprint";

function CvLink() {
  const { t, profile } = usePreferences();
  return profile.assets.cvFile ? (
    <a className="text-button" href={assetPath(profile.assets.cvFile)} download>
      <Download size={16} />
      {t.cv}
    </a>
  ) : (
    <button className="text-button unavailable" disabled>
      <Download size={16} />
      {t.noCv}
    </button>
  );
}

function SectionHeading({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span>
        {label}
      </p>
      <h2>{title}</h2>
    </div>
  );
}

export function Portfolio() {
  const { language, setLanguage, theme, toggleTheme, t, profile } =
    usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const selectedProject =
    profile.projects.find((project) => project.id === selectedProjectId) ??
    null;
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = visibleSections(profile);
  const navigation = [
    { id: "home", label: t.home },
    ...Object.entries(visible)
      .filter(([, show]) => show)
      .map(([id]) => ({ id, label: t[id as keyof typeof visible] })),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.id) setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -40% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main section, .experience-row")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);
  useEffect(() => {
    if (!selectedProject) return;
    dialog.current?.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [selectedProject]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-inner shell">
          <a
            className="brand"
            href="#home"
            aria-label={`${profile.personal.name} — ${t.home}`}
          >
            <span className="monogram">
              {profile.personal.initials}
              <span>·</span>
            </span>
            <span className="brand-caption">
              {profile.personal.name}
              <small>{t.portfolio}</small>
            </span>
          </a>
          <nav
            className={menuOpen ? "navigation open" : "navigation"}
            id="navigation"
            aria-label={t.menu}
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <div
              className="language-switch"
              role="group"
              aria-label={t.language}
            >
              {(["nl", "en"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setLanguage(value)}
                  aria-pressed={language === value}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="icon-button theme-button"
              aria-label={t.theme}
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button
              className="icon-button menu-button"
              aria-label={t.menu}
              aria-controls="navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="small-cross">+</span>
              {t.discipline}
            </p>
            <h1>
              {profile.personal.name.split(" ").slice(0, -1).join(" ")}
              <br />
              <span>
                {profile.personal.name.split(" ").at(-1)}
                <span className="accent">.</span>
              </span>
            </h1>
            <p className="hero-role">{profile.personal.title}</p>
            <p className="hero-intro">{profile.personal.introduction}</p>
            {profile.personal.availability && (
              <p>{profile.personal.availability}</p>
            )}
            <div className="hero-actions">
              <a href="#about" className="primary-button">
                {t.more}
                <ArrowUpRight size={17} />
              </a>
              <CvLink />
            </div>
            <p className="hero-location">
              <MapPin size={14} />
              {profile.personal.location}
            </p>
          </div>
          <div className="hero-visual">
            <Blueprint />
            <p className="concept-caption">{t.concept}</p>
          </div>
          <div className="hero-bottom">
            <span>01 — {t.portfolio}</span>
            <a href="#about" aria-label={t.next}>
              <ArrowDown size={17} />
            </a>
            <span>
              {profile.education[0]?.start.slice(0, 4)} —{" "}
              {profile.education[0]?.expectedEnd.slice(0, 4)}
            </span>
          </div>
        </section>
        <section id="about" className="section shell">
          <SectionHeading number="01" label={t.about} title={t.aboutHeading} />
          <div className="about-grid">
            <div className="profile-art">
              {profile.assets.profileImage ? (
                <img
                  src={assetPath(profile.assets.profileImage)}
                  alt={profile.assets.profileImageAlt || profile.personal.name}
                  width={1400}
                  height={1120}
                  loading="lazy"
                />
              ) : (
                <div
                  className="profile-fallback"
                  role="img"
                  aria-label={t.portrait}
                >
                  <svg viewBox="0 0 500 400" aria-hidden="true">
                    <g fill="none" stroke="currentColor">
                      <path d="M80 340V90h240v250ZM80 165h240M155 90v250M245 90v250M80 265h240M118 120h164v190H118Z" />
                      <path d="M320 90l95-45v250l-95 45M320 165l95-45M320 265l95-45M355 75v248M387 59v248M45 365h400M55 75v270" />
                      <circle cx="165" cy="220" r="54" />
                      <path d="M165 166v108M111 220h108" />
                    </g>
                  </svg>
                  <span className="profile-initials">
                    {profile.personal.initials}
                  </span>
                  <span className="art-label">{t.discipline} / 01</span>
                </div>
              )}
            </div>
            <div className="about-content">
              <p className="large-copy">{profile.personal.introduction}</p>
              {profile.about.biography && <p>{profile.about.biography}</p>}
              {profile.about.motivation && <p>{profile.about.motivation}</p>}
              <dl className="facts">
                <div>
                  <dt>{t.location}</dt>
                  <dd>{profile.personal.location}</dd>
                </div>
                {profile.education[0] && (
                  <>
                    <div>
                      <dt>{t.study}</dt>
                      <dd>{profile.education[0].degree}</dd>
                    </div>
                    <div>
                      <dt>{t.institution}</dt>
                      <dd>{profile.education[0].institution}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </section>
        {visible.education && (
          <section id="education" className="education-section">
            <div className="shell section">
              <SectionHeading
                number="02"
                label={t.education}
                title={t.educationHeading}
              />
              {profile.education.map((education) => (
                <div className="education-grid" key={education.id}>
                  <div className="education-info">
                    <p className="eyebrow">
                      {[education.start, education.end || education.expectedEnd]
                        .filter(Boolean)
                        .map((date) => formatDate(date, language))
                        .join(" — ")}
                    </p>
                    <h3>{education.degree}</h3>
                    <p className="institution">{education.institution}</p>
                    <div className="education-status">
                      {education.ongoing && (
                        <span>
                          <i className="status-dot" />
                          {t.ongoing}
                        </span>
                      )}
                      {education.expectedEnd && (
                        <span>
                          {t.expected}:{" "}
                          {formatDate(education.expectedEnd, language)}
                        </span>
                      )}
                    </div>
                    {education.description && <p>{education.description}</p>}
                    {education.specializations.length > 0 && (
                      <ul>
                        {education.specializations.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <div className="study-line">
                      <span>{education.start.slice(0, 4)}</span>
                      <div />
                      <span>
                        {(education.end || education.expectedEnd).slice(0, 4)}
                      </span>
                    </div>
                  </div>
                  <div className="education-art" aria-hidden="true">
                    <svg viewBox="0 0 500 300">
                      <g fill="none" stroke="currentColor">
                        <path d="M35 240h430M70 240V90h330v150M70 90l165-70 165 70M100 240V110h270v130M130 110v130M160 110v130M190 110v130M220 110v130M250 110v130M280 110v130M310 110v130M340 110v130M70 180h330M55 90H35m20 150H35M45 90v150M70 260v20m330-20v20M70 270h330" />
                        <path d="M195 240v-45h80v45M70 95h330M70 100h330" />
                      </g>
                      <text x="225" y="292">
                        A — A
                      </text>
                    </svg>
                  </div>
                </div>
              ))}
              {profile.qualifications.some((item) => item.name) && (
                <div className="qualifications">
                  <h3>{t.qualifications}</h3>
                  <ul>
                    {profile.qualifications
                      .filter((item) => item.name)
                      .map((item) => (
                        <li key={item.id}>
                          <span>{item.name}</span>
                          {item.date && (
                            <span className="muted">
                              {t.earned} · {formatDate(item.date, language)}
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
        {visible.experience && (
          <section id="experience" className="section shell">
            <SectionHeading
              number="03"
              label={t.experience}
              title={t.experienceHeading}
            />
            <div className="timeline">
              {profile.experience.map((experience, index) => (
                <article
                  key={experience.id}
                  className={`experience-row ${experience.propertyRelated ? "property-row" : ""}`}
                >
                  <div className="experience-period">
                    <span>{formatDate(experience.start, language)}</span>
                    <span>
                      —{" "}
                      {experience.end
                        ? formatDate(experience.end, language)
                        : t.present}
                    </span>
                  </div>
                  <div className="timeline-marker">
                    <span />
                  </div>
                  <div className="experience-content">
                    <div className="experience-top">
                      <span className="eyebrow">
                        {experience.type}
                        {experience.propertyRelated && (
                          <>
                            <Building2 size={13} />
                            {t.property}
                          </>
                        )}
                      </span>
                      <span className="entry-number">0{index + 1}</span>
                    </div>
                    <h3>{experience.role}</h3>
                    <p className="company">{experience.company}</p>
                    <p className="muted">
                      {[experience.location, experience.workMode]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {experience.description && (
                      <p className="experience-description">
                        {experience.description}
                      </p>
                    )}
                    {experience.skills.length > 0 && (
                      <ul className="skill-tags">
                        {experience.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {visible.skills && (
          <section id="skills" className="section skills-section">
            <div className="shell">
              <SectionHeading
                number="04"
                label={t.skills}
                title={t.skillsHeading}
              />
              {profile.skills
                .filter((group) => group.items.some((item) => item))
                .map((group) => (
                  <div className="skill-group" key={group.id}>
                    <h3>{group.name}</h3>
                    <ul>
                      {group.items
                        .filter((item) => item)
                        .map((item, index) => (
                          <li key={index}>
                            <span className="skill-index">0{index + 1}</span>
                            {item}
                            <ArrowUpRight size={20} aria-hidden="true" />
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>
        )}
        {visible.projects && (
          <section id="projects" className="section shell">
            <SectionHeading
              number="05"
              label={t.projects}
              title={t.projectsHeading}
            />
            <div className="project-grid">
              {profile.projects
                .filter((project) => project.title)
                .map((project) => (
                  <button
                    className="project-tile"
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    {project.cover ? (
                      <img
                        src={assetPath(project.cover)}
                        alt={project.title}
                        width={700}
                        height={500}
                      />
                    ) : (
                      <div className="project-fallback">
                        <Building2 size={64} />
                      </div>
                    )}
                    <span className="eyebrow">
                      {project.year} / {project.category}
                    </span>
                    <span className="project-title">
                      {project.title}
                      <ArrowUpRight size={22} />
                    </span>
                    <span>{t.details}</span>
                  </button>
                ))}
            </div>
          </section>
        )}
        {visible.interests && (
          <section id="interests" className="section shell">
            <SectionHeading
              number="06"
              label={t.interests}
              title={t.interestsHeading}
            />
            <ul className="skill-tags">
              {profile.interests
                .filter((interest) => interest)
                .map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
            </ul>
          </section>
        )}
        {visible.contact && (
          <section id="contact" className="section shell">
            <SectionHeading
              number="07"
              label={t.contact}
              title={t.contactHeading}
            />
            <div className="contact-links">
              {profile.contact.email && (
                <a href={`mailto:${profile.contact.email}`}>
                  <Mail />
                  {profile.contact.email}
                  <ArrowUpRight />
                </a>
              )}
              {profile.contact.phone && (
                <a href={`tel:${profile.contact.phone.replace(/[^+\d]/g, "")}`}>
                  <Phone />
                  {profile.contact.phone}
                  <ArrowUpRight />
                </a>
              )}
              {safeExternalUrl(profile.contact.linkedin) && (
                <a
                  href={safeExternalUrl(profile.contact.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin />
                  {t.linkedin}
                  <ArrowUpRight />
                </a>
              )}
              {profile.assets.cvFile && <CvLink />}
            </div>
          </section>
        )}
      </main>
      <footer className="shell footer">
        <a className="monogram" href="#home">
          {profile.personal.initials}
          <span>·</span>
        </a>
        <p>
          © {new Date().getFullYear()} {profile.personal.name}
          <span>
            {t.portfolio} / {profile.personal.title}
          </span>
        </p>
        <a href="#home">
          {t.top}
          <ArrowUp size={16} />
        </a>
      </footer>
      {selectedProject && (
        <dialog
          ref={dialog}
          className="project-dialog"
          aria-labelledby="project-title"
          onClose={() => setSelectedProjectId(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
        >
          <button
            autoFocus
            className="dialog-close icon-button"
            aria-label={t.close}
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
          <p className="eyebrow">
            {selectedProject.year} / {selectedProject.category}
          </p>
          <h2 id="project-title">{selectedProject.title}</h2>
          <p className="project-description">{selectedProject.description}</p>
          {selectedProject.tools.length > 0 && (
            <p>
              {t.tools}: {selectedProject.tools.join(" · ")}
            </p>
          )}
          {selectedProject.cover && (
            <img
              src={assetPath(selectedProject.cover)}
              alt={selectedProject.title}
              width={1000}
              height={700}
            />
          )}
          {selectedProject.images.map((image, index) => (
            <img
              key={index}
              src={assetPath(image.src)}
              alt={image.alt}
              width={1000}
              height={700}
            />
          ))}
          {safeExternalUrl(selectedProject.url) && (
            <a
              className="primary-button"
              href={safeExternalUrl(selectedProject.url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.external}
              <ArrowUpRight size={18} />
            </a>
          )}
        </dialog>
      )}
    </>
  );
}
