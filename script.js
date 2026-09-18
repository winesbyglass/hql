const projectGrid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll(".filter")];
const filterModeButtons = [...document.querySelectorAll(".filter-mode__button")];
const filterGroups = [...document.querySelectorAll(".filter-list")];
const yearNode = document.querySelector("#year");


const projectDialog = document.querySelector("#project-dialog");
const dialogClose = document.querySelector("#dialog-close");
const dialogIndex = document.querySelector("#dialog-index");
const dialogTitle = document.querySelector("#dialog-title");
const dialogType = document.querySelector("#dialog-type");
const dialogYear = document.querySelector("#dialog-year");
const dialogMedium = document.querySelector("#dialog-medium");
const dialogRole = document.querySelector("#dialog-role");
const dialogStatus = document.querySelector("#dialog-status");
const dialogStatusRow = document.querySelector("#dialog-status-row");
const dialogDescription = document.querySelector("#dialog-description");
const dialogMedia = document.querySelector("#dialog-media");
const dialogCredits = document.querySelector("#dialog-credits");
const stillsSection = document.querySelector("#stills-section");
const stillsGrid = document.querySelector("#stills-grid");
const stillsCount = document.querySelector("#stills-count");
const festivalSection = document.querySelector("#festival-section");
const festivalList = document.querySelector("#festival-list");

const stillsLightbox = document.querySelector("#stills-lightbox");
const stillsLightboxClose = document.querySelector("#stills-lightbox-close");
const stillsLightboxPrev = document.querySelector("#stills-lightbox-prev");
const stillsLightboxNext = document.querySelector("#stills-lightbox-next");
const stillsLightboxImage = document.querySelector("#stills-lightbox-image");
const stillsLightboxCounter = document.querySelector("#stills-lightbox-counter");

const contactTrigger = document.querySelector("#contact-trigger");
const contactDialog = document.querySelector("#contact-dialog");
const contactClose = document.querySelector("#contact-close");
const contactPortrait = document.querySelector("#contact-portrait");
const contactHeadshot = document.querySelector("#contact-headshot");


let activeFilterMode = "type";
const activeFilters = { type: "all", role: "all" };
let activePreview = null;
let vimeoApiPromise = null;
let youtubeApiPromise = null;
let lightboxStills = [];
let lightboxIndex = 0;
let lightboxProjectTitle = "";

