/*
  EDIT THIS FILE FIRST.

  roles can contain: "direction", "edit", "colour"

  media options:
  1. Image project:
     media: { type: "image", src: "assets/your-image.jpg", alt: "Description" }

  2. Local video project:
     media: { type: "video", src: "assets/your-film.mp4", poster: "assets/poster.jpg" }

  3. Vimeo project:
     media: { type: "vimeo", id: "123456789" }
*/

const projects = [
  {
    title: "Afterlight",
    client: "Fashion Film",
    year: "2026",
    roles: ["direction", "edit", "colour"],
    thumbnail: "assets/project-01.svg",
    media: { type: "image", src: "assets/project-01.svg", alt: "Afterlight project still" },
    description: "A quiet fashion film built around movement, texture and late-day light.",
    credits: [
      ["Director", "Your Name"],
      ["Editor", "Your Name"],
      ["Colourist", "Your Name"],
      ["DOP", "Collaborator Name"]
    ]
  },
  {
    title: "Night Swim",
    client: "Music",
    year: "2026",
    roles: ["edit", "colour"],
    thumbnail: "assets/project-02.svg",
    media: { type: "image", src: "assets/project-02.svg", alt: "Night Swim project still" },
    description: "A music piece cut around repetition, fragments and a nocturnal colour palette.",
    credits: [
      ["Artist", "Artist Name"],
      ["Editor", "Your Name"],
      ["Colourist", "Your Name"],
      ["Director", "Director Name"]
    ]
  },
  {
    title: "Open Road",
    client: "Commercial",
    year: "2025",
    roles: ["direction"],
    thumbnail: "assets/project-03.svg",
    media: { type: "image", src: "assets/project-03.svg", alt: "Open Road project still" },
    description: "A cinematic commercial focused on scale, landscape and restrained performance.",
    credits: [
      ["Director", "Your Name"],
      ["Production", "Production Company"],
      ["DOP", "Collaborator Name"],
      ["Agency", "Agency Name"]
    ]
  },
  {
    title: "Still / Moving",
    client: "Editorial",
    year: "2025",
    roles: ["direction", "edit"],
    thumbnail: "assets/project-04.svg",
    media: { type: "image", src: "assets/project-04.svg", alt: "Still Moving project still" },
    description: "An editorial portrait moving between controlled compositions and spontaneous gestures.",
    credits: [
      ["Director", "Your Name"],
      ["Editor", "Your Name"],
      ["Styling", "Collaborator Name"]
    ]
  },
  {
    title: "Soft Focus",
    client: "Beauty",
    year: "2025",
    roles: ["colour"],
    thumbnail: "assets/project-05.svg",
    media: { type: "image", src: "assets/project-05.svg", alt: "Soft Focus project still" },
    description: "A beauty grade balancing clean skin tones, soft contrast and a slightly nostalgic finish.",
    credits: [
      ["Colourist", "Your Name"],
      ["Director", "Director Name"],
      ["DOP", "Collaborator Name"]
    ]
  },
  {
    title: "Between Frames",
    client: "Short Film",
    year: "2024",
    roles: ["edit"],
    thumbnail: "assets/project-06.svg",
    media: { type: "image", src: "assets/project-06.svg", alt: "Between Frames project still" },
    description: "A narrative edit built around negative space, performance and deliberate changes in pace.",
    credits: [
      ["Editor", "Your Name"],
      ["Director", "Director Name"],
      ["Producer", "Producer Name"]
    ]
  }
];
