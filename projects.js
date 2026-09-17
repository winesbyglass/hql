const projects = [
  {
    title: "Distant and Known",
    type: "Narrative Short Film",
    category: "narrative",
    roles: ["director", "editor", "colourist"],
    year: "2026",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "assets/distant-and-known.svg",
    stills: [],
    media: {
      type: "vimeo",
      id: "1116019493"
    },
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
    roles: ["director", "editor", "colourist"],
    year: "2025",
    medium: "Super 8mm",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "assets/little-regret.svg",
    stills: [],
    media: {
      type: "external",
      src: "assets/little-regret.svg",
      url: "https://vimeo.com/haohaoqliu/trailer?share=copy&fl=sv&fe=ci",
      label: "WATCH TRAILER ON VIMEO ↗",
      alt: "A Little Regret in Helsinki"
    },
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
    roles: ["director", "editor", "colourist"],
    year: "2024",
    medium: "Digital 4K / Camcorder HD",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "assets/early-years.svg",
    stills: [],
    media: {
      type: "vimeo",
      id: "1016622750"
    },
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
    year: "",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "assets/signature-payroll.svg",
    stills: [],
    media: {
      type: "external",
      src: "assets/signature-payroll.svg",
      url: "https://www.instagram.com/reel/DZcUzPPsp7i/?utm_source=ig_web_button_share_sheet&stkn=MzRlODBiNWFlZA==",
      label: "WATCH ON INSTAGRAM ↗",
      alt: "Signature Payroll"
    },
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
    year: "",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "assets/liked-by-you.svg",
    stills: [],
    media: {
      type: "vimeo",
      id: "1192974168"
    },
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
    thumbnail: "assets/state-of-no-cause-cover.jpg",
    stills: [],
    media: {
      type: "vimeo",
      id: "1175622234"
    },
    description: "In rural Vermont, an elderly couple faces a no-cause eviction that threatens their connection to home, animals and community.",
    credits: [
      ["Director", "Malik Clyde Terrab"],
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
    stills: [],
    media: {
      type: "youtube",
      id: "ykr8qHLEXoE"
    },
    description: "Festival trailer combining live-action footage and animation.",
    credits: [
      ["Director", "Haohao Qiaoshi Liu"],
      ["Editor", "Haohao Qiaoshi Liu"],
      ["Animator", "Haohao Qiaoshi Liu"]
    ]
  }
];