const HOVER_SEGMENT_SECONDS = 5;
const HOVER_SKIP_SECONDS = 10;
const HOVER_STEP_SECONDS = HOVER_SEGMENT_SECONDS + HOVER_SKIP_SECONDS;
const hoverPreviewAllowed = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function loadVimeoApi() {
  if (window.Vimeo && window.Vimeo.Player) return Promise.resolve(window.Vimeo);
  if (vimeoApiPromise) return vimeoApiPromise;

  vimeoApiPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-hover-preview="vimeo"]');
    const script = existing || document.createElement("script");

    const finish = () => {
      if (window.Vimeo && window.Vimeo.Player) resolve(window.Vimeo);
      else reject(new Error("Vimeo Player API did not load."));
    };

    if (!existing) {
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      script.dataset.hoverPreview = "vimeo";
      script.addEventListener("load", finish, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    } else if (window.Vimeo && window.Vimeo.Player) {
      finish();
    } else {
      script.addEventListener("load", finish, { once: true });
      script.addEventListener("error", reject, { once: true });
    }
  });

  return vimeoApiPromise;
}

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      resolve(window.YT);
    };

    const existing = document.querySelector('script[data-hover-preview="youtube"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.hoverPreview = "youtube";
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function getNextPreviewStart(currentStart, duration) {
  const nextStart = currentStart + HOVER_STEP_SECONDS;
  if (!duration || nextStart >= Math.max(duration - 0.25, 0)) return 0;
  return nextStart;
}

function showPreview(controller) {
  if (activePreview !== controller) return;
  controller.card.classList.remove("is-preview-loading");
  controller.card.classList.add("is-previewing");
}

function clearPreviewController(controller) {
  if (!controller) return;

  window.clearInterval(controller.timer);
  window.clearTimeout(controller.fallbackTimer);

  if (typeof controller.cleanup === "function") {
    try {
      controller.cleanup();
    } catch (error) {
      // Ignore cleanup errors from an already-destroyed remote player.
    }
  }

  controller.card.classList.remove("is-preview-loading", "is-previewing");

  if (controller.type === "vimeo" && controller.player) {
    controller.player.pause().catch(() => {});
    controller.player.destroy().catch(() => {});
  }

  if (controller.type === "youtube" && controller.player) {
    try {
      controller.player.stopVideo();
      controller.player.destroy();
    } catch (error) {
      // The player may already be gone if the iframe failed to initialize.
    }
  }

  controller.layer.innerHTML = "";
}

function stopActivePreview() {
  if (!activePreview) return;
  const controller = activePreview;
  activePreview = null;
  clearPreviewController(controller);
}

function previewFailed(controller) {
  if (activePreview !== controller) return;
  activePreview = null;
  clearPreviewController(controller);
}

async function startVimeoPreview(controller, project) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://player.vimeo.com/video/${project.media.id}?background=1&autoplay=1&muted=1&controls=0&title=0&byline=0&portrait=0&playsinline=1&loop=0&dnt=1`;
  iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
  iframe.title = `${project.title} hover preview`;
  iframe.tabIndex = -1;
  iframe.setAttribute("aria-hidden", "true");
  controller.layer.appendChild(iframe);

  // Do not leave the thumbnail sitting on top while the player API is loading.
  iframe.addEventListener("load", () => showPreview(controller), { once: true });
  controller.fallbackTimer = window.setTimeout(() => showPreview(controller), 1200);

  const Vimeo = await loadVimeoApi();
  if (activePreview !== controller) return;

  const player = new Vimeo.Player(iframe);
  controller.type = "vimeo";
  controller.player = player;
  controller.segmentStart = 0;
  controller.isSeeking = false;

  await player.ready();
  if (activePreview !== controller) {
    player.destroy().catch(() => {});
    return;
  }

  await player.setVolume(0).catch(() => {});
  const duration = await player.getDuration().catch(() => 0);

  const seekToSegment = async (target) => {
    if (activePreview !== controller || controller.isSeeking) return;
    controller.isSeeking = true;
    controller.segmentStart = target;
    await player.setCurrentTime(target).catch(() => {});
    await player.play().catch(() => {});
    controller.isSeeking = false;
  };

  const onPlaying = () => showPreview(controller);
  const onTimeUpdate = (data) => {
    if (activePreview !== controller || controller.isSeeking) return;
    const segmentEnd = controller.segmentStart + HOVER_SEGMENT_SECONDS;
    if (data.seconds >= segmentEnd - 0.12) {
      const nextStart = getNextPreviewStart(controller.segmentStart, duration);
      seekToSegment(nextStart);
    }
  };
  const onEnded = () => seekToSegment(0);

  player.on("playing", onPlaying);
  player.on("timeupdate", onTimeUpdate);
  player.on("ended", onEnded);

  controller.cleanup = () => {
    player.off("playing", onPlaying);
    player.off("timeupdate", onTimeUpdate);
    player.off("ended", onEnded);
  };

  await player.setCurrentTime(0).catch(() => {});
  await player.play().catch(() => {});
}

async function startYouTubePreview(controller, project) {
  const YT = await loadYouTubeApi();
  if (activePreview !== controller) return;

  const host = document.createElement("div");
  controller.layer.appendChild(host);

  await new Promise((resolve, reject) => {
    const player = new YT.Player(host, {
      videoId: project.media.id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: (event) => {
          controller.type = "youtube";
          controller.player = event.target;
          controller.segmentStart = 0;
          controller.isSeeking = false;

          if (activePreview !== controller) {
            event.target.destroy();
            resolve();
            return;
          }

          event.target.mute();
          event.target.seekTo(0, true);
          event.target.playVideo();
          showPreview(controller);

          controller.timer = window.setInterval(() => {
            if (activePreview !== controller || controller.isSeeking) return;

            const duration = event.target.getDuration() || 0;
            const currentTime = event.target.getCurrentTime() || 0;
            const segmentEnd = controller.segmentStart + HOVER_SEGMENT_SECONDS;

            if (currentTime >= segmentEnd - 0.12) {
              controller.isSeeking = true;
              const nextStart = getNextPreviewStart(controller.segmentStart, duration);
              controller.segmentStart = nextStart;
              event.target.seekTo(nextStart, true);
              event.target.playVideo();
              window.setTimeout(() => {
                controller.isSeeking = false;
              }, 180);
            }
          }, 200);

          resolve();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) showPreview(controller);
          if (event.data === YT.PlayerState.ENDED && activePreview === controller) {
            controller.segmentStart = 0;
            event.target.seekTo(0, true);
            event.target.playVideo();
          }
        },
        onError: () => reject(new Error("YouTube hover preview failed."))
      }
    });

    controller.type = "youtube";
    controller.player = player;
  });
}

