const projectGrid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const gallerySectionTitle = document.querySelector("#gallery-section-title");
const brandHomeLink = document.querySelector(".brand");
const filters = [...document.querySelectorAll(".filter")];
const yearNode = document.querySelector("#year");


const projectDialog = document.querySelector("#project-dialog");
const dialogClose = document.querySelector("#dialog-close");
const dialogCloseMobile = document.querySelector("#dialog-close-mobile");
const dialogIndex = document.querySelector("#dialog-index");
const dialogTitle = document.querySelector("#dialog-title");
const dialogType = document.querySelector("#dialog-type");
const dialogYear = document.querySelector("#dialog-year");
const dialogMedium = document.querySelector("#dialog-medium");
const dialogRole = document.querySelector("#dialog-role");
const dialogDescription = document.querySelector("#dialog-description");
const dialogMedia = document.querySelector("#dialog-media");
const dialogCredits = document.querySelector("#dialog-credits");
const dialogCreditsTitle = document.querySelector("#dialog-credits-title");
const extendedCredits = document.querySelector("#extended-credits");
const extendedCreditsSections = document.querySelector("#extended-credits-sections");
const partnerSection = document.querySelector("#partner-section");
const partnerMarks = document.querySelector("#partner-marks");
const railBts = document.querySelector("#rail-bts");
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
const mobileMenuToggle = document.querySelector("#mobile-menu-toggle");
const portfolioNavPanel = document.querySelector("#portfolio-nav-panel");


let activeFilter = "all";
let activePreview = null;
let vimeoApiPromise = null;
let youtubeApiPromise = null;
let lightboxStills = [];
let lightboxIndex = 0;
let lightboxProjectTitle = "";
const photoSeriesCache = new Map();

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

const projectIntentWarmCache = new Set();

function warmProjectOnIntent(project) {
  if (!project || projectIntentWarmCache.has(project.title)) return;
  projectIntentWarmCache.add(project.title);

  const thumbnail = normalizePhotoSource(project.thumbnail || "");
  const firstStill = getStillSource((project.stills || [])[0] || "");
  const normalizedStill = normalizePhotoSource(firstStill);

  if (firstStill && normalizedStill && normalizedStill !== thumbnail) {
    preloadPhotoSource(firstStill, "auto");
  }
}

function createProjectCard(project, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "project-card";
  card.dataset.category = project.category;
  card.setAttribute("aria-label", `Open ${project.title}`);

  const image = document.createElement("img");
  image.alt = `${project.title} project artwork`;
  image.decoding = "async";

  const eagerCount = window.matchMedia("(max-width: 620px)").matches ? 1 : 4;
  image.loading = index < eagerCount ? "eager" : "lazy";

  if ("fetchPriority" in image) {
    image.fetchPriority = index === 0 ? "high" : "auto";
  }

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

  [project.type, project.year]
    .filter(Boolean)
    .forEach((value, metaIndex, values) => {
      const item = document.createElement("span");
      item.className = "project-card__meta-item";
      item.textContent = value;
      meta.appendChild(item);

      if (metaIndex < values.length - 1) {
        const separator = document.createElement("span");
        separator.className = "project-card__meta-separator";
        separator.textContent = "·";
        separator.setAttribute("aria-hidden", "true");
        meta.appendChild(separator);
      }
    });

  overlay.append(number, title, meta);
  card.append(image, previewLayer, overlay);

  card.addEventListener("mouseenter", () => {
    warmProjectOnIntent(project);
    startHoverPreview(card, previewLayer, project);
  });
  card.addEventListener("focus", () => warmProjectOnIntent(project));
  card.addEventListener("touchstart", () => warmProjectOnIntent(project), { once: true, passive: true });
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
  if (activeFilter === "all") return true;
  return project.category === activeFilter;
}

function updateGallerySectionTitle() {
  if (!gallerySectionTitle) return;

  const activeButton = filters.find((button) => button.dataset.filter === activeFilter);
  const label = activeFilter === "all"
    ? "WORK"
    : (activeButton?.textContent || activeFilter).trim().toUpperCase();

  gallerySectionTitle.textContent = label;
}

function renderProjects() {
  stopActivePreview();
  updateGallerySectionTitle();
  projectGrid.innerHTML = "";

  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => projectMatchesActiveFilter(project));

  visible.forEach(({ project, index }) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  emptyState.textContent = "No projects in this selection yet.";
  emptyState.hidden = visible.length > 0;

  if (mobileMenuMedia.matches) {
    window.requestAnimationFrame(syncMobileProjectFocus);
  }
}

function padFrameNumber(value) {
  return String(value).padStart(2, "0");
}

function probeImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

const photoSeriesSourcePromises = new Map();
const photoDecodeCache = new Map();
const photoSeriesSources = new Map();

function normalizePhotoSource(source) {
  return source ? new URL(source, window.location.href).href : "";
}

function photoSourcePath(source) {
  const normalized = normalizePhotoSource(source);
  if (!normalized) return "";
  const url = new URL(normalized);
  return `${url.pathname}${url.search}`;
}

function preloadPhotoSource(source, priority = "auto") {
  const normalized = normalizePhotoSource(source);
  if (!normalized) return Promise.resolve(false);

  if (photoDecodeCache.has(normalized)) {
    return photoDecodeCache.get(normalized);
  }

  const promise = new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";

    if ("fetchPriority" in image) {
      image.fetchPriority = priority;
    }

    const finish = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => {}).finally(() => resolve(true));
      } else {
        resolve(true);
      }
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", () => resolve(false), { once: true });
    image.src = normalized;

    if (image.complete && image.naturalWidth > 0) {
      finish();
    }
  });

  photoDecodeCache.set(normalized, promise);
  return promise;
}

function getPhotoSeriesImmediateSources(project) {
  const explicit = (project.stills || [])
    .map(getStillSource)
    .filter(Boolean);

  const firstSource = project.media?.src || project.thumbnail;

  return [...new Set([
    ...explicit,
    firstSource
  ].filter(Boolean))];
}

async function photoSourceExists(source) {
  try {
    const response = await fetch(source, {
      method: "HEAD",
      cache: "force-cache"
    });
    return response.ok;
  } catch {
    return false;
  }
}

/*
  Extra photo-series files are discovered only after the visitor chooses VIEW ALL.
  The homepage and normal project opening never run these probes.
*/
function discoverPhotoSeriesSources(project) {
  if (photoSeriesSourcePromises.has(project.title)) {
    return photoSeriesSourcePromises.get(project.title);
  }

  const immediate = getPhotoSeriesImmediateSources(project);
  photoSeriesSources.set(project.title, immediate);

  const promise = (async () => {
    const prefix = project.media?.prefix;
    const probeCount = Number(project.media?.probeCount || immediate.length);

    if (!prefix || probeCount <= immediate.length) {
      return immediate;
    }

    const firstUnknownIndex = Math.max(6, immediate.length + 1);
    const candidates = Array.from(
      { length: Math.max(0, probeCount - firstUnknownIndex + 1) },
      (_, offset) => `${prefix}${padFrameNumber(firstUnknownIndex + offset)}.jpg`
    );

    const found = [];
    const batchSize = 5;

    for (let start = 0; start < candidates.length; start += batchSize) {
      const batch = candidates.slice(start, start + batchSize);
      const checked = await Promise.all(
        batch.map(async (source) => (await photoSourceExists(source)) ? source : null)
      );
      found.push(...checked.filter(Boolean));
    }

    const sources = [...new Set([...immediate, ...found])];
    photoSeriesSources.set(project.title, sources);
    return sources;
  })();

  photoSeriesSourcePromises.set(project.title, promise);
  return promise;
}


function openPhotoSeriesLightbox(project, sources, index) {
  lightboxStills = sources;
  if (!lightboxStills.length) return;

  lightboxIndex = index;
  lightboxProjectTitle = project.title;

  preloadPhotoSource(lightboxStills[lightboxIndex], "high").then(() => {
    updateStillsLightbox();

    if (!stillsLightbox.open) {
      stillsLightbox.showModal();
    }
  });
}

