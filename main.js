import { archiveProjects, caseStudies, featuredProjects } from "./data.js?v=20260521f";

const caseStudyHost = document.querySelector("#case-studies");
const projectGrid = document.querySelector("#featured-projects");
const archiveGrid = document.querySelector("#archive-grid");
const progressRail = document.querySelector(".progress-rail");
let sections = [];

const formatter = new Intl.NumberFormat("en-US");

function renderCaseStudies() {
  caseStudyHost.innerHTML = caseStudies
    .map(
      (project, index) => `
        <section id="${project.id}" class="slide case-study-slide case-study-${project.accent}">
          <div class="case-study-copy reveal">
            <p class="eyebrow">Project deep dive ${String(index + 1).padStart(2, "0")}</p>
            <h2>${project.name}</h2>
            <p class="case-study-lede">${project.description}</p>
            <div class="tag-row case-tags">
              ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <ul class="case-bullets">
              ${project.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
            <div class="cta-row">
              <a class="button primary" href="${project.repoUrl}">Repository</a>
              ${project.homepage ? `<a class="button" href="${project.homepage}">Live site</a>` : ""}
            </div>
          </div>
          <aside class="case-study-media reveal">
            <a href="${project.repoUrl}" aria-label="Open ${project.name} repository">
              <div class="case-visual">
                <div class="browser-bar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>${project.owner}/${project.repo}</p>
                <strong>${project.name}</strong>
                <small>${project.language}</small>
              </div>
            </a>
            <div class="case-stat-grid">
              ${project.stats.map((stat) => `<span>${stat}</span>`).join("")}
            </div>
          </aside>
        </section>
      `,
    )
    .join("");
}

function renderProjects() {
  projectGrid.innerHTML = featuredProjects
    .map(
      (project) => `
        <article class="project-card reveal">
          <a class="project-image-link" href="${project.repoUrl}" aria-label="Open ${project.name} repository">
            <div class="project-art">
              <span>${project.owner}</span>
              <strong>${project.name}</strong>
              <small>${project.language}</small>
            </div>
          </a>
          <div class="project-body">
            <div class="project-kicker">
              <span>${project.role}</span>
              <span>${project.language}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <p class="proof-line">${project.proof}</p>
            <div class="tag-row">
              ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <div class="project-links">
              <a href="${project.repoUrl}">Repo</a>
              ${project.homepage ? `<a href="${project.homepage}">Live</a>` : ""}
              <span>${formatter.format(project.stars)} stars</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderArchive() {
  archiveGrid.innerHTML = archiveProjects
    .map(
      ([name, description, meta, url]) => `
        <a class="archive-card reveal" href="${url}">
          <strong>${name}</strong>
          <span>${description}</span>
          <em>${meta}</em>
        </a>
      `,
    )
    .join("");
}

function renderProgress() {
  sections = [...document.querySelectorAll(".slide")];
  progressRail.innerHTML = sections
    .map(
      (section, index) => `
        <a href="#${section.id}" aria-label="Go to ${section.id}" data-progress-index="${index}">
          <span></span>
        </a>
      `,
    )
    .join("");
}

function setupObservers() {
  sections = [...document.querySelectorAll(".slide")];
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeIndex = sections.indexOf(entry.target);
        document.querySelectorAll("[data-progress-index]").forEach((link, index) => {
          link.classList.toggle("is-active", index === activeIndex);
        });
      });
    },
    { threshold: 0.55 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = formatter.format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function setupKeyboardNavigation() {
  window.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    const currentIndex = sections.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35;
    });
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const next = sections[Math.max(0, Math.min(sections.length - 1, currentIndex + delta))];
    if (next) {
      event.preventDefault();
      next.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function alignInitialHash() {
  if (!location.hash) return;
  const align = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target) window.scrollTo({ top: target.offsetTop, behavior: "auto" });
  };
  requestAnimationFrame(align);
  window.setTimeout(align, 120);
}

renderCaseStudies();
renderProjects();
renderArchive();
renderProgress();
setupObservers();
setupKeyboardNavigation();
alignInitialHash();
animateCounters();