function startHoverPreview(card, layer, project) {
  if (!hoverPreviewAllowed) return;
  if (!project.media || !["vimeo", "youtube"].includes(project.media.type)) return;

  stopActivePreview();

  const controller = {
    card,
    layer,
    player: null,
    type: null,
    timer: null,
    fallbackTimer: null,
    cleanup: null,
    segmentStart: 0,
    isSeeking: false
  };

  activePreview = controller;
  card.classList.add("is-preview-loading");

  const start = project.media.type === "vimeo"
    ? startVimeoPreview(controller, project)
    : startYouTubePreview(controller, project);

  start.catch(() => previewFailed(controller));
}

function twoDigits(number) {
  return String(number + 1).padStart(2, "0");
}

function setImageWithFallbacks(image, sources, onFail) {
  const usable = sources.filter(Boolean);
  let sourceIndex = 0;

  const tryNext = () => {
    sourceIndex += 1;
    if (sourceIndex < usable.length) {
      image.src = usable[sourceIndex];
      return;
    }
    if (onFail) onFail();
  };

  image.addEventListener("error", tryNext);
  if (usable.length) image.src = usable[0];
}

function createProjectCard(project, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "project-card";
  card.dataset.category = project.category;
  card.setAttribute("aria-label", `Open ${project.title}`);

  const image = document.createElement("img");
  image.alt = `${project.title} project artwork`;
  image.loading = index < 4 ? "eager" : "lazy";
  if (project.thumbnailPosition) {
    image.style.objectPosition = project.thumbnailPosition;
  }
  setImageWithFallbacks(
    image,
    [project.thumbnail, ...(project.thumbnailFallbacks || [])],
    () => {
      image.hidden = true;
      card.classList.add("project-card--no-image");
    }
  );

  const previewLayer = document.createElement("span");
  previewLayer.className = "project-card__preview";
  previewLayer.setAttribute("aria-hidden", "true");

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
  meta.textContent = [project.type, project.year, project.status].filter(Boolean).join(" / ");

  overlay.append(number, title, meta);
  card.append(image, previewLayer, overlay);

  card.addEventListener("mouseenter", () => startHoverPreview(card, previewLayer, project));
  card.addEventListener("mouseleave", () => {
    if (activePreview && activePreview.card === card) stopActivePreview();
  });
  card.addEventListener("click", () => {
    stopActivePreview();
    openProject(project, index);
  });

  return card;
}

function projectMatchesActiveFilter(project) {
  const activeFilter = activeFilters[activeFilterMode];
  if (activeFilter === "all") return true;

  if (activeFilterMode === "type") {
    return project.category === activeFilter;
  }

  return (project.roles || []).includes(activeFilter);
}

function renderProjects() {
  stopActivePreview();
  projectGrid.innerHTML = "";

  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => projectMatchesActiveFilter(project));

  visible.forEach(({ project, index }) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  emptyState.textContent = "No projects in this selection yet.";
  emptyState.hidden = visible.length > 0;
}