function renderEditorialPhotoSeries(project) {
  const shell = document.createElement("section");
  shell.className = "photo-viewer";
  shell.dataset.project = project.title;

  const topLine = document.createElement("div");
  topLine.className = "photo-viewer__topline";

  const label = document.createElement("span");
  label.className = "photo-viewer__label";
  label.textContent = "IMAGE SERIES";

  const instruction = document.createElement("span");
  instruction.className = "photo-viewer__instruction";
  instruction.textContent = "CLICK IMAGE TO OPEN";

  topLine.append(label, instruction);

  const viewer = document.createElement("div");
  viewer.className = "photo-viewer__viewer";

  const previous = document.createElement("button");
  previous.className = "photo-viewer__nav photo-viewer__nav--prev";
  previous.type = "button";
  previous.innerHTML = "<span>←</span><em>PREV</em>";
  previous.setAttribute("aria-label", `Previous photograph in ${project.title}`);

  const imageButton = document.createElement("button");
  imageButton.className = "photo-viewer__image-button";
  imageButton.type = "button";
  imageButton.setAttribute("aria-label", `Open current photograph from ${project.title} fullscreen`);

  const image = document.createElement("img");
  image.className = "photo-viewer__image";
  image.alt = project.title;
  image.decoding = "async";
  image.fetchPriority = "high";

  image.addEventListener("load", () => {
    const ratio = image.naturalWidth / image.naturalHeight;
    shell.classList.remove("is-portrait", "is-landscape", "is-square");

    if (ratio < 0.88) {
      shell.classList.add("is-portrait");
    } else if (ratio > 1.14) {
      shell.classList.add("is-landscape");
    } else {
      shell.classList.add("is-square");
    }
  });

  imageButton.appendChild(image);

  const next = document.createElement("button");
  next.className = "photo-viewer__nav photo-viewer__nav--next";
  next.type = "button";
  next.innerHTML = "<em>NEXT</em><span>→</span>";
  next.setAttribute("aria-label", `Next photograph in ${project.title}`);

  viewer.append(previous, imageButton, next);

  const footer = document.createElement("div");
  footer.className = "photo-viewer__footer";

  const counter = document.createElement("span");
  counter.className = "photo-viewer__counter";
  counter.textContent = "01 / 01";

  const index = document.createElement("div");
  index.className = "photo-viewer__index";
  index.setAttribute("aria-label", `${project.title} image index`);

  const fullscreen = document.createElement("button");
  fullscreen.className = "photo-viewer__fullscreen";
  fullscreen.type = "button";
  fullscreen.textContent = "VIEW FULLSCREEN";

  footer.append(counter, index, fullscreen);

  const previewWrap = document.createElement("div");
  previewWrap.className = "photo-viewer__preview-wrap";

  const previewHeader = document.createElement("div");
  previewHeader.className = "photo-viewer__preview-header";

  const previewLabel = document.createElement("span");
  previewLabel.textContent = "COLLECTION PREVIEW";

  const viewAll = document.createElement("button");
  viewAll.type = "button";
  viewAll.className = "photo-viewer__view-all";
  viewAll.textContent = "VIEW ALL";

  previewHeader.append(previewLabel, viewAll);

  const preview = document.createElement("div");
  preview.className = "photo-viewer__preview";

  const collection = document.createElement("div");
  collection.className = "photo-viewer__collection";
  collection.hidden = true;

  previewWrap.append(previewHeader, preview, collection);
  shell.append(topLine, viewer, footer, previewWrap);
  dialogMedia.appendChild(shell);

  let sources = getPhotoSeriesImmediateSources(project);
  let activeIndex = 0;
  let requestedIndex = 0;
  let requestToken = 0;
  let collectionOpen = false;
  let collectionDiscovered = !project.media?.prefix;

  const sourceAt = (itemIndex) => {
    if (!sources.length) return "";
    const normalizedIndex = (itemIndex + sources.length) % sources.length;
    return sources[normalizedIndex];
  };

  const renderIndex = () => {
    index.innerHTML = "";

    sources.forEach((source, itemIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "photo-viewer__index-button";
      button.textContent = padFrameNumber(itemIndex + 1);
      button.classList.toggle("is-active", itemIndex === activeIndex);
      button.setAttribute("aria-label", `Show photograph ${itemIndex + 1}`);

      button.addEventListener("click", () => {
        showIndex(itemIndex);
      });

      index.appendChild(button);
    });
  };

  const createPreviewImage = (source, itemIndex, className) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", `Show photograph ${itemIndex + 1}`);

    const previewImage = document.createElement("img");
    previewImage.alt = `${project.title} preview ${itemIndex + 1}`;
    previewImage.decoding = "async";

    button.appendChild(previewImage);

    button.addEventListener("click", () => {
      openPhotoSeriesLightbox(project, sources, itemIndex);
    });

    previewImage.loading = itemIndex === 0 ? "eager" : "lazy";
    previewImage.decoding = "async";

    if ("fetchPriority" in previewImage) {
      previewImage.fetchPriority = "auto";
    }

    previewImage.src = source;

    return button;
  };

  const renderPreview = () => {
    preview.innerHTML = "";

    sources.slice(0, 5).forEach((source, itemIndex) => {
      preview.appendChild(
        createPreviewImage(source, itemIndex, "photo-viewer__preview-item")
      );
    });

    previewWrap.hidden = sources.length <= 1;
    viewAll.textContent = collectionOpen
      ? "CLOSE ALL"
      : collectionDiscovered
        ? `VIEW ALL ${padFrameNumber(sources.length)}`
        : "VIEW ALL";
  };

  const renderCollection = () => {
    collection.innerHTML = "";

    if (!collectionOpen) {
      collection.hidden = true;
      return;
    }

    collection.hidden = false;

    sources.forEach((source, itemIndex) => {
      const figure = document.createElement("figure");
      figure.className = "photo-viewer__collection-figure";

      const button = createPreviewImage(
        source,
        itemIndex,
        "photo-viewer__collection-item"
      );

      const caption = document.createElement("figcaption");
      caption.textContent = padFrameNumber(itemIndex + 1);

      figure.append(button, caption);
      collection.appendChild(figure);
    });
  };

  const updateUi = () => {
    counter.textContent = `${padFrameNumber(activeIndex + 1)} / ${padFrameNumber(sources.length)}`;

    [...index.children].forEach((button, itemIndex) => {
      button.classList.toggle("is-active", itemIndex === activeIndex);
    });

    previous.disabled = sources.length <= 1;
    next.disabled = sources.length <= 1;
    imageButton.disabled = sources.length <= 1;
    fullscreen.disabled = !sources.length;
  };

  const warmAround = (centerIndex) => {
    if (sources.length <= 1) return;

    [-1, 1].forEach((offset) => {
      const source = sourceAt(centerIndex + offset);
      if (source) preloadPhotoSource(source, "auto");
    });
  };

  const showIndex = async (itemIndex, { instant = false } = {}) => {
    if (!sources.length) return;

    requestedIndex = (itemIndex + sources.length) % sources.length;
    const targetIndex = requestedIndex;
    const targetSource = sources[targetIndex];
    const token = ++requestToken;

    const ready = await preloadPhotoSource(targetSource, "high");
    if (!ready || token !== requestToken || !shell.isConnected) return;

    activeIndex = targetIndex;

    if (!instant) image.classList.add("is-changing");

    const normalizedTarget = normalizePhotoSource(targetSource);
    if (image.src !== normalizedTarget) {
      image.src = targetSource;
    }

    image.alt = `${project.title} photograph ${activeIndex + 1}`;

    if (typeof image.decode === "function") {
      await image.decode().catch(() => {});
    }

    if (token !== requestToken || !shell.isConnected) return;

    image.classList.remove("is-changing");
    updateUi();
    warmAround(activeIndex);
  };

  const step = (direction) => {
    if (sources.length <= 1) return;
    const baseIndex = requestedIndex;
    showIndex(baseIndex + direction);
  };

  previous.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  imageButton.addEventListener("click", () => {
    openPhotoSeriesLightbox(project, sources, activeIndex);
  });

  fullscreen.addEventListener("click", async () => {
    const currentSource = sources[activeIndex];
    await preloadPhotoSource(currentSource, "high");
    openPhotoSeriesLightbox(project, sources, activeIndex);
  });

  viewAll.addEventListener("click", async () => {
    if (collectionOpen) {
      collectionOpen = false;
      renderPreview();
      renderCollection();
      return;
    }

    collectionOpen = true;

    if (!collectionDiscovered) {
      viewAll.disabled = true;
      viewAll.textContent = "LOADING COLLECTION…";

      const currentSource = sources[activeIndex];
      const available = await discoverPhotoSeriesSources(project);

      if (!shell.isConnected) return;

      sources = [...new Set(available)];
      const retainedIndex = sources.indexOf(currentSource);
      activeIndex = retainedIndex >= 0 ? retainedIndex : 0;
      requestedIndex = activeIndex;
      collectionDiscovered = true;

      renderIndex();
      updateUi();
    }

    renderPreview();
    renderCollection();
    viewAll.disabled = false;
  });

  if (sources.length) {
    image.src = sources[0];
    image.alt = `${project.title} photograph 1`;
  }

  renderIndex();
  renderPreview();
  updateUi();

  /*
    All series images are already listed explicitly in projects.js.
    Only the current image and its immediate neighbours are warmed.
  */
  warmAround(0);
}

