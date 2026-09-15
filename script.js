const grid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll(".filter")];
const dialog = document.querySelector("#project-dialog");
const closeButton = document.querySelector("#dialog-close");
const dialogMedia = document.querySelector("#dialog-media");
const dialogClient = document.querySelector("#dialog-client");
const dialogTitle = document.querySelector("#dialog-title");
const dialogRole = document.querySelector("#dialog-role");
const dialogNumber = document.querySelector("#dialog-number");
const dialogDescription = document.querySelector("#dialog-description");
const dialogCredits = document.querySelector("#dialog-credits");
const festivalSection = document.querySelector("#festival-section");
const festivalList = document.querySelector("#festival-list");

const cardLayouts = ["wide", "portrait", "standard", "wide", "full"];
let activeFilter = "all";

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function projectKicker(project) {
  return [project.client, project.type, project.year].filter(Boolean).join(" · ");
}

function renderProjects() {
  const visibleProjects = projects.filter((project) => {
    return activeFilter === "all" || project.category === activeFilter;
  });

  grid.innerHTML = "";
  emptyState.hidden = visibleProjects.length > 0;

  visibleProjects.forEach((project) => {
    const originalIndex = projects.indexOf(project);
    const card = document.createElement("button");
    card.className = `project-card project-card--${cardLayouts[originalIndex % cardLayouts.length]}`;
    card.type = "button";
    card.setAttribute("aria-label", `Open ${project.title}`);

    const frame = document.createElement("span");
    frame.className = "project-card__frame";

    const image = document.createElement("img");
    image.className = "project-card__image";
    image.src = project.thumbnail;
    image.alt = "";
    image.loading = "lazy";

    const hover = document.createElement("span");
    hover.className = "project-card__hover";

    const hoverTitle = document.createElement("span");
    hoverTitle.className = "project-card__hover-title";
    hoverTitle.textContent = project.title;

    const hoverAction = document.createElement("span");
    hoverAction.className = "project-card__hover-action";
    hoverAction.textContent = "View project ↗";

    hover.append(hoverTitle, hoverAction);
    frame.append(image, hover);

    const caption = document.createElement("span");
    caption.className = "project-card__caption";

    const number = document.createElement("span");
    number.className = "project-card__number";
    number.textContent = formatIndex(originalIndex);

    const title = document.createElement("span");
    title.className = "project-card__title";
    title.textContent = project.title;

    const meta = document.createElement("span");
    meta.className = "project-card__meta";
    meta.textContent = [project.type, project.year].filter(Boolean).join(" / ");

    caption.append(number, title, meta);
    card.append(frame, caption);
    card.addEventListener("click", () => openProject(project, originalIndex));
    grid.append(card);
  });
}

function createMedia(project) {
  const media = project.media;

  if (media.type === "vimeo") {
    const wrapper = document.createElement("div");
    wrapper.className = "video-frame";

    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${media.id}?title=0&byline=0&portrait=0&color=ffffff`;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.title = `${project.title} video`;

    wrapper.append(iframe);
    return wrapper;
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

  if (media.type === "external") {
    const wrapper = document.createElement("div");
    wrapper.className = "external-media";

    const image = document.createElement("img");
    image.src = media.src;
    image.alt = media.alt || `${project.title} project still`;

    const link = document.createElement("a");
    link.className = "external-media__link";
    link.href = media.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = media.label || "Watch film ↗";

    wrapper.append(image, link);
    return wrapper;
  }

  const image = document.createElement("img");
  image.src = media.src;
  image.alt = media.alt || `${project.title} project still`;
  return image;
}

function renderFestivals(project) {
  festivalList.innerHTML = "";
  const festivals = project.festivals || [];
  festivalSection.hidden = festivals.length === 0;

  festivals.forEach(([name, location]) => {
    const item = document.createElement("li");
    const festivalName = document.createElement("span");
    const festivalLocation = document.createElement("span");

    festivalName.textContent = name;
    festivalLocation.textContent = location;
    item.append(festivalName, festivalLocation);
    festivalList.append(item);
  });
}

function openProject(project, index) {
  dialogMedia.innerHTML = "";
  dialogCredits.innerHTML = "";

  dialogMedia.append(createMedia(project));
  dialogNumber.textContent = formatIndex(index);
  dialogClient.textContent = projectKicker(project);
  dialogTitle.textContent = project.title;
  dialogRole.textContent = project.roleText || "";
  dialogDescription.textContent = project.description || "";

  project.credits.forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;

    dialogCredits.append(term, description);
  });

  renderFestivals(project);
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
    renderProjects();
  });
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
