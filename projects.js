const projects = [
  {
    title: "Distant and Known",
    type: "Narrative Short Film",
    category: "narrative",
    roles: ["director", "editor", "colourist"],
    year: "2026",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://vumbnail.com/1116019493.jpg",
    stills: [
      "assets/project-01-01.jpg",
      "assets/project-01-02.jpg",
      "assets/project-01-03.jpg",
      "assets/project-01-04.jpg",
      "assets/project-01-05.jpg",
      "assets/project-01-06.jpg"
    ],
    media: { type: "vimeo", id: "1116019493" },
    description: "Narrative short film.",
    credits: [
      ["Writer-Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "A Little Regret in Helsinki",
    type: "Documentary Short Film",
    category: "documentary",
    roles: ["director", "editor", "colourist", "photographer"],
    year: "2025",
    medium: "Super 8mm",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://vumbnail.com/1110984253.jpg",
    stills: [
      "assets/project-02-01.jpg",
      "assets/project-02-02.jpg",
      "assets/project-02-03.jpg",
      "assets/project-02-04.jpg",
      "assets/project-02-05.jpg",
      "assets/project-02-06.jpg",
      "assets/project-02-07.jpg"
    ],
    media: { type: "vimeo", id: "1110984253" },
    description: "Documentary short film shot on Super 8mm.",
    credits: [
      ["Writer-Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ],
    festivals: [
      ["Tirana International Film Festival", "ALB"],
      ["Leiden Shorts", "NLD"],
      ["Buffalo International Film Festival", "USA"],
      ["Hobnobben Film Festival", "USA"],
      ["Canberra Short Film Festival", "AUS"],
      ["Beijing International Short Film Festival", "CHN"],
      ["MINT Chinese Film Festival", "UK"],
      ["NFFTY — National Film Festival for Talented Youth", "USA"],
      ["Play-Doc International Film Festival", "ESP"],
      ["Korea Diaspora Film Festival", "KOR"],
      ["Houston Asian American Pacific Islander Film Festival", "USA"],
      ["Blue Sea Film Festival", "FIN"]
    ]
  },
  {
    title: "Early Years",
    type: "Narrative Short Film",
    category: "narrative",
    roles: ["director", "editor", "colourist", "photographer"],
    year: "2024",
    medium: "Digital 4K / Camcorder HD",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://vumbnail.com/1016622750.jpg",
    stills: [
      "assets/project-03-01.jpg",
      "assets/project-03-02.jpg",
      "assets/project-03-03.jpg",
      "assets/project-03-04.jpg"
    ],
    media: { type: "vimeo", id: "1016622750" },
    description: "Narrative short film combining Digital 4K and camcorder HD textures.",
    credits: [
      ["Writer-Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "Signature Payroll",
    type: "Commercial Film",
    category: "commercial",
    roles: ["director", "editor", "colourist"],
    year: "2026",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://i.vimeocdn.com/video/2201998092-b4bdf5d78ead6a8d72c207efb9b11f0f12cfd03b237c8a244254bac3422d1990-d_295x166?region=us",
    stills: [
      "assets/project-04-01.jpg",
      "assets/project-04-02.jpg",
      "assets/project-04-03.jpg",
      "assets/project-04-04.jpg",
      "assets/project-04-05.jpg"
    ],
    media: { type: "vimeo", id: "1227710649" },
    description: "Commercial film.",
    credits: [
      ["Writer-Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "I Just Wanna Be Liked By You",
    client: "Glen Gold",
    type: "Music Video",
    category: "music",
    roles: ["director", "editor", "colourist"],
    year: "2026",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://vumbnail.com/1192974168.jpg",
    stills: [
      "assets/project-05-01.jpg",
      "assets/project-05-02.jpg",
      "assets/project-05-03.jpg",
      "assets/project-05-04.jpg",
      "assets/project-05-05.jpg"
    ],
    media: { type: "vimeo", id: "1192974168" },
    description: "Music video for Glen Gold.",
    credits: [
      ["Artist", "Glen Gold"],
      ["Writer-Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "State of No Cause",
    type: "Documentary Short Film",
    category: "documentary",
    roles: ["colourist"],
    year: "2026",
    status: "Coming Soon",
    medium: "Digital 4K / Camcorder HD",
    roleText: "Colourist",
    thumbnail: "https://vumbnail.com/1175622234.jpg",
    stills: [],
    media: { type: "vimeo", id: "1175622234" },
    description: "In rural Vermont, an elderly couple faces a no-cause eviction that threatens their connection to home, animals and community.",
    credits: [
      ["Filmmakers", "Malik Clyde Terrab / Brandon Mioduszewski"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "POTE'CAST",
    type: "Podcast Video Series",
    category: "podcast",
    roles: ["director", "producer", "editor", "colourist"],
    year: "2023–2024",
    medium: "Digital 4K",
    roleText: "Director / Producer / Editor / Colourist",
    thumbnail: "https://img.youtube.com/vi/WmM7TZO3HDc/maxresdefault.jpg",
    thumbnailFallbacks: ["https://img.youtube.com/vi/WmM7TZO3HDc/hqdefault.jpg"],
    stills: [],
    media: {
      type: "youtube",
      id: "WmM7TZO3HDc",
      playlist: "PL0EIupkHTPoQyQ4l-ivQeY6-ZwIZzcu7b"
    },
    description: "Podcast video series.",
    credits: [
      ["Director", "Haohao Qiaoshi Liu"],
      ["Producer", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Colourist", "Haohao Qiaoshi Liu"]
    ]
  },
  {
    title: "La Rêverie Festival Trailer",
    type: "Trailer",
    category: "trailer",
    roles: ["director", "editor", "animator"],
    year: "2023",
    medium: "Digital 4K / Animation",
    roleText: "Director / Editor / Animator",
    thumbnail: "https://img.youtube.com/vi/ykr8qHLEXoE/maxresdefault.jpg",
    thumbnailFallbacks: ["https://img.youtube.com/vi/ykr8qHLEXoE/hqdefault.jpg"],
    stills: [],
    media: { type: "youtube", id: "ykr8qHLEXoE" },
    description: "Festival trailer combining live-action footage and animation.",
    credits: [
      ["Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Animator", "Haohao Qiaoshi Liu"]
    ]
  }
];

/* ===== HQL history + still lightbox enhancements ===== */
(() => {
  "use strict";

  function initEnhancements() {
    const projectDialog = document.getElementById("project-dialog");
    if (!projectDialog) {
      return;
    }

    let activeStills = [];
    let activeStillIndex = 0;
    let closingFromPopstate = false;

    function projectCards() {
      return Array.from(document.querySelectorAll(".project-card"));
    }

    function createLightbox() {
      let lightbox = document.getElementById("still-lightbox");
      if (lightbox) {
        return lightbox;
      }

      lightbox = document.createElement("div");
      lightbox.id = "still-lightbox";
      lightbox.className = "still-lightbox";
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.innerHTML = `
        <button class="still-lightbox__button still-lightbox__close" type="button" aria-label="Close image">×</button>
        <button class="still-lightbox__button still-lightbox__prev" type="button" aria-label="Previous image">←</button>
        <div class="still-lightbox__image-wrap">
          <img class="still-lightbox__image" alt="">
        </div>
        <button class="still-lightbox__button still-lightbox__next" type="button" aria-label="Next image">→</button>
        <div class="still-lightbox__counter" aria-live="polite"></div>
      `;

      document.body.appendChild(lightbox);

      lightbox.querySelector(".still-lightbox__close").addEventListener("click", () => {
        if (history.state?.hqlView === "lightbox") {
          history.back();
        } else {
          closeLightbox();
        }
      });

      lightbox.querySelector(".still-lightbox__prev").addEventListener("click", () => {
        showStill(activeStillIndex - 1);
      });

      lightbox.querySelector(".still-lightbox__next").addEventListener("click", () => {
        showStill(activeStillIndex + 1);
      });

      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
          if (history.state?.hqlView === "lightbox") {
            history.back();
          } else {
            closeLightbox();
          }
        }
      });

      return lightbox;
    }

    function showStill(index) {
      if (!activeStills.length) {
        return;
      }

      activeStillIndex = (index + activeStills.length) % activeStills.length;

      const lightbox = createLightbox();
      const image = lightbox.querySelector(".still-lightbox__image");
      const counter = lightbox.querySelector(".still-lightbox__counter");
      const current = activeStills[activeStillIndex];

      image.src = current.src;
      image.alt = current.alt || `Film still ${activeStillIndex + 1}`;
      counter.textContent = `${activeStillIndex + 1} / ${activeStills.length}`;
    }

    function openLightbox(clickedImage) {
      const grid = clickedImage.closest(".stills-grid");
      if (!grid) {
        return;
      }

      const images = Array.from(grid.querySelectorAll(".still-item img"));
      activeStills = images.map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt
      }));
      activeStillIndex = images.indexOf(clickedImage);

      if (activeStillIndex < 0 || !activeStills.length) {
        return;
      }

      showStill(activeStillIndex);

      const lightbox = createLightbox();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");

      if (history.state?.hqlView !== "lightbox") {
        history.pushState(
          {
            hqlView: "lightbox",
            projectIndex: history.state?.projectIndex ?? null
          },
          "",
          "#still"
        );
      }
    }

    function closeLightbox() {
      const lightbox = document.getElementById("still-lightbox");
      if (!lightbox) {
        return;
      }

      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    }

    function closeProjectFromHistory() {
      if (!projectDialog.open) {
        return;
      }

      closingFromPopstate = true;
      projectDialog.close();
      closingFromPopstate = false;
    }

    document.addEventListener("click", (event) => {
      const stillImage = event.target.closest(".still-item img");
      if (stillImage) {
        event.preventDefault();
        openLightbox(stillImage);
        return;
      }

      const card = event.target.closest(".project-card");
      if (card && history.state?.hqlView !== "project" && history.state?.hqlView !== "lightbox") {
        const index = projectCards().indexOf(card);
        history.pushState(
          {
            hqlView: "project",
            projectIndex: index
          },
          "",
          "#project"
        );
      }
    });

    projectDialog.addEventListener("close", () => {
      if (!closingFromPopstate && history.state?.hqlView === "project") {
        history.back();
      }
    });

    window.addEventListener("popstate", (event) => {
      const view = event.state?.hqlView || null;

      if (view !== "lightbox") {
        closeLightbox();
      }

      if (view !== "project" && view !== "lightbox") {
        closeProjectFromHistory();
      }
    });

    document.addEventListener("keydown", (event) => {
      const lightbox = document.getElementById("still-lightbox");
      const isOpen = lightbox?.classList.contains("is-open");

      if (!isOpen) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showStill(activeStillIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showStill(activeStillIndex + 1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (history.state?.hqlView === "lightbox") {
          history.back();
        } else {
          closeLightbox();
        }
      }
    });

    createLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEnhancements, { once: true });
  } else {
    initEnhancements();
  }
})();