function appendStackedText(target, value) {
  target.innerHTML = "";

  const parts = String(value || "")
    .split(/\s+\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return;

  parts.forEach((part) => {
    const line = document.createElement("span");
    line.className = "rail-value-line";
    line.textContent = part;
    target.appendChild(line);
  });
}

function renderRailBts(project) {
  railBts.innerHTML = "";

  const prefix = project.btsPrefix;
  if (!prefix) return;

  for (let index = 1; index <= 3; index += 1) {
    const frame = document.createElement("div");
    frame.className = `rail-bts__frame rail-bts__frame--${index}`;

    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    image.loading = "lazy";

    if ("fetchPriority" in image) {
      image.fetchPriority = "low";
    }

    image.addEventListener("error", () => {
      frame.remove();
    }, { once: true });

    image.addEventListener("load", () => {
      frame.classList.add("is-loaded");
    }, { once: true });

    frame.appendChild(image);
    railBts.appendChild(frame);

    const loadBts = () => {
      if (!frame.isConnected) return;
      image.src = `${prefix}${padFrameNumber(index)}.jpg`;
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadBts, { timeout: 1200 });
    } else {
      window.setTimeout(loadBts, 350);
    }
  }
}

function renderYouTubeSeries(project) {
  const episodes = project.media?.episodes || [];
  if (!episodes.length) return;

  const shell = document.createElement("section");
  shell.className = "video-series";

  const player = document.createElement("iframe");
  player.className = "video-series__player";
  player.title = `${project.title} — ${episodes[0].label || "Episode 01"}`;
  player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  player.allowFullscreen = true;

  const controls = document.createElement("div");
  controls.className = "video-series__controls";

  const label = document.createElement("span");
  label.className = "video-series__label";
  label.textContent = "EPISODES";

  const episodeNav = document.createElement("div");
  episodeNav.className = "video-series__episodes";

  const previewWrap = document.createElement("div");
  previewWrap.className = "video-series__preview-wrap";

  const previewHeading = document.createElement("div");
  previewHeading.className = "video-series__preview-heading";

  const previewLabel = document.createElement("span");
  previewLabel.textContent = "SERIES PREVIEW";

  const previewCount = document.createElement("span");
  previewCount.textContent = `${padFrameNumber(episodes.length)} EPISODES`;

  previewHeading.append(previewLabel, previewCount);

  const previewGrid = document.createElement("div");
  previewGrid.className = "video-series__preview-grid";

  const syncActiveEpisode = (index) => {
    [...episodeNav.children].forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    [...previewGrid.children].forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const selectEpisode = (episode, index, autoplay = false) => {
    player.src = `https://www.youtube.com/embed/${episode.id}?rel=0${autoplay ? "&autoplay=1" : ""}`;
    player.title = `${project.title} — ${episode.label || `Episode ${padFrameNumber(index + 1)}`}`;
    syncActiveEpisode(index);
  };

  episodes.forEach((episode, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "video-series__episode";
    button.textContent = episode.label || `EPISODE ${padFrameNumber(index + 1)}`;
    button.setAttribute("aria-pressed", String(index === 0));

    button.addEventListener("click", () => {
      selectEpisode(episode, index, true);
    });

    episodeNav.appendChild(button);

    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "video-series__preview-item";
    previewButton.setAttribute("aria-label", `Play ${episode.label || `Episode ${padFrameNumber(index + 1)}`}`);
    previewButton.setAttribute("aria-pressed", String(index === 0));

    const thumb = document.createElement("img");
    thumb.src = `https://i.ytimg.com/vi/${episode.id}/mqdefault.jpg`;
    thumb.alt = `${project.title} ${episode.label || `Episode ${padFrameNumber(index + 1)}`} preview`;
    thumb.loading = index === 0 ? "eager" : "lazy";
    thumb.decoding = "async";
    thumb.addEventListener("error", () => {
      thumb.src = `https://i.ytimg.com/vi/${episode.id}/hqdefault.jpg`;
    }, { once: true });

    const caption = document.createElement("span");
    caption.textContent = episode.label || `EPISODE ${padFrameNumber(index + 1)}`;

    previewButton.append(thumb, caption);
    previewButton.addEventListener("click", () => {
      selectEpisode(episode, index, true);
    });

    previewGrid.appendChild(previewButton);
  });

  controls.append(label, episodeNav);
  previewWrap.append(previewHeading, previewGrid);
  shell.append(player, controls, previewWrap);
  dialogMedia.appendChild(shell);

  selectEpisode(episodes[0], 0, false);
}

function renderMedia(project) {
  dialogMedia.innerHTML = "";
  dialogMedia.classList.remove("dialog-media--stills", "dialog-media--photo-series");

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
      image.alt = getStillAlt(still, project.title, index);
      image.decoding = "async";
      image.loading = index === 0 ? "eager" : "lazy";

      if ("fetchPriority" in image) {
        image.fetchPriority = index === 0 ? "high" : "auto";
      }

      image.src = getStillSource(still);

      button.appendChild(image);
      button.addEventListener("click", () => openStillsLightbox(project, index));
      montage.appendChild(button);
    });

    dialogMedia.classList.add("dialog-media--stills");
    dialogMedia.appendChild(montage);
    return;
  }

  if (project.media.type === "photo-series") {
    dialogMedia.classList.add("dialog-media--photo-series");
    renderEditorialPhotoSeries(project);
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

  if (project.media.type === "youtube-series") {
    renderYouTubeSeries(project);
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

function appendCreditRows(target, credits) {
  credits.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    appendStackedText(dt, label);

    const dd = document.createElement("dd");
    appendStackedText(dd, value);

    target.append(dt, dd);
  });
}

