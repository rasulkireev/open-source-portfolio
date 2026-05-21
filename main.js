import { archiveProjects, contributions, featuredProjects } from "./data.js";

const projectGrid = document.querySelector("#featured-projects");
const contributionList = document.querySelector("#contribution-list");
const archiveGrid = document.querySelector("#archive-grid");
const progressRail = document.querySelector(".progress-rail");
const sections = [...document.querySelectorAll(".slide")];

const formatter = new Intl.NumberFormat("en-US");

function repoImage(project) {
  return `https://opengraph.githubassets.com/portfolio-${project.owner}-${project.repo}/${project.owner}/${project.repo}`;
}

function renderProjects() {
  projectGrid.innerHTML = featuredProjects
    .map(
      (project) => `
        <article class="project-card reveal">
          <a class="project-image-link" href="${project.repoUrl}" aria-label="Open ${project.name} repository">
            <img class="project-image" src="${repoImage(project)}" alt="${project.name} GitHub preview" loading="lazy" />
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

function renderContributions() {
  contributionList.innerHTML = contributions
    .map(
      (item, index) => `
        <a class="contribution-item reveal" href="${item.url}">
          <span class="contribution-index">${String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong>${item.title}</strong>
            <small>${item.project} / ${item.meta}</small>
          </span>
        </a>
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

renderProjects();
renderContributions();
renderArchive();
renderProgress();
setupObservers();
setupKeyboardNavigation();
animateCounters();
