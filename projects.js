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
    stills: [],
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
    stills: [],
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
    stills: [],
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
    stills: [],
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
    category: "commercial",
    roles: ["director", "editor", "colourist"],
    year: "2026",
    medium: "Digital 4K",
    roleText: "Writer-Director / Editor / Colourist",
    thumbnail: "https://vumbnail.com/1192974168.jpg",
    stills: [],
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
    category: "branded",
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
    category: "branded",
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