function renderCredits(project) {
  dialogCredits.innerHTML = "";

  const railCredits = project.railCredits || project.credits || [];
  appendCreditRows(dialogCredits, railCredits);

  dialogCreditsTitle.textContent = project.creditSections?.length
    ? "KEY CREDITS"
    : "CREDITS";
}

function renderExtendedCredits(project) {
  extendedCreditsSections.innerHTML = "";

  const sections = project.creditSections || [];
  extendedCredits.hidden = sections.length === 0;

  sections.forEach((section) => {
    if (!section?.credits?.length) return;

    const block = document.createElement("section");
    block.className = "extended-credits__section";

    const heading = document.createElement("h4");
    heading.textContent = section.title || "CREDITS";

    const list = document.createElement("dl");
    list.className = "extended-credits__grid";
    appendCreditRows(list, section.credits);

    block.append(heading, list);
    extendedCreditsSections.appendChild(block);
  });

  extendedCredits.hidden = extendedCreditsSections.children.length === 0;
}

function renderPartners(project) {
  partnerMarks.innerHTML = "";

  const partners = project.partners || [];
  partnerSection.hidden = partners.length === 0;

  partners.forEach((partner) => {
    const link = document.createElement("a");
    link.className = `partner-mark partner-mark--${partner.kind || "wordmark"}`;
    if (partner.slug) {
      link.dataset.partner = partner.slug;
    }
    link.href = partner.href || "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", partner.name || partner.mark || "Partner");

    if (partner.kind === "image" && partner.src) {
      const image = document.createElement("img");
      image.src = partner.src;
      image.alt = partner.name || "";
      image.loading = "lazy";

      if (partner.fallbackMark) {
        image.addEventListener("error", () => {
          link.classList.add("partner-mark--fallback");
          link.textContent = partner.fallbackMark;
        }, { once: true });
      }

      link.appendChild(image);
    } else {
      const wordmark = document.createElement("span");
      wordmark.className = "partner-mark__wordmark";
      wordmark.textContent = partner.mark || partner.name || "";

      link.appendChild(wordmark);

      if (partner.submark) {
        const submark = document.createElement("span");
        submark.className = "partner-mark__submark";
        submark.textContent = partner.submark;
        link.appendChild(submark);
      }
    }

    partnerMarks.appendChild(link);
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

let lightboxImageRequestToken = 0;

async function updateStillsLightbox() {
  if (!lightboxStills.length) return;

  const requestedIndex = lightboxIndex;
  const still = lightboxStills[requestedIndex];
  const source = getStillSource(still);
  const token = ++lightboxImageRequestToken;

  await preloadPhotoSource(source, "high");

  if (token !== lightboxImageRequestToken || requestedIndex !== lightboxIndex) return;

  stillsLightboxImage.src = source;
  stillsLightboxImage.alt = getStillAlt(still, lightboxProjectTitle, requestedIndex);
  stillsLightboxCounter.textContent = `${lightboxProjectTitle}  ${requestedIndex + 1} / ${lightboxStills.length}`;

  const hasMultiple = lightboxStills.length > 1;
  stillsLightboxPrev.hidden = !hasMultiple;
  stillsLightboxNext.hidden = !hasMultiple;

  if (hasMultiple) {
    const previousIndex = (requestedIndex - 1 + lightboxStills.length) % lightboxStills.length;
    const nextIndex = (requestedIndex + 1) % lightboxStills.length;
    preloadPhotoSource(getStillSource(lightboxStills[previousIndex]), "high");
    preloadPhotoSource(getStillSource(lightboxStills[nextIndex]), "high");
  }
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
  const stillsArePrimaryMedia = ["stills", "photo-series"].includes(project.media?.type);
  stillsSection.hidden = stills.length === 0 || stillsArePrimaryMedia;
  stillsCount.textContent = stills.length ? `${stills.length} FRAME${stills.length === 1 ? "" : "S"}` : "";

  stills.forEach((still, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "still-item";
    button.setAttribute("aria-label", `Open ${project.title} still ${index + 1}`);

    const image = document.createElement("img");
    image.alt = getStillAlt(still, project.title, index);
    image.loading = "lazy";
    image.decoding = "async";
    image.src = getStillSource(still);

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

  clearProjectBrandProgress();
  projectDialog.scrollTop = 0;

  dialogIndex.textContent = twoDigits(index);
  dialogTitle.textContent = project.title;
  dialogType.textContent = project.type || "";
  dialogYear.textContent = project.year || "";
  dialogMedium.textContent = project.medium || "";
  appendStackedText(dialogRole, project.roleText || "");
  dialogDescription.textContent = project.description || "";

  renderMedia(project);
  renderStills(project);
  renderCredits(project);
  renderExtendedCredits(project);
  renderPartners(project);
  renderRailBts(project);
  renderFestivals(project);

  if (!projectDialog.open) projectDialog.showModal();

  projectDialog.scrollTop = 0;
  window.requestAnimationFrame(() => {
    projectDialog.scrollTop = 0;
    syncMobileProjectBrandCollapse();
  });

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
  clearProjectBrandProgress();
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

    filters.forEach((filter) => {
      filter.classList.toggle("is-active", filter.dataset.filter === activeFilter);
    });

    renderProjects();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});


if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    setMobileMenu(!mobileMenuIsOpen());
  });
}