function setFilterMode(mode) {
  if (!["type", "role"].includes(mode)) return;
  activeFilterMode = mode;

  filterModeButtons.forEach((button) => {
    const isActive = button.dataset.filterMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  filterGroups.forEach((group) => {
    const isActive = group.dataset.filterGroup === mode;
    group.hidden = !isActive;
    group.classList.toggle("is-active", isActive);
  });

  filters.forEach((button) => {
    const group = button.closest(".filter-list");
    const isCurrentGroup = group?.dataset.filterGroup === mode;
    button.classList.toggle(
      "is-active",
      isCurrentGroup && button.dataset.filter === activeFilters[mode]
    );
  });

  renderProjects();
}

function renderMedia(project) {
  dialogMedia.innerHTML = "";
  dialogMedia.classList.remove("dialog-media--stills");

  if (!project.media) return;

  if (project.media.type === "stills") {
    const stills = (project.stills || []).slice(0, 4);
    const montage = document.createElement("div");
    montage.className = "dialog-stills-feature";

    stills.forEach((still, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `dialog-stills-feature__item dialog-stills-feature__item--${index + 1}`;
      button.setAttribute("aria-label", `Open ${project.title} still ${index + 1}`);

      const image = document.createElement("img");
      image.src = getStillSource(still);
      image.alt = getStillAlt(still, project.title, index);

      button.appendChild(image);
      button.addEventListener("click", () => openStillsLightbox(project, index));
      montage.appendChild(button);
    });

    dialogMedia.classList.add("dialog-media--stills");
    dialogMedia.appendChild(montage);
    return;
  }

  if (project.media.type === "image") {
    const image = document.createElement("img");
    image.alt = project.media.alt || project.title;
    setImageWithFallbacks(image, [project.media.src, ...(project.media.srcFallbacks || [])]);
    dialogMedia.appendChild(image);
    return;
  }

  if (project.media.type === "vimeo") {
    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${project.media.id}?title=0&byline=0&portrait=0&color=000000`;
    iframe.title = project.title;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    dialogMedia.appendChild(iframe);
    return;
  }

  if (project.media.type === "youtube") {
    const iframe = document.createElement("iframe");
    const playlistParam = project.media.playlist ? `&list=${encodeURIComponent(project.media.playlist)}` : "";
    const startParam = Number.isFinite(project.media.start) ? `&start=${Math.max(0, Math.floor(project.media.start))}` : "";
    iframe.src = `https://www.youtube.com/embed/${project.media.id}?rel=0${playlistParam}${startParam}`;
    iframe.title = project.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
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
    image.alt = project.media.alt || project.title;
    setImageWithFallbacks(image, [project.media.src, ...(project.media.srcFallbacks || [])]);

    const label = document.createElement("span");
    label.textContent = project.media.label || "WATCH ↗";

    link.append(image, label);
    dialogMedia.appendChild(link);
  }
}

function renderCredits(project) {
  dialogCredits.innerHTML = "";
  (project.credits || []).forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dialogCredits.append(dt, dd);
  });
}

function getStillSource(still) {
  return typeof still === "string" ? still : still.src;
}

function getStillAlt(still, projectTitle, index) {
  return typeof still === "string"
    ? `${projectTitle} still ${index + 1}`
    : (still.alt || `${projectTitle} still ${index + 1}`);
}

function updateStillsLightbox() {
  if (!lightboxStills.length) return;
  const still = lightboxStills[lightboxIndex];
  stillsLightboxImage.src = getStillSource(still);
  stillsLightboxImage.alt = getStillAlt(still, lightboxProjectTitle, lightboxIndex);
  stillsLightboxCounter.textContent = `${lightboxProjectTitle}  ${lightboxIndex + 1} / ${lightboxStills.length}`;
  const hasMultiple = lightboxStills.length > 1;
  stillsLightboxPrev.hidden = !hasMultiple;
  stillsLightboxNext.hidden = !hasMultiple;
}

function openStillsLightbox(project, index) {
  lightboxStills = project.stills || [];
  if (!lightboxStills.length) return;
  lightboxIndex = index;
  lightboxProjectTitle = project.title;
  updateStillsLightbox();
  if (!stillsLightbox.open) stillsLightbox.showModal();
}

function closeStillsLightbox() {
  if (stillsLightbox.open) stillsLightbox.close();
  stillsLightboxImage.removeAttribute("src");
}

function stepStillsLightbox(direction) {
  if (!lightboxStills.length) return;
  lightboxIndex = (lightboxIndex + direction + lightboxStills.length) % lightboxStills.length;
  updateStillsLightbox();
}

function renderStills(project) {
  stillsGrid.innerHTML = "";
  const stills = project.stills || [];
  const stillsArePrimaryMedia = project.media?.type === "stills";
  stillsSection.hidden = stills.length === 0 || stillsArePrimaryMedia;
  stillsCount.textContent = stills.length ? `${stills.length} FRAME${stills.length === 1 ? "" : "S"}` : "";

  stills.forEach((still, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "still-item";
    button.setAttribute("aria-label", `Open ${project.title} still ${index + 1}`);

    const image = document.createElement("img");
    image.src = getStillSource(still);
    image.alt = getStillAlt(still, project.title, index);
    image.loading = "lazy";

    button.appendChild(image);
    button.addEventListener("click", () => openStillsLightbox(project, index));
    stillsGrid.appendChild(button);
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

function openProject(project, index, options = {}) {
  const { pushHistory = true } = options;

  dialogIndex.textContent = twoDigits(index);
  dialogTitle.textContent = project.title;
  dialogType.textContent = project.type || "";
  dialogYear.textContent = project.year || "";
  dialogMedium.textContent = project.medium || "";
  dialogRole.textContent = project.roleText || "";
  dialogDescription.textContent = project.description || "";

  const hasStatus = Boolean(project.status);
  dialogStatusRow.hidden = !hasStatus;
  dialogStatus.textContent = project.status || "";

  renderMedia(project);
  renderStills(project);
  renderCredits(project);
  renderFestivals(project);

  if (!projectDialog.open) projectDialog.showModal();
  document.body.classList.add("is-locked");

  if (pushHistory) {
    window.history.pushState(
      { portfolioView: "project", projectIndex: index },
      "",
      `#project-${twoDigits(index)}`
    );
  }
}

function closeProject() {
  if (stillsLightbox.open) closeStillsLightbox();
  if (projectDialog.open) projectDialog.close();
  dialogMedia.innerHTML = "";
  document.body.classList.remove("is-locked");
}

function requestCloseProject() {
  if (window.history.state?.portfolioView === "project") {
    window.history.back();
  } else {
    closeProject();
  }
}

filterModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setFilterMode(button.dataset.filterMode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".filter-list");
    const mode = group?.dataset.filterGroup;
    if (!mode) return;

    activeFilterMode = mode;
    activeFilters[mode] = button.dataset.filter;

    filters.forEach((filter) => {
      const filterGroup = filter.closest(".filter-list");
      const isSameMode = filterGroup?.dataset.filterGroup === mode;
      filter.classList.toggle(
        "is-active",
        isSameMode && filter.dataset.filter === activeFilters[mode]
      );
    });

    renderProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});


dialogClose.addEventListener("click", requestCloseProject);
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) requestCloseProject();
});

