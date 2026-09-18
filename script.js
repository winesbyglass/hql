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

const contactTrigger = document.querySelector("#contact-trigger");
const contactDialog = document.querySelector("#contact-dialog");
const contactClose = document.querySelector("#contact-close");


let activeFilter = "all";
let activePreview = null;
let vimeoApiPromise = null;
let youtubeApiPromise = null;

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

function renderProjects() {
  stopActivePreview();
  projectGrid.innerHTML = "";
  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => activeFilter === "all" || project.category === activeFilter);

  visible.forEach(({ project, index }) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  emptyState.textContent = "No projects in this category yet.";
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

  if (project.media.type === "youtube") {
    const iframe = document.createElement("iframe");
    const playlistParam = project.media.playlist ? `&list=${encodeURIComponent(project.media.playlist)}` : "";
    iframe.src = `https://www.youtube.com/embed/${project.media.id}?rel=0${playlistParam}`;
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

function renderStills(project) {
  stillsGrid.innerHTML = "";
  const stills = project.stills || [];
  stillsSection.hidden = stills.length === 0;
  stillsCount.textContent = stills.length ? `${stills.length} FRAME${stills.length === 1 ? "" : "S"}` : "";

  stills.forEach((still, index) => {
    const figure = document.createElement("figure");
    figure.className = "still-item";

    const image = document.createElement("img");
    image.src = typeof still === "string" ? still : still.src;
    image.alt = typeof still === "string"
      ? `${project.title} still ${index + 1}`
      : (still.alt || `${project.title} still ${index + 1}`);
    image.loading = "lazy";

    figure.appendChild(image);
    stillsGrid.appendChild(figure);
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

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((filter) => filter.classList.toggle("is-active", filter === button));
    renderProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});


dialogClose.addEventListener("click", requestCloseProject);
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) requestCloseProject();
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

projectDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  requestCloseProject();
});

window.addEventListener("popstate", (event) => {
  const state = event.state;

  if (state?.portfolioView === "project" && Number.isInteger(state.projectIndex)) {
    const project = projects[state.projectIndex];
    if (project) openProject(project, state.projectIndex, { pushHistory: false });
    return;
  }

  if (projectDialog.open) closeProject();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (contactDialog.open) {
    contactDialog.close();
    document.body.classList.remove("is-locked");
  }
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