if (brandHomeLink) {
  brandHomeLink.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 620px)").matches) {
      event.preventDefault();
      openContact();
    }
  });
}

dialogClose.addEventListener("click", requestCloseProject);
dialogCloseMobile?.addEventListener("click", requestCloseProject);
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

const mobileMenuMedia = window.matchMedia("(max-width: 620px)");

let mobileUiTicking = false;

function mobileMenuIsOpen() {
  return document.body.classList.contains("is-mobile-menu-open");
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep01(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function setMainBrandProgress(progress) {
  const eased = smoothstep01(progress);
  const headerHeight = 126 - (74 * eased);
  const brandHeight = 108 - (76 * eased);

  document.body.style.setProperty("--main-header-height", `${headerHeight.toFixed(2)}px`);
  document.body.style.setProperty("--main-brand-height", `${brandHeight.toFixed(2)}px`);
}

function clearMainBrandProgress() {
  document.body.style.removeProperty("--main-header-height");
  document.body.style.removeProperty("--main-brand-height");
}

function syncMobileBrandCollapse() {
  if (!mobileMenuMedia.matches) {
    clearMainBrandProgress();
    return;
  }

  // Keep the complete name visible while the menu is open.
  if (mobileMenuIsOpen()) {
    setMainBrandProgress(0);
    return;
  }

  const y = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);

  /*
    Continuous scroll mapping instead of a binary class toggle.
    The header starts responding almost immediately and reaches its
    compact state over the first ~96 px of scrolling.
  */
  const progress = clamp01((y - 4) / 92);
  setMainBrandProgress(progress);
}

function syncMobileProjectFocus() {
  const cards = [...projectGrid.querySelectorAll(".project-card")];

  if (
    !mobileMenuMedia.matches ||
    mobileMenuIsOpen() ||
    projectDialog.open ||
    contactDialog.open
  ) {
    cards.forEach((card) => card.classList.remove("is-mobile-focus"));
    return;
  }

  if (!cards.length) return;

  const viewport = window.visualViewport;
  const viewportTop = viewport?.offsetTop || 0;
  const viewportHeight = viewport?.height || window.innerHeight;
  const focusY = viewportTop + viewportHeight * 0.5;

  let activeCard = null;
  let activeDistance = Infinity;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();

    if (rect.top <= focusY && rect.bottom >= focusY) {
      activeCard = card;
      activeDistance = 0;
      return;
    }

    if (activeDistance === 0) return;

    const centerY = rect.top + rect.height / 2;
    const distance = Math.abs(centerY - focusY);

    if (distance < activeDistance) {
      activeDistance = distance;
      activeCard = card;
    }
  });

  cards.forEach((card) => {
    card.classList.toggle("is-mobile-focus", card === activeCard);
  });
}

