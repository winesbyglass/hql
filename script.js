const grid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll(".filter")];
const workButton = document.querySelector(".nav-link--work");
const workMenu = document.querySelector("#work-menu");
const dialog = document.querySelector("#project-dialog");
const closeButton = document.querySelector("#dialog-close");
const dialogMedia = document.querySelector("#dialog-media");
const dialogClient = document.querySelector("#dialog-client");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogCredits = document.querySelector("#dialog-credits");

let activeFilter = "all";

function roleLabel(role) {
  const labels = {
    direction: "Direction",
    edit: "Edit",
    colour: "Colour"
  };

  return labels[role] || role;
}

function renderProjects() {
  const visibleProjects = projects.filter((project) => {
    return activeFilter === "all" || project.roles.includes(activeFilter);
  });

  grid.innerHTML = "";
  emptyState.hidden = visibleProjects.length > 0;

  visibleProjects.forEach((project) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.type = "button";
    card.setAttribute("aria-label", `Open ${project.title}`);

    const image = document.createElement("img");
    image.className = "project-card__image";
    image.src = project.thumbnail;
    image.alt = "";
    image.loading = "lazy";

    const overlay = document.createElement("span");
    overlay.className = "project-card__overlay";

    const title = document.createElement("span");
    title.className = "project-card__title";
    title.textContent = project.title;

    const meta = document.createElement("span");
    meta.className = "project-card__meta";

    const client = document.createElement("span");
    client.textContent = project.client;

    const roles = document.createElement("span");
    roles.textContent = project.roles.map(roleLabel).join(" / ");

    meta.append(client, roles);
    overlay.append(title, meta);
    card.append(image, overlay);
    card.addEventListener("click", () => openProject(project));
    grid.append(card);
  });
}

function createMedia(project) {
  const media = project.media;

  if (media.type === "vimeo") {
    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${media.id}?title=0&byline=0&portrait=0`;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.title = `${project.title} video`;
    return iframe;
  }

  if (media.type === "video") {
    const video = document.createElement("video");
    video.src = media.src;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (media.poster) video.poster = media.poster;
    return video;
  }

  const image = document.createElement("img");
  image.src = media.src;
  image.alt = media.alt || `${project.title} project still`;
  return image;
}

function openProject(project) {
  dialogMedia.innerHTML = "";
  dialogCredits.innerHTML = "";

  dialogMedia.append(createMedia(project));
  dialogClient.textContent = `${project.client} · ${project.year}`;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;

  project.credits.forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;

    dialogCredits.append(term, description);
  });

  document.body.classList.add("is-locked");
  dialog.showModal();
}

function closeProject() {
  dialog.close();
  dialogMedia.innerHTML = "";
  document.body.classList.remove("is-locked");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((filterButton) => filterButton.classList.remove("is-active"));
    button.classList.add("is-active");
    workButton.textContent = activeFilter === "all" ? "Work" : roleLabel(activeFilter);
    workButton.setAttribute("aria-expanded", "false");
    workMenu.hidden = true;
    renderProjects();
  });
});

workButton.addEventListener("click", () => {
  const isOpen = workButton.getAttribute("aria-expanded") === "true";
  workButton.setAttribute("aria-expanded", String(!isOpen));
  workMenu.hidden = isOpen;
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = workMenu.contains(event.target);
  const clickedButton = workButton.contains(event.target);

  if (!clickedInsideMenu && !clickedButton) {
    workButton.setAttribute("aria-expanded", "false");
    workMenu.hidden = true;
  }
});

closeButton.addEventListener("click", closeProject);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeProject();
});

dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProject();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderProjects();
