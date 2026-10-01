import type { Source } from "./core.ts";

// Fontes do Radar. Para incluir uma nova, basta adicionar aqui:
// se a URL do feed estiver errada, o leitor descobre o feed pela página inicial.
export const sources: Source[] = [
  {
    id: "ign",
    name: "IGN Brasil",
    home: "https://br.ign.com/",
    feeds: ["https://br.ign.com/feed.xml", "https://br.ign.com/rss"],
  },
  {
    id: "theenemy",
    name: "The Enemy",
    home: "https://www.theenemy.com.br/",
    feeds: ["https://www.theenemy.com.br/rss", "https://www.theenemy.com.br/feed", "https://www.theenemy.com.br/rss.xml"],
  },
  {
    id: "voxel",
    name: "Voxel",
    home: "https://www.tecmundo.com.br/voxel",
    feeds: ["https://rss.tecmundo.com.br/voxel", "https://www.tecmundo.com.br/voxel/rss", "https://voxel.com.br/feed"],
  },
  {
    id: "tecmundo",
    name: "TecMundo",
    home: "https://www.tecmundo.com.br/",
    feeds: ["https://rss.tecmundo.com.br/feed", "https://www.tecmundo.com.br/rss"],
    gamesOnly: true,
  },
  {
    id: "maisesports",
    name: "Mais Esports",
    home: "https://maisesports.com.br/",
    feeds: ["https://maisesports.com.br/feed/"],
    defaultSection: "competitivo",
  },
  {
    id: "draft5",
    name: "Draft5",
    home: "https://draft5.gg/",
    feeds: ["https://draft5.gg/feed", "https://draft5.gg/rss"],
    defaultSection: "competitivo",
  },
  {
    id: "flowgames",
    name: "Flow Games",
    home: "https://flowgames.gg/",
    feeds: ["https://flowgames.gg/feed/"],
  },
  {
    id: "gameblast",
    name: "GameBlast",
    home: "https://www.gameblast.com.br/",
    feeds: ["https://www.gameblast.com.br/feeds/posts/default?alt=rss"],
  },
  {
    id: "adrenaline",
    name: "Adrenaline",
    home: "https://www.adrenaline.com.br/",
    feeds: ["https://www.adrenaline.com.br/feed/", "https://www.adrenaline.com.br/rss/"],
    gamesOnly: true,
  },
  {
    id: "jovemnerd",
    name: "Jovem Nerd",
    home: "https://jovemnerd.com.br/",
    feeds: ["https://jovemnerd.com.br/feed/"],
    gamesOnly: true,
  },
];