function scheduleMobileUiSync() {
  if (mobileUiTicking) return;
  mobileUiTicking = true;

  window.requestAnimationFrame(() => {
    syncMobileBrandCollapse();
    syncMobileProjectFocus();
    mobileUiTicking = false;
  });
}

function setMobileMenu(open) {
  if (!mobileMenuMedia.matches) {
    document.body.classList.remove("is-mobile-menu-open");
    mobileMenuToggle?.setAttribute("aria-expanded", "false");
    mobileMenuToggle?.setAttribute("aria-label", "Open work menu");
    portfolioNavPanel?.removeAttribute("aria-hidden");
    clearMainBrandProgress();
    return;
  }

  if (open) setMainBrandProgress(0);

  document.body.classList.toggle("is-mobile-menu-open", open);
  mobileMenuToggle?.setAttribute("aria-expanded", String(open));
  mobileMenuToggle?.setAttribute("aria-label", open ? "Close work menu" : "Open work menu");
  portfolioNavPanel?.setAttribute("aria-hidden", String(!open));

  window.requestAnimationFrame(syncMobileProjectFocus);
}

function closeMobileMenu() {
  setMobileMenu(false);
}

function syncMobileResponsiveLayout() {
  if (!mobileMenuMedia.matches) setMobileMenu(false);
  syncMobileBrandCollapse();
  syncMobileProjectBrandCollapse();
  syncMobileProjectFocus();
}

