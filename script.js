const projectGrid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll(".filter")];
const yearNode = document.querySelector("#year");

const projectDialog = document.querySelector("#project-dialog");
const dialogClose = document.querySelector("#dialog-close");
const dialogIndex = document.querySelector("#dialog-index");
const dialogTitle = document.querySelector("#dialog-title");
const dialogType = document.querySelector("#dialog-type");
const dialogYear = document.querySelector("#dialog-year");
const dialogMedium = document.querySelector("#dialog-medium");
const dialogRole = document.querySelector("#dialog-role");
const dialogDescription = document.querySelector("#dialog-description");
const dialogMedia = document.querySelector("#dialog-media");
const dialogCredits = document.querySelector("#dialog-credits");
const festivalSection = document.querySelector("#festival-section");
const festivalList = document.querySelector("#festival-list");

const contactTrigger = document.querySelector("#contact-trigger");
const contactDialog = document.querySelector("#contact-dialog");
const contactClose = document.querySelector("#contact-close");

let activeFilter = "all";

function twoDigits(number) {
  return String(number + 1).padStart(2, "0");
}

function createProjectCard(project, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "project-card";
  card.dataset.category = project.category;
  card.setAttribute("aria-label", `Open ${project.title}`);

  const image = document.createElement("img");
  image.src = project.thumbnail;
  image.alt = `${project.title} project artwork`;
  image.loading = index < 4 ? "eager" : "lazy";

  const overlay = document.createElement("span");
  overlay.className = "project-card__overlay";

  const number = document.createElement("span");
  number.className = "project-card__number";
  number.textContent = twoDigits(index);

  const title = document.createElement("span");
  title.className = "project-card__title";
  title.textContent = project.title;

  const meta = document.createElement("span");
  meta.className = "project-card__meta";
  meta.textContent = [project.type, project.year].filter(Boolean).join(" / ");

  overlay.append(number, title, meta);
  card.append(image, overlay);
  card.addEventListener("click", () => openProject(project, index));
  return card;
}

function renderProjects() {
  projectGrid.innerHTML = "";
  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => activeFilter === "all" || project.category === activeFilter);

  visible.forEach(({ project, index }) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  emptyState.hidden = visible.length > 0;
}

function renderMedia(project) {
  dialogMedia.innerHTML = "";

  if (project.media.type === "vimeo") {
    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${project.media.id}?title=0&byline=0&portrait=0&color=000000`;
    iframe.title = project.title;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    dialogMedia.appendChild(iframe);
    return;
  }

  if (project.media.type === "external") {
    const link = document.createElement("a");
    link.className = "external-media";
    link.href = project.media.url;
    link.target = "_blank";
    link.rel = "noreferrer";

    const image = document.createElement("img");
    image.src = project.media.src;
    image.alt = project.media.alt || project.title;

    const label = document.createElement("span");
    label.textContent = project.media.label || "WATCH ↗";

    link.append(image, label);
    dialogMedia.appendChild(link);
  }
}

function renderCredits(project) {
  dialogCredits.innerHTML = "";
  project.credits.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dialogCredits.append(dt, dd);
  });
}

function renderFestivals(project) {
  festivalList.innerHTML = "";
  const festivals = project.festivals || [];
  festivalSection.hidden = festivals.length === 0;

  festivals.forEach(([name, country]) => {
    const item = document.createElement("li");
    const festivalName = document.createElement("span");
    festivalName.textContent = name;
    const festivalCountry = document.createElement("span");
    festivalCountry.textContent = country;
    item.append(festivalName, festivalCountry);
    festivalList.appendChild(item);
  });
}

function openProject(project, index) {
  dialogIndex.textContent = twoDigits(index);
  dialogTitle.textContent = project.title;
  dialogType.textContent = project.type || "";
  dialogYear.textContent = project.year || "";
  dialogMedium.textContent = project.medium || "";
  dialogRole.textContent = project.roleText || "";
  dialogDescription.textContent = project.description || "";

  renderMedia(project);
  renderCredits(project);
  renderFestivals(project);

  projectDialog.showModal();
  document.body.classList.add("is-locked");
}

function closeProject() {
  projectDialog.close();
  dialogMedia.innerHTML = "";
  document.body.classList.remove("is-locked");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((filter) => filter.classList.toggle("is-active", filter === button));
    renderProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

dialogClose.addEventListener("click", closeProject);
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) {
    closeProject();
  }
});

contactTrigger.addEventListener("click", () => {
  contactDialog.showModal();
  document.body.classList.add("is-locked");
});

contactClose.addEventListener("click", () => {
  contactDialog.close();
  document.body.classList.remove("is-locked");
});

contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) {
    contactDialog.close();
    document.body.classList.remove("is-locked");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  if (projectDialog.open) {
    closeProject();
  }
  if (contactDialog.open) {
    contactDialog.close();
    document.body.classList.remove("is-locked");
  }
});

yearNode.textContent = new Date().getFullYear();
renderProjects();