stillsLightboxClose.addEventListener("click", closeStillsLightbox);
stillsLightboxPrev.addEventListener("click", () => stepStillsLightbox(-1));
stillsLightboxNext.addEventListener("click", () => stepStillsLightbox(1));

stillsLightbox.addEventListener("click", (event) => {
  if (event.target === stillsLightbox || event.target.classList.contains("stills-lightbox__stage")) {
    closeStillsLightbox();
  }
});

stillsLightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeStillsLightbox();
});

function openContact(options = {}) {
  const { pushHistory = true } = options;

  if (projectDialog.open) closeProject();

  contactDialog.scrollTop = 0;
  if (!contactDialog.open) contactDialog.showModal();

  // Open the contact view from its own top edge even if the homepage was scrolled.
  contactDialog.scrollTop = 0;
  requestAnimationFrame(() => {
    contactDialog.scrollTop = 0;
  });

  document.body.classList.add("is-locked");

  if (pushHistory) {
    window.history.pushState(
      { portfolioView: "contact" },
      "",
      "#contact"
    );
  }
}

function closeContact() {
  if (contactDialog.open) contactDialog.close();
  document.body.classList.remove("is-locked");
}

function requestCloseContact() {
  if (window.history.state?.portfolioView === "contact") {
    window.history.back();
  } else {
    closeContact();
  }
}

contactTrigger.addEventListener("click", () => openContact());
contactClose.addEventListener("click", requestCloseContact);

contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) requestCloseContact();
});

contactDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  requestCloseContact();
});

if (contactHeadshot) {
  const markHeadshotMissing = () => contactPortrait?.classList.add("is-missing");
  if (contactHeadshot.complete && contactHeadshot.naturalWidth === 0) markHeadshotMissing();
  contactHeadshot.addEventListener("error", markHeadshotMissing);
  contactHeadshot.addEventListener("load", () => contactPortrait?.classList.remove("is-missing"));
}

projectDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  requestCloseProject();
});

window.addEventListener("popstate", (event) => {
  const state = event.state;

  if (state?.portfolioView === "project" && Number.isInteger(state.projectIndex)) {
    if (contactDialog.open) closeContact();
    const project = projects[state.projectIndex];
    if (project) openProject(project, state.projectIndex, { pushHistory: false });
    return;
  }

  if (state?.portfolioView === "contact") {
    if (projectDialog.open) closeProject();
    openContact({ pushHistory: false });
    return;
  }

  if (projectDialog.open) closeProject();
  if (contactDialog.open) closeContact();
});

window.addEventListener("keydown", (event) => {
  if (stillsLightbox.open) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepStillsLightbox(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepStillsLightbox(1);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeStillsLightbox();
      return;
    }
  }

  if (event.key !== "Escape") return;
  if (contactDialog.open) requestCloseContact();
});

if (!window.history.state?.portfolioView) {
  window.history.replaceState({ portfolioView: "home" }, "", window.location.pathname + window.location.search);
}

if (hoverPreviewAllowed) {
  loadVimeoApi().catch(() => {});
  loadYouTubeApi().catch(() => {});
}

yearNode.textContent = new Date().getFullYear();
renderProjects();