function setProjectBrandProgress(progress) {
  const eased = smoothstep01(progress);
  const headerHeight = 126 - (74 * eased);
  const brandHeight = 108 - (76 * eased);

  projectDialog.style.setProperty("--project-header-height", `${headerHeight.toFixed(2)}px`);
  projectDialog.style.setProperty("--project-brand-height", `${brandHeight.toFixed(2)}px`);
}

function clearProjectBrandProgress() {
  projectDialog.style.removeProperty("--project-header-height");
  projectDialog.style.removeProperty("--project-brand-height");
}

function syncMobileProjectBrandCollapse() {
  if (!mobileMenuMedia.matches || !projectDialog.open) {
    clearProjectBrandProgress();
    return;
  }

  const y = projectDialog.scrollTop || 0;
  const progress = clamp01((y - 4) / 92);
  setProjectBrandProgress(progress);
}

let projectScrollTicking = false;

function scheduleProjectBrandSync() {
  if (projectScrollTicking) return;
  projectScrollTicking = true;

  window.requestAnimationFrame(() => {
    syncMobileProjectBrandCollapse();
    projectScrollTicking = false;
  });
}

function setContactBrandProgress(progress) {
  const eased = smoothstep01(progress);
  const headerHeight = 126 - (74 * eased);
  const brandHeight = 108 - (76 * eased);

  contactDialog.style.setProperty("--contact-header-height", `${headerHeight.toFixed(2)}px`);
  contactDialog.style.setProperty("--contact-brand-height", `${brandHeight.toFixed(2)}px`);
}

function clearContactBrandProgress() {
  contactDialog.style.removeProperty("--contact-header-height");
  contactDialog.style.removeProperty("--contact-brand-height");
}

function syncMobileContactBrandCollapse() {
  if (!mobileMenuMedia.matches || !contactDialog.open) {
    clearContactBrandProgress();
    return;
  }

  const y = contactDialog.scrollTop || 0;
  const progress = clamp01((y - 4) / 92);
  setContactBrandProgress(progress);
}

let contactScrollTicking = false;

function scheduleContactBrandSync() {
  if (contactScrollTicking) return;
  contactScrollTicking = true;

  window.requestAnimationFrame(() => {
    syncMobileContactBrandCollapse();
    contactScrollTicking = false;
  });
}

mobileMenuMedia.addEventListener?.("change", syncMobileResponsiveLayout);
window.addEventListener("scroll", scheduleMobileUiSync, { passive: true });
window.addEventListener("resize", scheduleMobileUiSync, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleMobileUiSync, { passive: true });
window.visualViewport?.addEventListener("scroll", scheduleMobileUiSync, { passive: true });
projectDialog.addEventListener("scroll", scheduleProjectBrandSync, { passive: true });
contactDialog.addEventListener("scroll", scheduleContactBrandSync, { passive: true });

syncMobileResponsiveLayout();

function openContact(options = {}) {
  const { pushHistory = true } = options;

  closeMobileMenu();
  if (projectDialog.open) closeProject();

  clearContactBrandProgress();
  contactDialog.scrollTop = 0;

  if (!contactDialog.open) contactDialog.showModal();

  contactDialog.scrollTop = 0;
  requestAnimationFrame(() => {
    contactDialog.scrollTop = 0;
    syncMobileContactBrandCollapse();
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
  clearContactBrandProgress();
  document.body.classList.remove("is-locked");
}

function requestCloseContact() {
  if (window.history.state?.portfolioView === "contact") {
    window.history.back();
  } else {
    closeContact();
  }
}

contactTrigger?.addEventListener("click", () => openContact());
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

const currentYear = new Date().getFullYear();
yearNode.textContent = currentYear;
document.querySelectorAll(".mobile-home-contact__year").forEach((node) => {
  node.textContent = currentYear;
});
renderProjects();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenuIsOpen()) {
    closeMobileMenu();
  }
});