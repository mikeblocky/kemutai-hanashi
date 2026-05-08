import "./style.css";
import * as THREE from "three";
import { createCharacterSystem } from "./characters";
import chaptersText from "../chapters.txt?raw";

function parseChapterArchive(text) {
  const chapters = [];
  const chapterHeading = /^Chapter\s+(\d+)(.*)$/i;
  let currentChapter = null;

  text.split(/\r?\n/).forEach((line) => {
    const heading = line.match(chapterHeading);
    if (heading) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = {
        chapterNumber: Number(heading[1]),
        subtitle: heading[2].replace(/[–-]/g, "").trim(),
        lines: []
      };
      return;
    }

    if (currentChapter) {
      currentChapter.lines.push(line);
    }
  });

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters.map((chapter) => {
    const paragraphs = chapter.lines
      .join("\n")
      .split(/\n\s*\n/g)
      .map((paragraph) => paragraph.replace(/^-{3,}\s*/gm, "").trim())
      .filter(Boolean);
    const wardrobe = paragraphs[0]?.includes("wears") ? paragraphs.shift() : "";

    return {
      chapterNumber: chapter.chapterNumber,
      title: chapter.subtitle ? `Chapter ${chapter.chapterNumber}: ${chapter.subtitle}` : `Chapter ${chapter.chapterNumber}`,
      wardrobe,
      plots: paragraphs
    };
  });
}

const chapterArchive = parseChapterArchive(chaptersText);
const volumeArchive = Array.from({ length: 7 }, (_, index) => ({
  volumeNumber: index + 1,
  cover: `/covers/vol${index + 1}.jpg`,
  chapters: index === 0 ? chapterArchive : []
}));

const characterProfiles = {
  takeda: {
    name: "Takeda",
    icon: "/character_icon/takeda.jpg",
    full: "/character_full/takeda-full.jpg",
    quote:
      "A person who is fine with other people not understanding what matters to him, as long as he understands it himself.",
    basics: [
      ["Full name", "Takeda Torahiko. The family name is inferred in the current version."],
      ["Height", "177 cm, presumably from the pilot version."],
      ["Gender", "Male"],
      ["Job", "High-school teacher, teaching Japanese (literature)"],
      ["Relationship", "Roommates with Arita."],
      ["Students", "Currently teaches Japanese to Tsukiyama and Tachibana."],
      ["First appeared", "Chapter 1."]
    ],
    answers: [
      ["First met Arita", "Around age 17."],
      ["Became partners", "Around age 20."],
      ["Can read Arita's mind?", "No."],
      ["Arita as a person", "Likes him."],
      ["Arita as a partner", "Can trust him."],
      ["If Arita begged him to kill him", "He could do it."],
      ["Does he think Arita is cute?", "Often. Arita does odd things while staying quiet."],
      ["Does he think Arita is cool?", "Yes."],
      ["Does he respect Arita?", "He does."],
      ["Does he hate Arita?", "No way."],
      ["Is he jealous of Arita?", "Not particularly."],
      ["Does he want to be like Arita?", "What is that supposed to mean?"]
    ],
    handNotes: [
      ["Build", "Large overall."],
      ["Fingers", "A texture you would want to touch forever."],
      ["Temperature", "Surprisingly cold."],
      ["Skin", "Prone to dryness, but less than Arita."]
    ],
    hamburger: [
      ["Action", "He looks wide-eyed and a little surprised, and the burger is already messy in his hands."],
      ["First bite", "All of the lettuce disappears."],
      ["Shift", "Everything slides out of alignment."],
      ["Tomato", "The tomato gets pulled along with the lettuce and falls onto the wrapper."],
      ["Result", "The burger is missing its greens, with one lonely slice of tomato left outside."]
    ],
    vector: [
      ["Direction", "Toward Arita himself."],
      ["Basis", "Arita has directed feelings toward Takeda that no one else ever has."],
      ["Approach", "While he knows Arita interacts with other people, his basic way of facing Arita is strictly one-on-one."],
      ["Significance", "Arita may be the first person Takeda has ever truly tried to face in a one-on-one manner."]
    ]
  },
  arita: {
    name: "Arita",
    icon: "/character_icon/arita.jpg",
    full: "/character_full/arita-full.jpg",
    quote:
      "A person who wants the people around him to understand what matters to him too.",
    basics: [
      ["Full name", "Arita Kazuomi. The family name is inferred in the current version."],
      ["Height", "173 cm, presumably."],
      ["Gender", "Male"],
      ["Job", "Florist at Yamaguchi Flower Shop. In the pilot version, he was a barber."],
      ["Relationship", "Roommates with Takeda. Works under Ryuu at Yamaguchi Flower Shop."],
      ["First appeared", "Chapter 1."]
    ],
    answers: [
      ["First met Takeda", "Around age 17."],
      ["Became partners", "Around age ??? (he doesn't know)."],
      ["Can read Takeda's mind?", "Yes."],
      ["Takeda as a person", "Likes him."],
      ["Takeda as a partner", "Can trust him."],
      ["If Takeda begged him to kill him", "He could not do it."],
      ["Does he think Takeda is cute?", "His smile is cute."],
      ["Does he think Takeda is cool?", "Yes."],
      ["Does he respect Takeda?", "He does."],
      ["Does he hate Takeda?", "No."],
      ["Is he jealous of Takeda?", "Yes."],
      ["Does he want to be like Takeda?", "Yes."]
    ],
    handNotes: [
      ["Build", "Bony, with visible tendons and veins."],
      ["Fingers", "Long."],
      ["Temperature", "Surprisingly warm."],
      ["Skin", "Prone to dryness."]
    ],
    hamburger: [
      ["Action", "He looks very serious and strained while trying to take a bite."],
      ["Bite", "He cannot bite through all the layers at once, so the bite skews toward either the top or the bottom."],
      ["Small note", "Small mouth."],
      ["Result", "A small, clean bite comes out of only the top bun and the first few layers."]
    ],
    vector: [
      ["Direction", "Toward Takeda in relation to others."],
      ["Basis", "At the root there is admiration for Takeda's ability to live for the sake of other people."],
      ["Approach", "His sense of Takeda is shaped by how Takeda exists among people other than himself."],
      ["Significance", "Because of that admiration, the feeling of wanting Takeda to be with him for his own sake is comparatively thin."]
    ]
  },
  ryuu: {
    name: "Ryuu",
    icon: "/character_icon/ryuu.jpg",
    full: "/character_full/ryuu-full.jpg",
    quote: "Manager and owner of Yamaguchi Flower Shop.",
    basics: [
      ["Job", "Florist manager and owner at Yamaguchi Flower Shop."],
      ["Relationship", "Connected with Hinako. Arita works at his flower shop."],
      ["First appeared", "Chapter 3."]
    ],
    answers: []
  },
  tsukiyama: {
    name: "Tsukiyama",
    icon: "/character_icon/tsukiyama.jpg",
    full: "/character_full/tsukiyama-full.jpg",
    quote: "One of the classmates of Tachibana.",
    basics: [
      ["Relationship", "Classmates with Tachibana."],
      ["Teacher", "Currently being taught Japanese (literature) by Takeda."],
      ["First appeared", "Chapter 2."]
    ],
    answers: []
  },
  tachibana: {
    name: "Tachibana",
    icon: "/character_icon/tachibana.jpg",
    full: "/character_full/tachibana-full.jpg",
    quote: "One of the classmates of Tsukiyama.",
    basics: [
      ["Relationship", "Classmates with Tsukiyama."],
      ["Teacher", "Currently being taught Japanese (literature)by Takeda."],
      ["First appeared", "Chapter 2."]
    ],
    answers: []
  },
  hinako: {
    name: "Hinako",
    icon: "/character_icon/hinato.jpg",
    full: "/character_full/hinato-full.jpg",
    quote: "An old classmate of Takeda.",
    basics: [
      ["Relationship", "Old classmate of Takeda."],
      ["Family", "Arisu's mother."],
      ["First appeared", "Chapter 9."]
    ],
    answers: []
  },
  arisu: {
    name: "Arisu",
    icon: "/character_icon/arisu.jpg",
    full: "/character_full/arisu-full.jpg",
    quote: "Hinako's daughter.",
    basics: [
      ["Family", "Daughter of Hinako and Hinako's former boyfriend."],
      ["Care", "Currently cared for by Tachibana, Hinako, and Ryuu."],
      ["First appeared", "Chapter 9."]
    ],
    answers: []
  }
};

const characterMatchups = [
  ["Shogi / chess", "Neither knows the rules. If they played anyway, Takeda would win."],
  ["Foot race", "Arita."],
  ["Arm wrestling", "Arita."],
  ["Poker", "Takeda."],
  ["Fistfight", "They would not do that."],
  ["Verbal argument", "They would not do that."]
];

const hotspotContent = {
  author: {
    title: "About Fumiya Hayashi",
    image: "/covers/vol3.jpg",
    caption: "Fumiya Hayashi writes manga under the name Hayashi Fumiya.",
    body:
      "Fumiya Hayashi is currently serializing Kemutai Hanashi on Kobunsha's web manga site COMIC Nettai. She also writes some blog on pixiv FANBOX with topics: thoughts, behind-the-scenes comments, sketches, roughs, and records from the production process.",
    details: [
      {
        label: "Works",
        text: "Kemutai Hanashi volume 7 onward is published by Kobunsha Nettai Comics. Seshuusei Triangle (Hereditary Triangle) is published in two volumes by KADOKAWA Beam Comics."
      },
      {
        label: "Fanbox",
        text: "The posts are extra material, like DVD bonus commentary. You do not need them to understand the main story."
      },
      {
        label: "Support",
        text: "Support funds go toward manga equipment, supplies, reference materials, event costs, doujinshi production, and coffee or snacks while working."
      }
    ]
  },
  story: {
    title: "Previous iterations",
    image: "/covers/pilot.png",
    caption: "Early Kemutai Hanashi material before the current serialization.",
    body:
      "Before the current version, Kemutai Hanashi had earlier doujin and pilot forms. Some ideas from those versions were later reused or reshaped while writing the serialized chapters.",
    details: [
      {
        label: "Doujin edition",
        text: "Rekishi ni wa Naranai: Kemutai Hanashi Doujin Edition collects these earlier versions."
      },
      {
        label: "Included works",
        text: "Transparent Umbrella; Tomorrow's Tomorrow; Reverse Thorn; Kemutai Hanashi; Flowers in a Storm; and a newly drawn story."
      },
      {
        label: "Paper-first pieces",
        text: "Reverse Thorn, Kemutai Hanashi, Flowers in a Storm, and the newly drawn story were first published in print in this collection."
      }
    ]
  },
  volumes: {
    title: "Volume archive",
    image: "/covers/vol1.jpg",
    caption: "Choose a volume and chapter to read the notes.",
    body:
      "The bookshelf holds the cover archive. Volume 1 includes chapter notes from the local chapter file; the other volumes are cover placeholders for now.",
    details: [
      {
        label: "Source",
        text: "Chapter notes come from chapters.txt."
      },
      {
        label: "Controls",
        text: "Volume buttons change the cover. Chapter buttons change the notes."
      }
    ]
  },
  curtains: {
    title: "Character notes",
    image: "/character_full/takeda-full.jpg",
    caption: "Choose a character to see their profile.",
    body:
      "The curtain opens into character information. Pick a character icon to read profile notes, relationship notes, and extra details.",
    details: []
  },
  balcony: {
    title: "Balcony",
    image: "/covers/vol3.jpg",
    caption: "A quieter edge of the apartment.",
    body:
      "The balcony is the room's softer edge. Plants, laundry, railings, city blocks, and a small lantern make it feel like somewhere the characters could step out and breathe for a minute.",
    details: [
      {
        label: "Day",
        text: "Warm light keeps it ordinary and domestic."
      },
      {
        label: "Night",
        text: "Cool city light and the lantern make it feel more private."
      }
    ]
  },
  pair: {
    title: "The Pair",
    image: "/covers/vol7.jpg",
    caption: "Takeda and Arita share the room as everyday partners.",
    body:
      "The two room guides are simplified versions of Takeda and Arita, shaped to read clearly from the game's camera while keeping their hair color, clothing mood, and relationship to the room recognizable.",
    details: [
      {
        label: "Takeda",
        text: "Darker hair, blue jacket, quieter posture."
      },
      {
        label: "Arita",
        text: "Lighter hair, warmer outfit, more open expression."
      }
    ]
  }
};

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app-shell" data-mode="night">
    <div class="scene-host" id="scene-host"></div>

    <header class="hud hud-top">

      <div class="action-cluster">
        <button class="hud-button hud-button-sun" id="mode-toggle" type="button">Day</button>
        <button class="hud-button hud-button-pink" id="switch-trigger" type="button">Swap</button>
        <button class="hud-button hud-button-mint" id="inspect-trigger" type="button">Open</button>
        <button class="hud-button hud-button-cream" id="fullscreen-trigger" type="button">Full</button>
        <button class="hud-button hud-button-cream" id="simple-trigger" type="button">Simple</button>
      </div>
    </header>

    <div class="hud hud-status">
      <div class="hint-card">
        <strong id="status-title">Walk</strong>
        <p id="status-copy">Press E near a bubble.</p>
      </div>
    </div>

    <div class="simple-panel" id="simple-panel">
      <p class="simple-heading">Kemutai Hanashi</p>
      <div class="simple-grid">
        <button class="simple-card" type="button" data-open="author">
          <span class="simple-icon simple-icon-author"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
          <span class="simple-label">Author</span>
        </button>
        <button class="simple-card" type="button" data-open="story">
          <span class="simple-icon simple-icon-story"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
          <span class="simple-label">Story</span>
        </button>
        <button class="simple-card" type="button" data-open="volumes">
          <span class="simple-icon simple-icon-volumes"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
          <span class="simple-label">Volumes</span>
        </button>
        <button class="simple-card" type="button" data-open="curtains">
          <span class="simple-icon simple-icon-curtains"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          <span class="simple-label">Characters</span>
        </button>
      </div>
    </div>

    <div class="popup-shell" id="popup-shell" aria-hidden="true">
      <div class="popup-backdrop" id="popup-backdrop"></div>
      <article class="detail-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title">
        <button class="popup-close" id="popup-close" type="button" aria-label="Close detail popup">×</button>
        <div class="popup-copy">
          <span class="popup-kicker">Discoverable Detail</span>
          <h2 id="popup-title">Story Mood</h2>
          <p id="popup-body"></p>
          <div class="popup-details" id="popup-details"></div>
        </div>
        <div class="popup-media">
          <img id="popup-image" src="/covers/vol7.jpg" alt="Kemutai Hanashi reference cover" />
          <div class="popup-caption" id="popup-caption"></div>
        </div>
      </article>
    </div>

    <div class="touch-controls">
      <div class="touch-dpad">
        <button class="touch-button" type="button" data-move="up">▲</button>
        <button class="touch-button" type="button" data-move="left">◀</button>
        <button class="touch-button" type="button" data-move="down">▼</button>
        <button class="touch-button" type="button" data-move="right">▶</button>
      </div>
      <div class="touch-actions">
        <button class="touch-button touch-wide" type="button" id="touch-inspect">Inspect</button>
      </div>
    </div>
  </div>
`;

const shell = app.querySelector(".app-shell");
const sceneHost = app.querySelector("#scene-host");
const statusTitle = app.querySelector("#status-title");
const statusCopy = app.querySelector("#status-copy");
const popupShell = app.querySelector("#popup-shell");
const popupBackdrop = app.querySelector("#popup-backdrop");
const popupClose = app.querySelector("#popup-close");
const popupTitle = app.querySelector("#popup-title");
const popupBody = app.querySelector("#popup-body");
const popupImage = app.querySelector("#popup-image");
const popupCaption = app.querySelector("#popup-caption");
const popupDetails = app.querySelector("#popup-details");
const modeToggle = app.querySelector("#mode-toggle");
const switchTrigger = app.querySelector("#switch-trigger");
const inspectTrigger = app.querySelector("#inspect-trigger");
const fullscreenTrigger = app.querySelector("#fullscreen-trigger");
const touchInspect = app.querySelector("#touch-inspect");
const simpleTrigger = app.querySelector("#simple-trigger");
const simplePanel = app.querySelector("#simple-panel");

const state = {
  isNight: true,
  popupOpen: false,
  simplified: false,
  closestHotspot: null,
  activeVolume: 1,
  activeChapter: 1,
  pointer: new THREE.Vector2(0, 0),
  playerFacing: 0,
  activeCharacterId: "visitor",
  swapBlockedUntil: 0,
  lastInteractionEmoteAt: 0,
  lastPairedActionAt: 0,
  pressed: {
    up: false,
    down: false,
    left: false,
    right: false
  }
};

function setMoveState(direction, value) {
  state.pressed[direction] = value;
}

function resetMovement() {
  state.pressed.up = false;
  state.pressed.down = false;
  state.pressed.left = false;
  state.pressed.right = false;
}

function setPopupContent(key) {
  const content = hotspotContent[key];
  if (!content) {
    return;
  }

  popupShell.dataset.content = key;
  popupTitle.textContent = content.title;
  popupBody.textContent = content.body;
  popupImage.src = content.image;
  popupCaption.textContent = content.caption;
  popupDetails.innerHTML = "";

  content.details.forEach((item) => {
    const row = document.createElement("div");
    row.className = "popup-detail";
    row.innerHTML = `<strong>${item.label}</strong><span>${item.text}</span>`;
    popupDetails.appendChild(row);
  });

  if (key === "volumes") {
    renderVolumeArchive();
  } else if (key === "curtains") {
    renderCharacterProfiles("takeda");
  }
}

function renderCharacterProfiles(activeId) {
  const profile = characterProfiles[activeId] ?? characterProfiles.takeda;
  const panel = document.createElement("section");
  panel.className = "character-profile";
  panel.setAttribute("aria-label", "Character biography");

  const picker = document.createElement("div");
  picker.className = "character-picker";
  Object.values(characterProfiles).forEach((character) => {
    const id = character.name.toLowerCase();
    const button = document.createElement("button");
    button.className = "character-icon-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(id === activeId));
    button.setAttribute("aria-label", `Show ${character.name}`);
    button.innerHTML = `<img src="${character.icon}" alt="" /><span>${character.name}</span>`;
    button.addEventListener("click", () => renderCharacterProfiles(id));
    picker.appendChild(button);
  });

  const textPanel = document.createElement("div");
  textPanel.className = "character-text";

  const quote = document.createElement("p");
  quote.className = "character-quote";
  quote.textContent = `"${profile.quote}"`;

  const createFactList = (items, className = "") => {
    const list = document.createElement("dl");
    list.className = `character-facts ${className}`.trim();
    items.forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value;
      list.append(term, description);
    });
    return list;
  };

  const createSection = (title, items, tone, className = "") => {
    if (!items?.length) {
      return null;
    }

    const section = document.createElement("section");
    section.className = `character-section character-section-${tone} ${className}`.trim();
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading, createFactList(items));
    return section;
  };

  const pairOnlySections = activeId === "takeda" || activeId === "arita";
  const sections = [
    createSection("Profile", profile.basics, "cream"),
    createSection("Notes", profile.answers, "blue"),
    createSection("Relationship vector", profile.vector, "lavender"),
    createSection("Hands", profile.handNotes, "peach"),
    createSection("Can they eat a huge hamburger skillfully?", profile.hamburger, "green", "hamburger-section"),
    pairOnlySections ? createSection("If they competed together...", characterMatchups, "lavender") : null
  ].filter(Boolean);

  textPanel.append(quote, ...sections);
  panel.append(picker, textPanel);
  popupDetails.replaceChildren(panel);
  popupImage.src = profile.full;
  popupImage.alt = `${profile.name} full-body character art`;
  popupCaption.textContent = profile.name;
}

function renderVolumeArchive() {
  const archive = document.createElement("section");
  archive.className = "volume-archive";
  archive.setAttribute("aria-label", "Bookshelf plot archive");

  const volumeNav = document.createElement("div");
  volumeNav.className = "volume-buttons";
  volumeArchive.forEach((volume) => {
    const button = document.createElement("button");
    button.className = "archive-button";
    button.type = "button";
    button.textContent = `Vol. ${volume.volumeNumber}`;
    button.setAttribute("aria-pressed", String(volume.volumeNumber === state.activeVolume));
    button.addEventListener("click", () => {
      state.activeVolume = volume.volumeNumber;
      state.activeChapter = volume.chapters[0]?.chapterNumber ?? 1;
      renderVolumeArchive();
    });
    volumeNav.appendChild(button);
  });

  const activeVolume = volumeArchive.find((volume) => volume.volumeNumber === state.activeVolume) ?? volumeArchive[0];
  const activeChapter =
    activeVolume.chapters.find((chapter) => chapter.chapterNumber === state.activeChapter) ??
    activeVolume.chapters[0];

  const chapterNav = document.createElement("div");
  chapterNav.className = "chapter-buttons";
  activeVolume.chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = "archive-button archive-button-chapter";
    button.type = "button";
    button.textContent = `Ch. ${chapter.chapterNumber}`;
    button.setAttribute("aria-pressed", String(chapter.chapterNumber === activeChapter?.chapterNumber));
    button.addEventListener("click", () => {
      state.activeChapter = chapter.chapterNumber;
      renderVolumeArchive();
    });
    chapterNav.appendChild(button);
  });

  const plotPanel = document.createElement("div");
  plotPanel.className = "plot-panel";

  const heading = document.createElement("h3");
  heading.textContent = activeChapter ? activeChapter.title : `Volume ${activeVolume.volumeNumber}`;
  plotPanel.appendChild(heading);

  if (activeChapter) {
    if (activeChapter.wardrobe) {
      const wardrobe = document.createElement("p");
      wardrobe.className = "plot-wardrobe";
      wardrobe.textContent = activeChapter.wardrobe;
      plotPanel.appendChild(wardrobe);
    }

    const list = document.createElement("ol");
    list.className = "plot-list";
    activeChapter.plots.forEach((plot) => {
      const item = document.createElement("li");
      item.textContent = plot;
      list.appendChild(item);
    });
    plotPanel.appendChild(list);
  } else {
    const empty = document.createElement("p");
    empty.className = "plot-empty";
    empty.textContent = "No chapter plots have been added for this volume yet.";
    plotPanel.appendChild(empty);
  }

  archive.append(volumeNav, chapterNav, plotPanel);
  popupDetails.replaceChildren(archive);
  popupImage.src = activeVolume.cover;
  popupCaption.textContent = activeChapter
    ? `Volume ${activeVolume.volumeNumber}, ${activeChapter.title}`
    : `Volume ${activeVolume.volumeNumber} cover`;
}

function openDetailPopup(key) {
  setPopupContent(key);
  state.popupOpen = true;
  popupShell.classList.add("is-open");
  popupShell.setAttribute("aria-hidden", "false");
  inspectTrigger.textContent = "Close";
  touchInspect.textContent = "Close";
  resetMovement();
}

function closeDetailPopup() {
  state.popupOpen = false;
  popupShell.classList.remove("is-open");
  popupShell.setAttribute("aria-hidden", "true");
  inspectTrigger.textContent = state.closestHotspot ? "Open" : "None";
  touchInspect.textContent = "Inspect";
}

function openClosestHotspot() {
  if (state.popupOpen) {
    closeDetailPopup();
    return;
  }

  if (!state.closestHotspot) {
    return;
  }

  openDetailPopup(state.closestHotspot.key);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function toggleActiveCharacter() {
  const now = performance.now();
  if (now < state.swapBlockedUntil || state.popupOpen) {
    return;
  }

  state.swapBlockedUntil = now + 240;
  state.activeCharacterId = state.activeCharacterId === "visitor" ? "roommate" : "visitor";
  switchTrigger.textContent = state.activeCharacterId === "visitor" ? "Swap" : "Back";
  const activeCharacter = getActiveCharacter();
  resetMovement();
  state.playerFacing = activeCharacter.root.rotation.y;
  activeCharacter.targetFacing = activeCharacter.root.rotation.y;
}

document.addEventListener("fullscreenchange", () => {
  fullscreenTrigger.textContent = document.fullscreenElement ? "Exit" : "Full";
});

popupBackdrop.addEventListener("click", closeDetailPopup);
popupClose.addEventListener("click", closeDetailPopup);
modeToggle.addEventListener("click", () => {
  state.isNight = !state.isNight;
  shell.dataset.mode = state.isNight ? "night" : "day";
  modeToggle.textContent = state.isNight ? "Day" : "Night";
  applyLighting();
});
switchTrigger.addEventListener("click", toggleActiveCharacter);
inspectTrigger.addEventListener("click", openClosestHotspot);
touchInspect.addEventListener("click", openClosestHotspot);
fullscreenTrigger.addEventListener("click", toggleFullscreen);

function toggleSimplifiedMode() {
  if (state.popupOpen) {
    closeDetailPopup();
  }
  state.simplified = !state.simplified;
  if (state.simplified) {
    shell.setAttribute("data-simplified", "");
    simpleTrigger.textContent = "3D";
    resetMovement();
  } else {
    shell.removeAttribute("data-simplified");
    simpleTrigger.textContent = "Simple";
    clock.getDelta();
    requestAnimationFrame(animate);
  }
}

simpleTrigger.addEventListener("click", toggleSimplifiedMode);

simplePanel.querySelectorAll("[data-open]").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-open");
    openDetailPopup(key);
  });
});

window.addEventListener("mousemove", (event) => {
  state.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  state.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.popupOpen) {
    event.preventDefault();
    closeDetailPopup();
    return;
  }

  const isMoveKey =
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "w" ||
    event.key === "W" ||
    event.key === "a" ||
    event.key === "A" ||
    event.key === "s" ||
    event.key === "S" ||
    event.key === "d" ||
    event.key === "D";

  if (isMoveKey) {
    event.preventDefault();
  }

  if (event.repeat || state.popupOpen) {
    return;
  }

  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    setMoveState("up", true);
  }
  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    setMoveState("down", true);
  }
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    setMoveState("left", true);
  }
  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    setMoveState("right", true);
  }
  if (event.key === "e" || event.key === "E") {
    openClosestHotspot();
  }
  if (event.key === "q" || event.key === "Q") {
    event.preventDefault();
    toggleActiveCharacter();
  }
  if (event.code === "Digit1") {
    event.preventDefault();
    characterSystem.triggerPresetEmote(getActiveCharacter(), "hello", clock.elapsedTime);
  }
  if (event.code === "Digit2") {
    event.preventDefault();
    characterSystem.triggerPresetEmote(getActiveCharacter(), "greet", clock.elapsedTime);
  }
  if (event.code === "Digit3") {
    event.preventDefault();
    characterSystem.triggerPresetEmote(getActiveCharacter(), "joy", clock.elapsedTime);
  }
  if (event.code === "Digit4") {
    event.preventDefault();
    characterSystem.triggerPresetEmote(getActiveCharacter(), "cheer", clock.elapsedTime);
  }
  if (event.code === "Digit5") {
    event.preventDefault();
    const activeCharacter = getActiveCharacter();
    const inactiveCharacter = getInactiveCharacter();
    if (activeCharacter.root.position.distanceTo(inactiveCharacter.root.position) < 1.35) {
      characterSystem.triggerPairedHighFive(activeCharacter, inactiveCharacter, clock.elapsedTime);
      state.lastPairedActionAt = clock.elapsedTime;
    } else {
      characterSystem.triggerPresetEmote(activeCharacter, "love", clock.elapsedTime);
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    event.preventDefault();
  }

  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    setMoveState("up", false);
  }
  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    setMoveState("down", false);
  }
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    setMoveState("left", false);
  }
  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    setMoveState("right", false);
  }
});

window.addEventListener("blur", resetMovement);

app.querySelectorAll("[data-move]").forEach((button) => {
  const direction = button.getAttribute("data-move");
  const press = () => {
    if (!state.popupOpen) {
      setMoveState(direction, true);
    }
  };
  const release = () => setMoveState(direction, false);

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.shadowMap.enabled = false;
renderer.domElement.style.display = "block";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
sceneHost.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c2442);
scene.fog = new THREE.Fog(0x1c2442, 16, 34);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
const cameraTarget = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const cameraOffset = new THREE.Vector3(-5.4, 11.8, 6.1);

function resizeRenderer() {
  const width = sceneHost.clientWidth || window.innerWidth;
  const height = sceneHost.clientHeight || window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

const world = new THREE.Group();
scene.add(world);

const animatedLeaves = [];
const animatedLaundry = [];
const animatedPaperItems = [];
const animatedSteam = [];
const spinningFans = [];
const hangingDecor = [];
const shimmerMaterials = [];

function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createRoundedRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

const woodTexture = makeCanvasTexture(96, 96, (context, width, height) => {
  context.fillStyle = "#e2bb92";
  context.fillRect(0, 0, width, height);

  const plankColors = ["#d0a178", "#d9ac82", "#c99771", "#deb58e", "#c88d68", "#e4bf9b"];
  for (let x = 0; x < width; x += 16) {
    context.fillStyle = plankColors[(x / 16) % plankColors.length];
    context.fillRect(x, 0, 16, height);
    context.fillStyle = "rgba(109, 69, 45, 0.18)";
    context.fillRect(x, 0, 1, height);
    context.fillRect(x + 15, 0, 1, height);

    for (let row = 0; row < 4; row += 1) {
      const knotY = 10 + row * 22 + ((x / 16 + row) % 2) * 4;
      context.strokeStyle = "rgba(120, 76, 48, 0.16)";
      context.lineWidth = 1.2;
      context.beginPath();
      context.ellipse(x + 7 + (row % 3), knotY, 3.2, 1.4, 0.12, 0, Math.PI * 2);
      context.stroke();
    }
  }

  context.strokeStyle = "rgba(255, 245, 233, 0.14)";
  context.lineWidth = 1;
  for (let index = 0; index < 12; index += 1) {
    context.beginPath();
    context.moveTo(0, index * 8 + 4);
    context.bezierCurveTo(24, index * 8 + 2, 64, index * 8 + 8, width, index * 8 + 5);
    context.stroke();
  }
});
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2.8, 2.8);

const balconyTexture = makeCanvasTexture(64, 64, (context, width, height) => {
  context.fillStyle = "#a1a8b8";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#b7bfcb";
  for (let row = 0; row < 8; row += 1) {
    context.fillRect(0, row * 8, width, 1);
  }
  context.fillStyle = "rgba(255, 255, 255, 0.18)";
  for (let row = 0; row < 6; row += 1) {
    context.fillRect(6, 8 + row * 10, width - 12, 1);
  }
  context.fillStyle = "rgba(79, 88, 105, 0.14)";
  for (let dot = 0; dot < 48; dot += 1) {
    const x = (dot * 11) % width;
    const y = (dot * 19) % height;
    context.fillRect(x, y, 2, 2);
  }
});
balconyTexture.wrapS = THREE.RepeatWrapping;
balconyTexture.wrapT = THREE.RepeatWrapping;
balconyTexture.repeat.set(2.4, 2.4);

const blanketTexture = makeCanvasTexture(96, 96, (context, width, height) => {
  context.fillStyle = "#dd8d60";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#7f91cd";
  for (let x = 0; x < width; x += 24) {
    context.fillRect(x, 0, 7, height);
    context.fillRect(x + 10, 0, 3, height);
  }
  context.fillStyle = "#fff5e8";
  for (let y = 0; y < height; y += 24) {
    context.fillRect(0, y, width, 7);
    context.fillRect(0, y + 10, width, 3);
  }
  context.strokeStyle = "rgba(120, 82, 60, 0.18)";
  context.lineWidth = 2;
  context.strokeRect(4, 4, width - 8, height - 8);
  context.strokeStyle = "rgba(255, 255, 255, 0.28)";
  for (let stitch = 0; stitch < 9; stitch += 1) {
    context.beginPath();
    context.moveTo(8 + stitch * 10, 4);
    context.lineTo(11 + stitch * 10, 4);
    context.stroke();
    context.beginPath();
    context.moveTo(8 + stitch * 10, height - 4);
    context.lineTo(11 + stitch * 10, height - 4);
    context.stroke();
  }
});
blanketTexture.wrapS = THREE.RepeatWrapping;
blanketTexture.wrapT = THREE.RepeatWrapping;
blanketTexture.repeat.set(1.2, 1.2);

const wallTexture = makeCanvasTexture(96, 96, (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff3e1");
  gradient.addColorStop(1, "#f1dfcb");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(228, 203, 177, 0.9)";
  for (let x = 0; x < width; x += 12) {
    context.fillRect(x, 0, 1, height);
  }
  context.fillStyle = "rgba(255, 255, 255, 0.42)";
  for (let y = 0; y < height; y += 16) {
    context.fillRect(0, y, width, 1);
  }
  context.fillStyle = "rgba(216, 182, 149, 0.2)";
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      context.fillRect(8 + column * 14, 8 + row * 14, 2, 2);
    }
  }
});
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1.8, 1.8);

const rugTexture = makeCanvasTexture(96, 96, (context, width, height) => {
  context.fillStyle = "#b56c59";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#e8d7c2";
  context.fillRect(10, 10, width - 20, height - 20);
  context.fillStyle = "#d69c77";
  context.fillRect(18, 18, width - 36, height - 36);
  context.strokeStyle = "rgba(122, 72, 57, 0.28)";
  context.lineWidth = 3;
  context.strokeRect(5, 5, width - 10, height - 10);
  context.strokeRect(15, 15, width - 30, height - 30);
  context.fillStyle = "rgba(255, 248, 235, 0.55)";
  for (let index = 0; index < 4; index += 1) {
    context.beginPath();
    context.arc(24 + index * 16, 48, 6, 0, Math.PI * 2);
    context.fill();
  }
});

const screenTexture = makeCanvasTexture(256, 160, (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#90c1ef");
  gradient.addColorStop(0.52, "#e9d4b3");
  gradient.addColorStop(1, "#f7be8f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(255,255,255,0.84)";
  createRoundedRectPath(context, 18, 18, width - 36, height - 36, 22);
  context.fill();
  context.fillStyle = "#52739f";
  context.font = "bold 24px Trebuchet MS";
  context.fillText("Apartment Life", 30, 58);
  context.font = "16px Trebuchet MS";
  context.fillStyle = "#735541";
  context.fillText("warm routines / tiny details", 30, 84);
  context.fillStyle = "#ecae7e";
  createRoundedRectPath(context, 30, 104, 106, 22, 10);
  context.fill();
  context.fillStyle = "#fff6ea";
  context.fillText("room tour", 50, 120);
  context.fillStyle = "#ef8ea2";
  context.beginPath();
  context.arc(196, 64, 18, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#fff9f2";
  context.font = "bold 18px Trebuchet MS";
  context.fillText("♥", 190, 70);
  context.fillStyle = "rgba(74, 109, 146, 0.28)";
  context.fillRect(152, 104, 72, 8);
  context.fillRect(152, 120, 54, 8);
});

const frameTexture = makeCanvasTexture(128, 128, (context, width, height) => {
  context.fillStyle = "#fbf3e8";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#d4e5f7";
  context.fillRect(12, 12, width - 24, height - 24);
  context.fillStyle = "#fffdf7";
  context.beginPath();
  context.arc(62, 50, 20, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#cda57a";
  context.fillRect(28, 74, 68, 18);
  context.fillStyle = "#3d3032";
  context.beginPath();
  context.arc(52, 48, 4, 0, Math.PI * 2);
  context.arc(74, 48, 4, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#de8b7e";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(63, 60, 9, 0.15 * Math.PI, 0.85 * Math.PI, false);
  context.stroke();
  context.fillStyle = "#6ea0c7";
  context.fillRect(20, 98, width - 40, 10);
});

const leafTexture = makeCanvasTexture(96, 128, (context, width, height) => {
  context.clearRect(0, 0, width, height);
  const gradient = context.createLinearGradient(width / 2, 0, width / 2, height);
  gradient.addColorStop(0, "#9dcf85");
  gradient.addColorStop(1, "#4d7e50");
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(width / 2, 4);
  context.bezierCurveTo(width - 4, height * 0.26, width - 10, height * 0.74, width / 2, height - 6);
  context.bezierCurveTo(8, height * 0.74, 2, height * 0.26, width / 2, 4);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(255, 255, 255, 0.45)";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(width / 2, 12);
  context.lineTo(width / 2, height - 12);
  context.stroke();
  context.lineWidth = 2;
  for (let row = 0; row < 4; row += 1) {
    const y = 28 + row * 22;
    context.beginPath();
    context.moveTo(width / 2, y);
    context.lineTo(width / 2 + 18 - row * 3, y + 8);
    context.stroke();
    context.beginPath();
    context.moveTo(width / 2, y + 4);
    context.lineTo(width / 2 - 18 + row * 3, y + 12);
    context.stroke();
  }
});

const materials = {
  roomFloor: new THREE.MeshStandardMaterial({
    color: 0xe0b78c,
    map: woodTexture,
    roughness: 1
  }),
  balconyFloor: new THREE.MeshStandardMaterial({
    color: 0x8b94a6,
    map: balconyTexture,
    roughness: 1
  }),
  wall: new THREE.MeshStandardMaterial({
    color: 0xf4e6d5,
    map: wallTexture,
    roughness: 1
  }),
  trim: new THREE.MeshStandardMaterial({
    color: 0xb88c69,
    roughness: 0.9
  }),
  curtain: new THREE.MeshStandardMaterial({
    color: 0xfff4e4,
    roughness: 1
  }),
  glass: new THREE.MeshStandardMaterial({
    color: 0xb9d8ee,
    transparent: true,
    opacity: 0.22,
    roughness: 0.15
  }),
  rail: new THREE.MeshStandardMaterial({
    color: 0xf4eee6,
    roughness: 0.65
  }),
  rug: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: rugTexture,
    roughness: 1
  }),
  blanket: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: blanketTexture,
    roughness: 1
  }),
  furnitureDark: new THREE.MeshStandardMaterial({
    color: 0x6f4f3e,
    roughness: 0.92
  }),
  furnitureLight: new THREE.MeshStandardMaterial({
    color: 0xbca18a,
    roughness: 0.9
  }),
  cushionBlue: new THREE.MeshStandardMaterial({
    color: 0x6f88bf,
    roughness: 1
  }),
  cushionCream: new THREE.MeshStandardMaterial({
    color: 0xf5ede0,
    roughness: 1
  }),
  orange: new THREE.MeshStandardMaterial({
    color: 0xf0a03b,
    roughness: 0.9
  }),
  bowl: new THREE.MeshStandardMaterial({
    color: 0xf9f5ed,
    roughness: 1
  }),
  cup: new THREE.MeshStandardMaterial({
    color: 0x8bb2d1,
    roughness: 0.9
  }),
  plantPot: new THREE.MeshStandardMaterial({
    color: 0x7b4a3a,
    roughness: 1
  }),
  leaf: new THREE.MeshStandardMaterial({
    color: 0x6c9a69,
    map: leafTexture,
    transparent: true,
    alphaTest: 0.12,
    side: THREE.DoubleSide,
    roughness: 0.92
  }),
  sky: new THREE.MeshBasicMaterial({
    color: 0x2b3562
  }),
  cloud: new THREE.MeshBasicMaterial({
    color: 0x6170a8,
    transparent: true,
    opacity: 0.86
  }),
  skyline: new THREE.MeshStandardMaterial({
    color: 0x283147,
    roughness: 1
  }),
  screen: new THREE.MeshBasicMaterial({
    map: screenTexture
  }),
  paper: new THREE.MeshBasicMaterial({
    map: frameTexture
  }),
  metal: new THREE.MeshStandardMaterial({
    color: 0x8d97a8,
    roughness: 0.72,
    metalness: 0.08
  }),
  softBlack: new THREE.MeshStandardMaterial({
    color: 0x34343a,
    roughness: 0.88
  }),
  notePaper: new THREE.MeshStandardMaterial({
    color: 0xfff3dd,
    roughness: 0.92
  })
};

const ambientLight = new THREE.AmbientLight(0xd7dff8, 1.2);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xfff0db, 0x506085, 1.25);
scene.add(hemisphereLight);

const sunLight = new THREE.DirectionalLight(0xa6beff, 1.5);
sunLight.position.set(6, 12, 8);
scene.add(sunLight);

const roomLight = new THREE.PointLight(0xffddb8, 1.05, 28);
roomLight.position.set(0.1, 3.1, 0.2);
scene.add(roomLight);

const windowLight = new THREE.PointLight(0xfff1cf, 0.9, 16);
windowLight.position.set(6.3, 2.6, 0);
scene.add(windowLight);

const lanternLight = new THREE.PointLight(0xffca8f, 0.45, 10);
lanternLight.position.set(12.8, 2.4, -2.2);
scene.add(lanternLight);

const balconyFillLight = new THREE.PointLight(0x8eb0ea, 0.42, 18);
balconyFillLight.position.set(11.6, 1.8, 0.2);
scene.add(balconyFillLight);

function createBox(width, height, depth, material, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.copy(position);
  world.add(mesh);
  return mesh;
}

function createCylinder(radiusTop, radiusBottom, height, material, position, radialSegments = 12) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
    material
  );
  mesh.position.copy(position);
  world.add(mesh);
  return mesh;
}

function isPointInArea(position, area) {
  return (
    position.x >= area.minX &&
    position.x <= area.maxX &&
    position.z >= area.minZ &&
    position.z <= area.maxZ
  );
}

function shiftWorldObjectsInArea(area, offset) {
  world.traverse((object) => {
    if (object.parent === world && object.position.y > 0.025 && isPointInArea(object.position, area)) {
      object.position.x += offset.x;
      object.position.z += offset.z;
    }
  });

  animatedSteam.forEach((puff) => {
    if (isPointInArea(puff.origin, area)) {
      puff.origin.x += offset.x;
      puff.origin.z += offset.z;
    }
  });

  animatedPaperItems.forEach((paper) => {
    if (isPointInArea(paper.mesh.position, area)) {
      paper.baseY = paper.mesh.position.y;
    }
  });
}

function createPlant(position, scale = 1, options = {}) {
  const { leafCount = 12, potColor = 0x7b4a3a } = options;
  const group = new THREE.Group();
  group.position.copy(position);

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26 * scale, 0.34 * scale, 0.42 * scale, 10),
    new THREE.MeshStandardMaterial({ color: potColor, roughness: 1 })
  );
  pot.position.y = 0.22 * scale;
  group.add(pot);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.28 * scale, 0.03 * scale, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0x9e715a, roughness: 0.92 })
  );
  rim.position.y = 0.42 * scale;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24 * scale, 0.24 * scale, 0.05 * scale, 12),
    new THREE.MeshStandardMaterial({ color: 0x584237, roughness: 1 })
  );
  soil.position.y = 0.42 * scale;
  group.add(soil);

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x567349, roughness: 0.96 });
  for (let index = 0; index < leafCount; index += 1) {
    const angle = (index / leafCount) * Math.PI * 2;
    const heightOffset = 0.52 * scale + (index % 4) * 0.12 * scale;
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012 * scale, 0.018 * scale, 0.44 * scale, 6),
      stemMat
    );
    stem.position.set(
      Math.cos(angle) * 0.06 * scale,
      0.5 * scale + (index % 4) * 0.08 * scale,
      Math.sin(angle) * 0.06 * scale
    );
    stem.rotation.z = Math.cos(angle) * 0.36;
    stem.rotation.x = Math.sin(angle) * 0.18;
    group.add(stem);

    const leaf = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22 * scale, 0.42 * scale),
      materials.leaf
    );
    leaf.position.set(
      Math.cos(angle) * 0.14 * scale,
      heightOffset,
      Math.sin(angle) * 0.14 * scale
    );
    leaf.rotation.y = angle + Math.PI / 2;
    leaf.rotation.z = Math.cos(angle) * 0.82;
    leaf.rotation.x = 0.14 + Math.sin(angle) * 0.18;
    group.add(leaf);

    animatedLeaves.push({
      mesh: leaf,
      baseRotationX: leaf.rotation.x,
      baseRotationZ: leaf.rotation.z,
      baseY: leaf.position.y,
      phase: index * 0.47 + scale,
      sway: 0.04 + (index % 3) * 0.01
    });
  }

  world.add(group);
  return group;
}

function createPillow(position, material, rotationY = 0) {
  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.18, 0.78),
    material
  );
  pillow.position.copy(position);
  pillow.rotation.y = rotationY;
  world.add(pillow);
  return pillow;
}

function createCup(position) {
  const cup = new THREE.Group();
  cup.position.copy(position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.18, 14),
    materials.cup
  );
  base.position.y = 0.09;
  cup.add(base);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.016, 6, 16, Math.PI),
    materials.cup
  );
  handle.position.set(0.11, 0.11, 0);
  handle.rotation.z = -Math.PI / 2;
  cup.add(handle);

  world.add(cup);
  return cup;
}

function createBook(position, color, rotation = 0) {
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.05, 0.46),
    new THREE.MeshStandardMaterial({ color, roughness: 0.92 })
  );
  book.position.copy(position);
  book.rotation.y = rotation;
  world.add(book);
  return book;
}

function createSteamEmitter(position, count = 6, radius = 0.18) {
  const puffs = [];
  for (let index = 0; index < count; index += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + (index % 2) * 0.02, 10, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      })
    );
    puff.position.copy(position);
    puff.scale.set(0.65, 0.85, 0.65);
    world.add(puff);
    animatedSteam.push({
      mesh: puff,
      origin: position.clone(),
      phase: index / count,
      speed: 0.35 + index * 0.02,
      drift: (index % 2 === 0 ? -1 : 1) * (0.08 + index * 0.01),
      height: 0.55 + index * 0.06,
      radius
    });
    puffs.push(puff);
  }
  return puffs;
}

function createDeskFan(position, rotationY = 0) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = rotationY;

  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.05, 0.28, 10),
    materials.metal
  );
  stand.position.y = 0.14;
  group.add(stand);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.22, 0.05, 18),
    materials.metal
  );
  base.position.y = 0.03;
  group.add(base);

  const cage = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.015, 6, 24),
    materials.metal
  );
  cage.position.y = 0.34;
  cage.rotation.x = Math.PI / 2;
  group.add(cage);

  const spinner = new THREE.Group();
  spinner.position.y = 0.34;
  for (let index = 0; index < 4; index += 1) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.01, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xcfd7e2, roughness: 0.55, metalness: 0.04 })
    );
    blade.position.z = 0.08;
    blade.rotation.x = Math.PI / 7;
    blade.rotation.y = (Math.PI / 2) * index;
    spinner.add(blade);
  }

  const hub = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 10, 10),
    materials.softBlack
  );
  spinner.add(hub);
  group.add(spinner);

  world.add(group);
  spinningFans.push({ mesh: spinner, speed: 10 + rotationY * 2 });
  return group;
}

function createPhotoString(start, end, count = 5) {
  createCableLine([start, end], 0x70574d);

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.36),
      new THREE.MeshStandardMaterial({
        color: [0xfff4db, 0xf4d8d0, 0xe3eefb][index % 3],
        roughness: 0.96,
        side: THREE.DoubleSide
      })
    );
    card.position.copy(start.clone().lerp(end, t));
    card.position.y -= 0.18 + (index % 2) * 0.03;
    card.rotation.y = Math.PI / 2;
    card.rotation.z = -0.08 + index * 0.04;
    world.add(card);

    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.05, 0.02),
      materials.trim
    );
    clip.position.copy(card.position);
    clip.position.y += 0.2;
    clip.position.x += 0.01;
    world.add(clip);

    animatedPaperItems.push({
      mesh: card,
      baseRotationZ: card.rotation.z,
      baseY: card.position.y,
      phase: index * 0.63
    });
  }
}

function createStreetLamp(position, height = 2.6) {
  const group = new THREE.Group();
  group.position.copy(position);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, height, 10),
    new THREE.MeshStandardMaterial({ color: 0x505769, roughness: 0.9 })
  );
  pole.position.y = height / 2;
  group.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.05, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x505769, roughness: 0.9 })
  );
  arm.position.set(0.26, height - 0.18, 0);
  group.add(arm);

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 10, 10),
    new THREE.MeshStandardMaterial({
      color: 0xffe7b8,
      emissive: 0xffc874,
      emissiveIntensity: 0.45,
      roughness: 0.7
    })
  );
  lamp.position.set(0.54, height - 0.2, 0);
  group.add(lamp);

  world.add(group);
  return { group, lamp };
}

function createPowerLine(start, end, sag = 0.2) {
  const midpoint = start.clone().lerp(end, 0.5);
  midpoint.y -= sag;
  const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
  const points = curve.getPoints(12);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x454b5b, transparent: true, opacity: 0.8 })
  );
  world.add(line);
  return line;
}

function createCableLine(points, color = 0x3f3e43) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.88 })
  );
  world.add(line);
  return line;
}

function createBubbleTexture(symbol, fill) {
  return makeCanvasTexture(256, 192, (context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = fill;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 10;
    createRoundedRectPath(context, 20, 18, width - 40, height - 54, 40);
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(width * 0.5 - 16, height - 38);
    context.lineTo(width * 0.5 + 6, height - 38);
    context.lineTo(width * 0.5 - 8, height - 12);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = "#ffffff";
    const fontSize = symbol.length > 2 ? 56 : symbol.length > 1 ? 72 : 88;
    context.font = `bold ${fontSize}px Trebuchet MS`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(symbol, width / 2, height / 2 - 8);
  });
}

const characterSystem = createCharacterSystem({
  world,
  camera,
  makeCanvasTexture,
  createBubbleTexture
});

function triggerPresetEmote(character, type, elapsedTime) {
  const presets = {
    hello: { symbol: "Hi", color: "#7eb4dc", until: 1.15, motion: "wave" },
    greet: { symbol: "Yo", color: "#f2c57f", until: 1.1, motion: "bow" },
    joy: { symbol: "♪", color: "#ef8fa1", until: 1.2, motion: "jump" },
    surprise: { symbol: "!", color: "#f2a66e", until: 0.9, motion: "hop" },
    cheer: { symbol: "★", color: "#f2c57f", until: 1.15, motion: "cheer" },
    love: { symbol: "♥", color: "#ef8fa1", until: 1.2, motion: "sway" }
  };

  const preset = presets[type];
  if (!preset) {
    return;
  }

  setCharacterEmote(character, preset.symbol, preset.color, preset.until, elapsedTime);
  setCharacterAction(character, preset.motion, preset.until, elapsedTime);
}

function triggerPairedHighFive(characterA, characterB, elapsedTime) {
  const characterAIsLeft = characterA.root.position.x <= characterB.root.position.x;
  const actionA = characterAIsLeft ? "high-five-right" : "high-five-left";
  const actionB = characterAIsLeft ? "high-five-left" : "high-five-right";

  setCharacterEmote(characterA, "✋", "#f2c57f", 0.95, elapsedTime);
  setCharacterEmote(characterB, "✋", "#7eb4dc", 0.95, elapsedTime);
  setCharacterAction(characterA, actionA, 0.95, elapsedTime);
  setCharacterAction(characterB, actionB, 0.95, elapsedTime);
}

function createHotspot({ key, position, symbol, color }) {
  const group = new THREE.Group();
  group.position.copy(position);

  const texture = createBubbleTexture(symbol, color);
  const bubble = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.9),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1
    })
  );
  bubble.position.y = 0.2;

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.42;

  group.add(bubble);
  group.add(glow);
  world.add(group);

  return {
    key,
    group,
    bubble,
    glow,
    basePosition: position.clone(),
    radius: 1.95
  };
}



const roomFloor = createBox(11.8, 0.22, 10.6, materials.roomFloor, new THREE.Vector3(-1.1, -0.11, -0.7));
const balconyFloor = createBox(7.6, 0.2, 10, materials.balconyFloor, new THREE.Vector3(8.9, -0.1, 0));
roomFloor.receiveShadow = true;
balconyFloor.receiveShadow = true;

const floorSeamMaterial = new THREE.MeshBasicMaterial({ color: 0x9f6743, transparent: true, opacity: 0.2 });
for (let x = -6.55; x <= 4.3; x += 1.25) {
  createBox(0.018, 0.012, 10.2, floorSeamMaterial, new THREE.Vector3(x, 0.012, -0.72));
}
for (let z = -5.55; z <= 4.25; z += 1.18) {
  createBox(11.3, 0.012, 0.018, floorSeamMaterial, new THREE.Vector3(-1.1, 0.014, z));
}
for (let x = -6.1; x <= 3.95; x += 1.25) {
  for (let z = -5.1; z <= 3.85; z += 1.18) {
    const grain = createBox(
      0.36,
      0.01,
      0.035,
      new THREE.MeshBasicMaterial({ color: 0x8e5b3d, transparent: true, opacity: 0.12 }),
      new THREE.Vector3(x + 0.24, 0.022, z + 0.1)
    );
    grain.rotation.y = (x + z) % 2 === 0 ? 0.08 : -0.08;
  }
}

createBox(0.22, 0.72, 10.6, materials.wall, new THREE.Vector3(-7.1, 0.36, -0.7));
createBox(11.8, 0.72, 0.22, materials.wall, new THREE.Vector3(-1.1, 0.36, -6.1));
createBox(4.8, 0.72, 0.22, materials.wall, new THREE.Vector3(-3.05, 0.36, 4.65));
createBox(2.55, 0.72, 0.22, materials.wall, new THREE.Vector3(3.32, 0.36, 4.65));
createBox(11.35, 0.12, 0.12, materials.trim, new THREE.Vector3(-1.08, 0.06, -5.9));
createBox(4.55, 0.12, 0.12, materials.trim, new THREE.Vector3(-3.06, 0.06, 4.48));
createBox(2.38, 0.12, 0.12, materials.trim, new THREE.Vector3(3.32, 0.06, 4.48));
createBox(0.12, 0.12, 10.25, materials.trim, new THREE.Vector3(-6.96, 0.06, -0.72));
createBox(11.35, 0.08, 0.12, materials.trim, new THREE.Vector3(-1.08, 0.76, -5.9));
createBox(0.12, 0.08, 10.25, materials.trim, new THREE.Vector3(-6.96, 0.76, -0.72));
createBox(0.16, 0.82, 8.75, materials.trim, new THREE.Vector3(4.86, 0.41, -0.55));
createBox(0.26, 0.78, 8.75, materials.wall, new THREE.Vector3(5.02, 0.39, -0.55));
createBox(7.6, 1.15, 0.22, materials.wall, new THREE.Vector3(8.9, 0.58, -5.1));
createBox(7.6, 1.15, 0.22, materials.wall, new THREE.Vector3(8.9, 0.58, 5.1));
createBox(0.12, 0.08, 10, materials.rail, new THREE.Vector3(12.68, 1.05, 0));
createBox(0.1, 0.74, 0.1, materials.rail, new THREE.Vector3(12.68, 0.67, -3.9));
createBox(0.1, 0.74, 0.1, materials.rail, new THREE.Vector3(12.68, 0.67, -1.3));
createBox(0.1, 0.74, 0.1, materials.rail, new THREE.Vector3(12.68, 0.67, 1.3));
createBox(0.1, 0.74, 0.1, materials.rail, new THREE.Vector3(12.68, 0.67, 3.9));

const leftDoor = createBox(0.06, 2.55, 2.35, materials.glass, new THREE.Vector3(6.86, 1.28, -1.46));
const rightDoor = createBox(0.06, 2.55, 2.35, materials.glass, new THREE.Vector3(6.86, 1.28, 1.46));
createBox(0.24, 0.22, 6.7, materials.trim, new THREE.Vector3(6.7, 2.76, 0));
createBox(0.62, 2.64, 0.24, materials.wall, new THREE.Vector3(6.56, 1.32, -3.54));
createBox(0.62, 2.64, 0.24, materials.wall, new THREE.Vector3(6.56, 1.32, 3.54));
createBox(0.18, 2.72, 0.2, materials.trim, new THREE.Vector3(6.38, 1.36, -3.32));
createBox(0.18, 2.72, 0.2, materials.trim, new THREE.Vector3(6.38, 1.36, 3.32));
createBox(0.38, 0.16, 6.86, materials.trim, new THREE.Vector3(6.48, 2.64, 0));

const leftCurtain = createBox(0.16, 2.64, 1.7, materials.curtain, new THREE.Vector3(6.44, 1.32, -2.36));
const rightCurtain = createBox(0.16, 2.64, 1.7, materials.curtain, new THREE.Vector3(6.44, 1.32, 2.36));
[-3.02, -2.78, -2.54, -2.3, -2.06, -1.82, 1.82, 2.06, 2.3, 2.54, 2.78, 3.02].forEach((z, index) => {
  const fold = createBox(
    0.07,
    2.48,
    0.045,
    new THREE.MeshStandardMaterial({
      color: index < 6 ? 0xf1e7dc : 0xfff4e8,
      roughness: 0.98
    }),
    new THREE.Vector3(6.28 + (index % 2) * 0.035, 1.32, z)
  );
  fold.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.035;
});
[-2.42, 2.42].forEach((z) => {
  createBox(0.18, 0.08, 1.85, new THREE.MeshStandardMaterial({ color: 0xe9ddd2, roughness: 1 }), new THREE.Vector3(6.31, 0.1, z));
  createBox(0.18, 0.08, 1.74, new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 1 }), new THREE.Vector3(6.3, 2.56, z));
});
createBox(0.14, 2.8, 0.14, materials.trim, new THREE.Vector3(6.41, 1.4, -3.42));
createBox(0.14, 2.8, 0.14, materials.trim, new THREE.Vector3(6.41, 1.4, 3.42));

const coverWindowGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(3.1, 2.4),
  new THREE.MeshBasicMaterial({ color: 0xfffbf5, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
);
coverWindowGlass.position.set(-1.08, 1.3, -5.82);
world.add(coverWindowGlass);
createBox(0.06, 2.42, 0.08, materials.trim, new THREE.Vector3(-2.62, 1.32, -5.78));
createBox(0.06, 2.42, 0.08, materials.trim, new THREE.Vector3(0.46, 1.32, -5.78));
createBox(3.14, 0.06, 0.08, materials.trim, new THREE.Vector3(-1.08, 2.54, -5.78));
createBox(3.14, 0.06, 0.08, materials.trim, new THREE.Vector3(-1.08, 0.14, -5.78));
createBox(0.05, 2.32, 0.08, materials.trim, new THREE.Vector3(-1.08, 1.34, -5.77));
[-3.76, -3.48, -3.22, -2.94, 0.84, 1.12, 1.4, 1.68].forEach((x, index) => {
  const curtainFold = createBox(
    0.12,
    2.6,
    0.1,
    new THREE.MeshStandardMaterial({ color: index < 4 ? 0xf8eee1 : 0xfff7ea, roughness: 1 }),
    new THREE.Vector3(x, 1.28, -5.64)
  );
  curtainFold.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.045;
});
createCylinder(
  0.3,
  0.22,
  0.18,
  new THREE.MeshStandardMaterial({ color: 0xfff1d5, emissive: 0xffdfa5, emissiveIntensity: 0.22, roughness: 0.72 }),
  new THREE.Vector3(1.2, 3.18, 0.15),
  18
);
createCylinder(
  0.08,
  0.08,
  0.42,
  materials.trim,
  new THREE.Vector3(1.2, 2.92, 0.15),
  12
);
createBox(0.54, 0.06, 0.54, new THREE.MeshStandardMaterial({ color: 0xfff5e9, roughness: 0.82 }), new THREE.Vector3(1.2, 2.78, 0.15));

createBox(0.9, 0.25, 0.35, materials.furnitureLight, new THREE.Vector3(5.95, 0.7, 4.55));
createBox(0.75, 1.2, 0.35, materials.furnitureDark, new THREE.Vector3(5.95, 0.62, 4.35));
createPlant(new THREE.Vector3(5.9, 0, 4.7), 0.65);
createBox(0.16, 0.05, 0.42, materials.furnitureDark, new THREE.Vector3(5.45, 0.05, 4.65));
createBox(0.14, 0.05, 0.36, materials.furnitureDark, new THREE.Vector3(5.6, 0.05, 4.95));

createBox(1.65, 0.16, 0.95, materials.furnitureLight, new THREE.Vector3(-5.1, 0.56, -3));
createBox(1.2, 0.78, 0.46, materials.furnitureDark, new THREE.Vector3(-5.1, 0.41, -3.6));
const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.68), materials.screen);
tvScreen.position.set(-5.1, 1.07, -3.34);
tvScreen.rotation.y = Math.PI / 2;
world.add(tvScreen);
const tvLedMaterial = new THREE.MeshStandardMaterial({
  color: 0x2d2d33,
  emissive: 0xffab7f,
  emissiveIntensity: 0.14,
  roughness: 0.48
});
createCylinder(0.02, 0.02, 0.02, tvLedMaterial, new THREE.Vector3(-4.51, 0.76, -3.28), 8);
shimmerMaterials.push({ material: tvLedMaterial, min: 0.08, max: 0.22, speed: 1.8, phase: 0.3 });
createBook(new THREE.Vector3(-4.64, 0.67, -2.86), 0x97b6d8, 0.1);
createBook(new THREE.Vector3(-5.52, 0.67, -2.86), 0xf0b47b, -0.15);
createBox(0.22, 0.05, 0.1, materials.furnitureDark, new THREE.Vector3(-4.85, 0.66, -2.54));
createBox(0.3, 0.14, 0.18, materials.cushionCream, new THREE.Vector3(-5.55, 0.71, -2.48));
createBox(0.16, 0.03, 0.08, materials.furnitureDark, new THREE.Vector3(-5.48, 0.8, -2.42));
createBox(0.34, 0.06, 0.18, materials.furnitureDark, new THREE.Vector3(-5.95, 0.06, -1.22));
createBox(0.34, 0.06, 0.18, materials.furnitureDark, new THREE.Vector3(-5.58, 0.06, -1.12));
createBox(0.24, 0.06, 0.14, new THREE.MeshStandardMaterial({ color: 0x596a83, roughness: 0.88 }), new THREE.Vector3(-5.32, 0.08, -1.34));
createBox(0.24, 0.06, 0.14, new THREE.MeshStandardMaterial({ color: 0x413636, roughness: 0.88 }), new THREE.Vector3(-5.74, 0.08, -1.26));

createBox(3.7, 0.08, 3.3, materials.rug, new THREE.Vector3(-1.5, 0.04, 1.55));
createBox(2.3, 0.42, 2.15, materials.blanket, new THREE.Vector3(-1.5, 0.42, 1.55));
createBox(3.15, 0.08, 3.05, materials.blanket, new THREE.Vector3(-1.5, 0.2, 1.55));
createBox(3.42, 0.06, 3.34, new THREE.MeshStandardMaterial({ color: 0x2f2930, roughness: 0.96 }), new THREE.Vector3(-1.5, 0.08, 1.55));
createBox(3.16, 0.072, 3.08, materials.blanket, new THREE.Vector3(-1.5, 0.14, 1.55));
createBox(1.7, 0.16, 1.7, materials.furnitureLight, new THREE.Vector3(-1.5, 0.72, 1.55));
createPillow(new THREE.Vector3(-2.55, 0.12, 0.92), materials.cushionBlue, 0.25);
createPillow(new THREE.Vector3(-0.3, 0.12, 2.45), materials.cushionCream, -0.2);
createPillow(new THREE.Vector3(-2.6, 0.12, 2.55), materials.cushionCream, 0.1);
createCup(new THREE.Vector3(-1.12, 0.81, 1.04));
createCup(new THREE.Vector3(-1.82, 0.81, 2.02));

const hotpot = createCylinder(0.38, 0.42, 0.22, materials.furnitureDark, new THREE.Vector3(-1.5, 0.89, 1.55));
hotpot.scale.set(1, 0.45, 1);
const broth = new THREE.Mesh(
  new THREE.CylinderGeometry(0.34, 0.34, 0.05, 20),
  new THREE.MeshStandardMaterial({ color: 0xc8d59b, roughness: 0.8 })
);
broth.position.set(-1.5, 0.95, 1.55);
world.add(broth);
createSteamEmitter(new THREE.Vector3(-1.5, 1.02, 1.55), 7, 0.22);
for (let index = 0; index < 5; index += 1) {
  const ingredient = createBox(
    0.08,
    0.022,
    0.22,
    new THREE.MeshStandardMaterial({
      color: [0xf4d7c8, 0xeaa3a0, 0xf7e2b8, 0x9fbe83, 0xe9d9b0][index],
      roughness: 0.82
    }),
    new THREE.Vector3(-1.68 + index * 0.08, 0.99, 1.48 + (index % 2) * 0.1)
  );
  ingredient.rotation.y = -0.35 + index * 0.16;
}
createCylinder(0.07, 0.07, 0.03, materials.orange, new THREE.Vector3(-2.28, 0.82, 0.96));
createCylinder(0.07, 0.07, 0.03, materials.orange, new THREE.Vector3(-2.5, 0.82, 1.12));
createCylinder(0.07, 0.07, 0.03, materials.orange, new THREE.Vector3(-1.03, 0.82, 2.78));
createCylinder(0.07, 0.07, 0.03, materials.orange, new THREE.Vector3(-0.78, 0.82, 2.72));
createBox(0.22, 0.08, 0.16, materials.bowl, new THREE.Vector3(-0.94, 0.81, 2.1));
createBox(0.2, 0.06, 0.35, materials.furnitureDark, new THREE.Vector3(-2.12, 0.84, 1.86));
createBox(0.18, 0.06, 0.32, materials.furnitureDark, new THREE.Vector3(-0.92, 0.84, 1.38));
createBox(0.24, 0.1, 0.16, materials.cushionCream, new THREE.Vector3(-2.06, 0.82, 1.12));
createBox(0.18, 0.04, 0.12, materials.furnitureDark, new THREE.Vector3(-1.1, 0.82, 1.82));
createBox(0.24, 0.12, 0.14, new THREE.MeshStandardMaterial({ color: 0xebd8bb, roughness: 0.92 }), new THREE.Vector3(-2.52, 0.83, 1.66));
createBox(0.2, 0.03, 0.12, new THREE.MeshStandardMaterial({ color: 0xc67f69, roughness: 0.8 }), new THREE.Vector3(-2.52, 0.9, 1.66));
createBox(0.72, 0.045, 0.34, new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.9 }), new THREE.Vector3(0.12, 0.84, 1.42));
for (let index = 0; index < 7; index += 1) {
  createBox(
    0.05,
    0.025,
    0.28,
    new THREE.MeshStandardMaterial({ color: 0xeaa29c, roughness: 0.72 }),
    new THREE.Vector3(-0.12 + index * 0.075, 0.89, 1.42)
  );
}
createBox(0.02, 0.02, 0.28, materials.softBlack, new THREE.Vector3(-2.36, 0.91, 1.78));
createBox(0.02, 0.02, 0.28, materials.softBlack, new THREE.Vector3(-2.3, 0.91, 1.8));
createBox(0.02, 0.02, 0.32, materials.softBlack, new THREE.Vector3(0.36, 0.91, 1.1));
createBox(0.02, 0.02, 0.32, materials.softBlack, new THREE.Vector3(0.42, 0.91, 1.12));
createBox(0.26, 0.03, 0.46, new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.85 }), new THREE.Vector3(-3.95, 0.05, 0.1));
createBox(0.42, 0.04, 0.28, new THREE.MeshStandardMaterial({ color: 0xf5f1e7, roughness: 0.95 }), new THREE.Vector3(-4.46, 0.05, 0.38));
createBox(0.18, 0.06, 0.18, new THREE.MeshStandardMaterial({ color: 0x4c7cb3, roughness: 0.92 }), new THREE.Vector3(-4.78, 0.06, 0.44));
createBox(0.32, 0.04, 0.22, new THREE.MeshStandardMaterial({ color: 0xf7f0e2, roughness: 0.95 }), new THREE.Vector3(-4.2, 0.05, 0.56));
createCylinder(
  0.11,
  0.12,
  0.42,
  new THREE.MeshStandardMaterial({ color: 0x7d4e32, roughness: 0.88 }),
  new THREE.Vector3(-2.86, 0.92, 1.34),
  14
);
createBox(0.16, 0.05, 0.16, new THREE.MeshStandardMaterial({ color: 0xe6d8bb, roughness: 0.8 }), new THREE.Vector3(-2.86, 1.16, 1.34));
createBox(0.88, 0.08, 0.62, new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.9 }), new THREE.Vector3(-0.38, 0.82, 2.16));
createBox(0.42, 0.06, 0.16, new THREE.MeshStandardMaterial({ color: 0xb8d39c, roughness: 0.9 }), new THREE.Vector3(-0.22, 0.89, 2.1));
createBox(0.26, 0.06, 0.12, new THREE.MeshStandardMaterial({ color: 0x8cb26d, roughness: 0.9 }), new THREE.Vector3(-0.56, 0.89, 2.2));
createBox(0.18, 0.16, 0.18, new THREE.MeshStandardMaterial({ color: 0xf3eee2, roughness: 0.92 }), new THREE.Vector3(0.22, 0.84, 1.06));
createBox(0.16, 0.02, 0.24, new THREE.MeshStandardMaterial({ color: 0xe8c45d, roughness: 0.88 }), new THREE.Vector3(-0.88, 0.82, 2.68));
createBox(0.3, 0.04, 0.12, new THREE.MeshStandardMaterial({ color: 0xd6d2c4, roughness: 0.92 }), new THREE.Vector3(-2.46, 0.82, 2.04));
createBook(new THREE.Vector3(0.82, 0.05, 3.05), 0xd6c9b7, 0.18);
createBook(new THREE.Vector3(0.9, 0.1, 3.18), 0xf1dfbe, 0.08);
createBook(new THREE.Vector3(1.0, 0.15, 3.3), 0xd2a97c, -0.06);
createBox(0.38, 0.06, 0.12, new THREE.MeshStandardMaterial({ color: 0x20232b, roughness: 0.84 }), new THREE.Vector3(1.05, 0.19, 3.18));
createBox(0.72, 0.035, 0.52, new THREE.MeshStandardMaterial({ color: 0xf8f4eb, roughness: 0.95 }), new THREE.Vector3(0.28, 0.84, 2.48));
createBox(0.26, 0.045, 0.18, new THREE.MeshStandardMaterial({ color: 0x43515f, roughness: 0.86 }), new THREE.Vector3(0.14, 0.89, 2.44));
createBox(0.2, 0.04, 0.14, new THREE.MeshStandardMaterial({ color: 0xf2dfb6, roughness: 0.9 }), new THREE.Vector3(0.47, 0.89, 2.58));
createBox(0.14, 0.02, 0.44, new THREE.MeshStandardMaterial({ color: 0x1f252d, roughness: 0.8 }), new THREE.Vector3(0.94, 0.86, 2.44));
createBox(0.3, 0.035, 0.22, new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.95 }), new THREE.Vector3(-2.42, 0.84, 0.78));
createBox(0.24, 0.035, 0.16, new THREE.MeshStandardMaterial({ color: 0xd54643, roughness: 0.82 }), new THREE.Vector3(-2.72, 0.84, 0.72));
createCylinder(0.06, 0.06, 0.12, new THREE.MeshStandardMaterial({ color: 0xd49a2f, roughness: 0.8 }), new THREE.Vector3(-2.84, 0.9, 1.78), 12);
createCylinder(0.045, 0.045, 0.08, new THREE.MeshStandardMaterial({ color: 0xd95343, roughness: 0.8 }), new THREE.Vector3(-2.84, 1.0, 1.78), 12);

const kotatsuShift = new THREE.Vector3(-1.15, 0, -2.02);
shiftWorldObjectsInArea(
  {
    minX: -4.9,
    maxX: 1.45,
    minZ: 0.2,
    maxZ: 3.55
  },
  kotatsuShift
);

createBox(0.98, 1.72, 0.52, new THREE.MeshStandardMaterial({ color: 0x8e5140, roughness: 0.92 }), new THREE.Vector3(4.7, 0.86, -4.1));
createBox(0.9, 0.05, 0.46, materials.furnitureLight, new THREE.Vector3(4.7, 0.52, -4.1));
createBox(0.9, 0.05, 0.46, materials.furnitureLight, new THREE.Vector3(4.7, 1.03, -4.1));
createBox(0.9, 0.05, 0.46, materials.furnitureLight, new THREE.Vector3(4.7, 1.46, -4.1));
[0xf2c493, 0x9aaf84, 0xd2a3b5, 0xb2c2d9, 0x30313a].forEach((color, index) => {
  createBox(
    0.075,
    0.36 + (index % 2) * 0.08,
    0.16,
    new THREE.MeshStandardMaterial({ color, roughness: 0.9 }),
    new THREE.Vector3(4.42 + index * 0.12, 1.25, -3.86)
  );
});
createBox(0.52, 0.42, 0.34, new THREE.MeshStandardMaterial({ color: 0x7f8794, roughness: 0.94 }), new THREE.Vector3(4.95, 0.75, -3.84));
createBox(0.46, 0.06, 0.22, new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.9 }), new THREE.Vector3(4.95, 1.02, -3.84));
createPlant(new THREE.Vector3(4.95, 1.43, -3.86), 0.28);
createBox(0.34, 0.42, 0.52, new THREE.MeshStandardMaterial({ color: 0x788491, roughness: 0.94 }), new THREE.Vector3(4.04, 0.24, -3.62));
createBook(new THREE.Vector3(4.04, 0.5, -3.5), 0x9ba9ba, 0);
createBook(new THREE.Vector3(4.04, 0.56, -3.72), 0xd3a97a, 0);
createBox(0.64, 0.08, 0.34, new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.86 }), new THREE.Vector3(3.35, 0.08, -2.66));
for (let index = 0; index < 3; index += 1) {
  createBox(0.07, 0.02, 0.1, materials.softBlack, new THREE.Vector3(3.17 + index * 0.16, 0.14, -2.66));
}
createCableLine(
  [
    new THREE.Vector3(4.88, 0.92, -3.78),
    new THREE.Vector3(4.46, 0.16, -3.22),
    new THREE.Vector3(3.96, 0.1, -2.84),
    new THREE.Vector3(3.35, 0.12, -2.66),
    new THREE.Vector3(2.34, 0.1, -1.42),
    new THREE.Vector3(0.92, 0.1, -0.72)
  ],
  0x26242a
);

createCableLine(
  [
    new THREE.Vector3(-4.58, 0.1, 0.16),
    new THREE.Vector3(-3.62, 0.1, 0.18),
    new THREE.Vector3(-2.86, 0.1, 0.78),
    new THREE.Vector3(-1.54, 0.1, 0.82)
  ],
  0x2f2a2d
);

const shelf = new THREE.Group();
shelf.position.set(3.68, 0.36, -4.08);
world.add(shelf);

const calendar = new THREE.Mesh(
  new THREE.PlaneGeometry(0.62, 0.82),
  new THREE.MeshBasicMaterial({
    map: makeCanvasTexture(128, 160, (context, width, height) => {
      context.fillStyle = "#fff6eb";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#ef8f77";
      context.fillRect(0, 0, width, 32);
      context.fillStyle = "#61423a";
      context.font = "bold 18px Trebuchet MS";
      context.fillText("Tomorrow", 16, 22);
      context.fillStyle = "#a78b75";
      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          context.fillRect(18 + column * 22, 54 + row * 22, 14, 14);
        }
      }
    })
  })
);
calendar.position.set(-6.85, 2.1, -1.6);
calendar.rotation.y = Math.PI / 2;
world.add(calendar);

createPlant(new THREE.Vector3(5.85, 0, 1.55), 0.86);
createPlant(new THREE.Vector3(11.78, 0, 3.55), 0.82);
createPlant(new THREE.Vector3(11.5, 0, -3.55), 0.72);

const skyPlane = new THREE.Mesh(new THREE.PlaneGeometry(28, 18), materials.sky);
skyPlane.position.set(22.5, 8, -0.2);
skyPlane.rotation.y = -Math.PI / 2;
world.add(skyPlane);

const skylineWindowMaterials = [];
const streetLamps = [];
for (let index = 0; index < 8; index += 1) {
  const height = 2.8 + (index % 4) * 0.85;
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(1.5 + (index % 3) * 0.5, height, 1.9),
    materials.skyline.clone()
  );
  building.position.set(17 + index * 1.35, height / 2 - 0.2, -5 + index * 1.4);
  world.add(building);

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      const windowMat = new THREE.MeshBasicMaterial({ color: 0xfff1cf });
      const windowPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), windowMat);
      windowPlane.position.set(
        building.position.x + building.geometry.parameters.width / 2 + 0.01,
        0.72 + row * 0.58,
        building.position.z - 0.35 + column * 0.7
      );
      windowPlane.rotation.y = -Math.PI / 2;
      world.add(windowPlane);
      skylineWindowMaterials.push(windowMat);
    }
  }
}

const distantRoad = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 2.2),
  new THREE.MeshBasicMaterial({ color: 0x3d4458 })
);
distantRoad.position.set(18.6, 1.05, 6.2);
distantRoad.rotation.y = -Math.PI / 2;
world.add(distantRoad);

for (let index = 0; index < 3; index += 1) {
  streetLamps.push(createStreetLamp(new THREE.Vector3(16.4 + index * 2.8, 0, 5.6 - index * 0.5), 2.7));
}

const utilityPoleA = createStreetLamp(new THREE.Vector3(15.6, 0, -6.4), 3.6);
utilityPoleA.lamp.visible = false;
const utilityPoleB = createStreetLamp(new THREE.Vector3(20.6, 0, -3.9), 3.8);
utilityPoleB.lamp.visible = false;
createPowerLine(new THREE.Vector3(15.6, 3.35, -6.4), new THREE.Vector3(20.6, 3.45, -3.9), 0.28);
createPowerLine(new THREE.Vector3(15.6, 3.05, -6.4), new THREE.Vector3(20.6, 3.15, -3.9), 0.22);

const clouds = [];
for (let index = 0; index < 4; index += 1) {
  const cloud = new THREE.Group();
  cloud.position.set(18.5 + index * 2.4, 8.8 + (index % 2) * 0.8, -4.4 + index * 1.6);

  for (let puff = 0; puff < 4; puff += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.34 + puff * 0.04, 10, 10),
      materials.cloud
    );
    mesh.position.set(puff * 0.34, (puff % 2) * 0.12, 0);
    mesh.scale.set(1.25, 0.8, 0.55);
    cloud.add(mesh);
  }

  world.add(cloud);
  clouds.push(cloud);
}

const stars = [];
for (let index = 0; index < 36; index += 1) {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.035 + (index % 3) * 0.01, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xfff8d2, transparent: true, opacity: 0.85 })
  );
  star.position.set(16 + (index % 9) * 1.25, 6.6 + Math.floor(index / 9) * 0.68, -5.8 + (index % 4) * 2.8);
  world.add(star);
  stars.push(star);
}

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.56, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xfff7db })
);
moon.position.set(18.6, 10.2, 5.2);
world.add(moon);

const sunDisc = new THREE.Mesh(
  new THREE.SphereGeometry(0.68, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xffd985 })
);
sunDisc.position.set(19.1, 10.4, 4.7);
world.add(sunDisc);

const carLights = [];
for (let index = 0; index < 4; index += 1) {
  const light = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 8),
    new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0xffdca6 : 0xff7f7f })
  );
  light.position.set(16.8 + index * 1.8, 1.05, 5.78 - index * 0.12);
  world.add(light);
  carLights.push(light);
}

const playerCharacter = characterSystem.createStylizedCharacter({
  hairColor: 0xb27d63,
  skinColor: 0xffd1b4,
  outfitColor: 0x7f8c68,
  accentColor: 0xf0e2d2,
  pantsColor: 0x423a38,
  shoeColor: 0x342f2d,
  faceTexture: characterSystem.createFaceTexture({
    iris: "#8a6b52",
    sleepy: true,
    cheerful: false,
    mouthShape: "smile",
    blush: "#efb1a7",
    mouth: "#9f544e"
  }),
  hairFlip: 1,
  hairStyle: "soft-spiky",
  outfitStyle: "olive-hoodie"
});
playerCharacter.root.position.set(-3.33, 0, -1.24);

const companionCharacter = characterSystem.createStylizedCharacter({
  hairColor: 0x1f2330,
  skinColor: 0xffcfb7,
  outfitColor: 0x5d6f91,
  accentColor: 0x191b20,
  pantsColor: 0x3d3841,
  shoeColor: 0x2d2f36,
  faceTexture: characterSystem.createFaceTexture({
    iris: "#007a83",
    sleepy: false,
    cheerful: true,
    mouthShape: "small-o",
    blush: "#d9a49e",
    mouth: "#815a58",
    eye: "#1d1b25"
  }),
  hairFlip: -1,
  hairStyle: "short-part",
  outfitStyle: "blue-jacket"
});
companionCharacter.root.position.set(-0.9, 0, -0.64);
companionCharacter.root.rotation.y = -1.18;

const characters = {
  visitor: {
    id: "visitor",
    label: "Arita",
    ...playerCharacter,
    routeOffset: 0,
    home: new THREE.Vector3(-3.33, 0, -1.24),
    balconySpot: new THREE.Vector3(11.25, 0, 0.55),
    seat: new THREE.Vector3(-3.5, 0, -0.16),
    seatFacing: 0.72
  },
  roommate: {
    id: "roommate",
    label: "Takeda",
    ...companionCharacter,
    routeOffset: 5.2,
    home: new THREE.Vector3(-0.9, 0, -0.64),
    balconySpot: new THREE.Vector3(10.65, 0, -0.15),
    seat: new THREE.Vector3(-0.87, 0, -0.68),
    seatFacing: -1.05
  }
};

const meetSpot = new THREE.Vector3(-2.23, 0, -0.47);
const tableZone = new THREE.Vector3(-2.35, 0, -0.47);

function getActiveCharacter() {
  return characters[state.activeCharacterId];
}

function getInactiveCharacter() {
  return state.activeCharacterId === "visitor" ? characters.roommate : characters.visitor;
}

function getCharacterRoleLabel(character) {
  return state.activeCharacterId === character.id ? "Lead" : "Partner";
}

const interactiveMarkers = [
  createHotspot({ key: "story", position: new THREE.Vector3(-2.65, 1.78, -0.47), symbol: "✦", color: "#f2a66e" }),
  createHotspot({ key: "author", position: new THREE.Vector3(4.25, 1.82, 3.75), symbol: "✎", color: "#7eb4dc" }),
  createHotspot({ key: "volumes", position: new THREE.Vector3(4.72, 1.98, -4.08), symbol: "☼", color: "#9e93ef" }),
  createHotspot({ key: "curtains", position: new THREE.Vector3(6.15, 1.95, 0), symbol: "!", color: "#f3d8a3" }),
  createHotspot({ key: "balcony", position: new THREE.Vector3(11.55, 1.92, 0.15), symbol: "★", color: "#7eb2f2" }),
  createHotspot({ key: "pair", position: new THREE.Vector3(-2.05, 1.92, -0.2), symbol: "♥", color: "#ef8fa1" })
];

const obstacles = [
  { minX: -3.5, maxX: -1.7, minZ: -1.24, maxZ: 0.32 },
  { minX: 4.14, maxX: 5.24, minZ: -4.58, maxZ: -3.56 },
  { minX: -6.45, maxX: -3.75, minZ: -4.35, maxZ: -2.25 },
  { minX: 3.75, maxX: 5.9, minZ: -4.7, maxZ: -2.7 },
  { minX: 2.9, maxX: 5.45, minZ: 2.95, maxZ: 4.65 },
  { minX: 5.35, maxX: 6.28, minZ: 4.0, maxZ: 5.15 },
  { minX: 11.9, maxX: 13.3, minZ: -4.0, maxZ: -2.45 },
  { minX: 11.12, maxX: 11.9, minZ: 3.0, maxZ: 3.92 },
  { minX: -1.12, maxX: 0.38, minZ: 2.0, maxZ: 3.18 }
];

function collides(nextX, nextZ) {
  if (nextX < -6.2 || nextX > 13.2 || nextZ < -5.15 || nextZ > 5.15) {
    return true;
  }

  for (const obstacle of obstacles) {
    if (
      nextX > obstacle.minX &&
      nextX < obstacle.maxX &&
      nextZ > obstacle.minZ &&
      nextZ < obstacle.maxZ
    ) {
      return true;
    }
  }

  return false;
}

function moveOutsideObstacle(currentX, currentZ, nextX, nextZ) {
  for (const obstacle of obstacles) {
    const isInsideCurrent =
      currentX > obstacle.minX &&
      currentX < obstacle.maxX &&
      currentZ > obstacle.minZ &&
      currentZ < obstacle.maxZ;

    if (!isInsideCurrent) {
      continue;
    }

    const centerX = (obstacle.minX + obstacle.maxX) * 0.5;
    const centerZ = (obstacle.minZ + obstacle.maxZ) * 0.5;
    const currentDistance = Math.hypot(currentX - centerX, currentZ - centerZ);
    const nextDistance = Math.hypot(nextX - centerX, nextZ - centerZ);
    return nextDistance > currentDistance;
  }

  return false;
}

function applyLighting() {
  if (state.isNight) {
    scene.background.set(0x1c2442);
    scene.fog.color.set(0x1c2442);
    ambientLight.color.set(0xd7dff8);
    ambientLight.intensity = 1.45;
    hemisphereLight.intensity = 1.45;
    sunLight.color.set(0x9eb7ff);
    sunLight.intensity = 1.7;
    roomLight.color.set(0xffddb8);
    roomLight.intensity = 1.7;
    windowLight.intensity = 1.25;
    lanternLight.intensity = 1.15;
    balconyFillLight.intensity = 0.82;
    materials.roomFloor.color.set(0xcda37a);
    materials.balconyFloor.color.set(0x8791a4);
    materials.wall.color.set(0xd8d1e0);
    materials.trim.color.set(0xa98367);
    materials.curtain.color.set(0xf5eee3);
    materials.glass.color.set(0xb1d2ee);
    materials.leaf.color.set(0x4e8051);
    materials.sky.color.set(0x2b3562);
    materials.cloud.color.set(0x6170a8);
    skylineWindowMaterials.forEach((material) => material.color.set(0xfff1c8));
    streetLamps.forEach(({ lamp }) => {
      lamp.visible = true;
      lamp.material.emissiveIntensity = 0.45;
    });
    stars.forEach((star) => {
      star.visible = true;
    });
    moon.visible = true;
    sunDisc.visible = false;
    carLights.forEach((light, index) => {
      light.visible = true;
      light.material.color.set(index % 2 === 0 ? 0xffdca6 : 0xff7f7f);
    });
    statusCopy.textContent =
      "E open. Q swap. 1-5 emotes.";
  } else {
    scene.background.set(0xeacfae);
    scene.fog.color.set(0xeacfae);
    ambientLight.color.set(0xfff4ea);
    ambientLight.intensity = 1.75;
    hemisphereLight.intensity = 1.2;
    sunLight.color.set(0xffe2b7);
    sunLight.intensity = 2.15;
    roomLight.color.set(0xffefcf);
    roomLight.intensity = 0.95;
    windowLight.intensity = 0.55;
    lanternLight.intensity = 0.3;
    balconyFillLight.intensity = 0.36;
    materials.roomFloor.color.set(0xe2ba90);
    materials.balconyFloor.color.set(0xb1b7c5);
    materials.wall.color.set(0xffefdc);
    materials.trim.color.set(0xc59d7d);
    materials.curtain.color.set(0xfff8ee);
    materials.glass.color.set(0xdaf1ff);
    materials.leaf.color.set(0x639662);
    materials.sky.color.set(0xb7d2f0);
    materials.cloud.color.set(0xf3f0ee);
    skylineWindowMaterials.forEach((material) => material.color.set(0x9fbbd2));
    streetLamps.forEach(({ lamp }) => {
      lamp.visible = true;
      lamp.material.emissiveIntensity = 0.08;
    });
    stars.forEach((star) => {
      star.visible = false;
    });
    moon.visible = false;
    sunDisc.visible = true;
    carLights.forEach((light) => {
      light.visible = true;
      light.material.color.set(0xffffff);
    });
    statusCopy.textContent =
      "E open. Q swap. 1-5 emotes.";
  }
}

applyLighting();

function lerpAngle(current, target, alpha) {
  const difference = ((((target - current) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return current + difference * alpha;
}

function setCharacterEmote(character, symbol, color, until, elapsedTime) {
  if (character.currentEmote !== `${symbol}-${color}`) {
    const texture = createBubbleTexture(symbol, color);
    character.emote.material.map = texture;
    character.emote.material.needsUpdate = true;
    character.currentEmote = `${symbol}-${color}`;
  }
  character.emote.visible = true;
  character.emoteUntil = Math.max(character.emoteUntil, elapsedTime + until);
}

function setCharacterAction(character, type, until, elapsedTime) {
  character.actionType = type;
  character.actionStartedAt = elapsedTime;
  character.actionUntil = Math.max(character.actionUntil ?? 0, elapsedTime + until);
}

function clearCharacterEmote(character) {
  if (clock.elapsedTime > character.emoteUntil) {
    character.emote.visible = false;
    character.currentEmote = null;
  }

  if (clock.elapsedTime > (character.actionUntil ?? 0)) {
    character.actionType = null;
  }
}

function moveCharacterToward(character, target, speed, delta) {
  const deltaVector = new THREE.Vector2(
    target.x - character.root.position.x,
    target.z - character.root.position.z
  );
  const distance = deltaVector.length();
  if (distance < 0.05) {
    return false;
  }

  deltaVector.normalize();
  const nextX = character.root.position.x + deltaVector.x * speed * delta;
  const nextZ = character.root.position.z + deltaVector.y * speed * delta;

  if (
    !collides(nextX, character.root.position.z) ||
    moveOutsideObstacle(character.root.position.x, character.root.position.z, nextX, character.root.position.z)
  ) {
    character.root.position.x = nextX;
  }
  if (
    !collides(character.root.position.x, nextZ) ||
    moveOutsideObstacle(character.root.position.x, character.root.position.z, character.root.position.x, nextZ)
  ) {
    character.root.position.z = nextZ;
  }

  character.targetFacing = Math.atan2(deltaVector.x, deltaVector.y);
  return true;
}

const clock = new THREE.Clock();

function movePlayer(delta) {
  if (state.popupOpen) {
    return false;
  }

  const activeCharacter = getActiveCharacter();
  const moveX = (state.pressed.right ? 1 : 0) - (state.pressed.left ? 1 : 0);
  const moveZ = (state.pressed.down ? 1 : 0) - (state.pressed.up ? 1 : 0);

  const movement = new THREE.Vector2(moveX, moveZ);
  if (movement.lengthSq() === 0) {
    return false;
  }

  movement.normalize();
  const speed = 3.95;
  const nextX = activeCharacter.root.position.x + movement.x * speed * delta;
  const nextZ = activeCharacter.root.position.z + movement.y * speed * delta;

  if (
    !collides(nextX, activeCharacter.root.position.z) ||
    moveOutsideObstacle(activeCharacter.root.position.x, activeCharacter.root.position.z, nextX, activeCharacter.root.position.z)
  ) {
    activeCharacter.root.position.x = nextX;
  }
  if (
    !collides(activeCharacter.root.position.x, nextZ) ||
    moveOutsideObstacle(activeCharacter.root.position.x, activeCharacter.root.position.z, activeCharacter.root.position.x, nextZ)
  ) {
    activeCharacter.root.position.z = nextZ;
  }

  state.playerFacing = Math.atan2(movement.x, movement.y);
  activeCharacter.targetFacing = state.playerFacing;
  return true;
}

function updateHotspots(elapsedTime) {
  const activeCharacter = getActiveCharacter();
  let closest = null;
  let bestDistance = Infinity;

  interactiveMarkers.forEach((marker, index) => {
    marker.group.position.y = marker.basePosition.y + Math.sin(elapsedTime * 1.9 + index) * 0.08;
    marker.glow.scale.setScalar(1 + Math.sin(elapsedTime * 2.4 + index) * 0.08);
    marker.bubble.quaternion.copy(camera.quaternion);

    const distance = marker.basePosition.distanceTo(
      new THREE.Vector3(activeCharacter.root.position.x, marker.basePosition.y, activeCharacter.root.position.z)
    );

    const isNear = distance < marker.radius;
    marker.group.visible = false;
    marker.bubble.visible = false;
    marker.glow.visible = false;

    if (isNear && distance < bestDistance) {
      bestDistance = distance;
      closest = marker;
    }
  });

  state.closestHotspot = closest;

  if (state.popupOpen) {
    inspectTrigger.disabled = false;
    inspectTrigger.textContent = "Close";
    touchInspect.disabled = false;
    touchInspect.textContent = "Close";
    return;
  }

  inspectTrigger.disabled = !closest;
  touchInspect.disabled = !closest;
  inspectTrigger.textContent = closest ? "Open" : "None";
  touchInspect.textContent = "Inspect";

  if (closest) {
    statusTitle.textContent = `${hotspotContent[closest.key].title} · ${getCharacterRoleLabel(activeCharacter)}`;
  } else {
    statusTitle.textContent = `${activeCharacter.label} · ${getCharacterRoleLabel(activeCharacter)}`;
  }
}

function animateCharacter(character, elapsedTime, moveAmount = 0, idleOffset = 0) {
  const swing = Math.sin(elapsedTime * 8 + idleOffset) * moveAmount;
  const bounce = Math.sin(elapsedTime * 2.4 + idleOffset);
  const shoulderRoll = Math.sin(elapsedTime * 3.2 + idleOffset) * 0.03;
  const actionType = elapsedTime < (character.actionUntil ?? 0) ? character.actionType : null;
  const actionDuration = Math.max((character.actionUntil ?? 0) - (character.actionStartedAt ?? 0), 0.001);
  const actionProgress = actionType
    ? THREE.MathUtils.clamp((elapsedTime - (character.actionStartedAt ?? elapsedTime)) / actionDuration, 0, 1)
    : 0;
  const actionPulse = Math.sin(actionProgress * Math.PI);
  const actionWave = Math.sin(elapsedTime * 16 + idleOffset);

  character.bodyRoot.position.y = bounce * 0.04 + moveAmount * 0.05 - character.sitAmount * 0.24;
  character.bodyRoot.rotation.z = shoulderRoll * (1 - character.sitAmount * 0.7);
  character.headPivot.rotation.x = Math.sin(elapsedTime * 2 + idleOffset) * 0.04 - character.sitAmount * 0.08;
  character.headPivot.rotation.z = Math.sin(elapsedTime * 1.6 + idleOffset) * 0.026;
  character.armLeft.rotation.z = -0.42 - swing * 0.46 + character.sitAmount * 0.22;
  character.armRight.rotation.z = 0.42 + swing * 0.46 - character.sitAmount * 0.22;
  character.armLeft.rotation.x = 0.06 + moveAmount * 0.08;
  character.armRight.rotation.x = -0.06 - moveAmount * 0.08;
  character.legLeft.rotation.x = swing * 0.42 - character.sitAmount * 1.24;
  character.legRight.rotation.x = -swing * 0.42 - character.sitAmount * 1.24;
  character.torso.rotation.x = -character.sitAmount * 0.15 + bounce * 0.01;
  character.torso.rotation.z = -shoulderRoll * 0.8;

  if (actionType === "wave") {
    character.armRight.rotation.z = 0.88;
    character.armRight.rotation.x = -0.7 + actionWave * 0.18;
    character.headPivot.rotation.z += 0.08 * actionPulse;
    character.bodyRoot.position.y += actionPulse * 0.05;
  } else if (actionType === "bow") {
    character.torso.rotation.x += 0.42 * actionPulse;
    character.headPivot.rotation.x += 0.16 * actionPulse;
    character.armLeft.rotation.z = -0.22;
    character.armRight.rotation.z = 0.22;
    character.bodyRoot.position.y -= actionPulse * 0.03;
  } else if (actionType === "jump") {
    character.bodyRoot.position.y += actionPulse * 0.34;
    character.armLeft.rotation.z = -0.88 + actionPulse * -0.12;
    character.armRight.rotation.z = 0.88 + actionPulse * 0.12;
    character.legLeft.rotation.x += -0.48 * actionPulse;
    character.legRight.rotation.x += -0.48 * actionPulse;
    character.headPivot.rotation.x -= 0.08 * actionPulse;
  } else if (actionType === "hop") {
    character.bodyRoot.position.y += actionPulse * 0.2;
    character.armLeft.rotation.z = -0.58;
    character.armRight.rotation.z = 0.58;
    character.headPivot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.1 * actionPulse;
  } else if (actionType === "cheer") {
    character.bodyRoot.position.y += actionPulse * 0.24;
    character.armLeft.rotation.z = -1.06 + actionWave * 0.1;
    character.armRight.rotation.z = 1.06 - actionWave * 0.1;
    character.armLeft.rotation.x = -0.3;
    character.armRight.rotation.x = -0.3;
    character.headPivot.rotation.z += Math.sin(actionProgress * Math.PI * 4) * 0.06 * actionPulse;
    character.headPivot.rotation.x -= 0.04 * actionPulse;
  } else if (actionType === "sway") {
    character.bodyRoot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.12 * actionPulse;
    character.armLeft.rotation.z = -0.3 - actionPulse * 0.08;
    character.armRight.rotation.z = 0.3 + actionPulse * 0.08;
    character.headPivot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.08 * actionPulse;
  } else if (actionType === "high-five-right") {
    character.bodyRoot.position.y += actionPulse * 0.12;
    character.torso.rotation.z -= 0.12 * actionPulse;
    character.armRight.rotation.z = 1.18;
    character.armRight.rotation.x = -0.44 + actionPulse * 0.18;
    character.armLeft.rotation.z = -0.24;
    character.headPivot.rotation.z += 0.06 * actionPulse;
  } else if (actionType === "high-five-left") {
    character.bodyRoot.position.y += actionPulse * 0.12;
    character.torso.rotation.z += 0.12 * actionPulse;
    character.armLeft.rotation.z = -1.18;
    character.armLeft.rotation.x = -0.44 + actionPulse * 0.18;
    character.armRight.rotation.z = 0.24;
    character.headPivot.rotation.z -= 0.06 * actionPulse;
  }

  character.hairMotionNodes?.forEach((motion, index) => {
    const offset = Math.sin(elapsedTime * (2 + moveAmount * 3) + idleOffset + motion.phase + index * 0.12) * motion.amplitude;
    motion.mesh.rotation.x = motion.baseRotationX + (motion.axis === "x" ? offset : 0);
    motion.mesh.rotation.y = motion.baseRotationY + (motion.axis === "y" ? offset : 0);
    motion.mesh.rotation.z = motion.baseRotationZ + (motion.axis === "z" ? offset : 0);
  });

  character.emote.quaternion.copy(camera.quaternion);
  character.emote.position.y = 2.56 - character.sitAmount * 0.18;
  character.shadow.scale.setScalar(1 - moveAmount * 0.06 + Math.sin(elapsedTime * 4 + idleOffset) * 0.02);
  clearCharacterEmote(character);
}

function animate() {
  const delta = clock.getDelta();
  const elapsedTime = clock.elapsedTime;

  const activeCharacter = getActiveCharacter();
  const inactiveCharacter = getInactiveCharacter();
  const isMoving = movePlayer(delta);
  const tableDistanceActive = activeCharacter.root.position.distanceTo(tableZone);
  const tableDistanceInactive = inactiveCharacter.root.position.distanceTo(tableZone);
  const pairDistance = activeCharacter.root.position.distanceTo(inactiveCharacter.root.position);

  let inactiveTarget = null;
  let inactiveMode = "wander";

  if (!state.popupOpen) {
    if (tableDistanceActive < 2.4) {
      inactiveTarget = inactiveCharacter.seat;
      inactiveMode = "eat";
    } else {
      const phase = Math.floor((elapsedTime + inactiveCharacter.routeOffset) / 6) % 3;
      if (phase === 0) {
        inactiveTarget = inactiveCharacter.balconySpot;
        inactiveMode = "balcony";
      } else if (phase === 1) {
        inactiveTarget = inactiveCharacter.seat;
        inactiveMode = "eat";
      } else {
        inactiveTarget = inactiveCharacter.home;
      }
    }
  }

  const inactiveMoving = inactiveTarget ? moveCharacterToward(inactiveCharacter, inactiveTarget, 2.5, delta) : false;

  const activeNearSeat = activeCharacter.root.position.distanceTo(activeCharacter.seat) < 0.54;
  const inactiveNearSeat = inactiveCharacter.root.position.distanceTo(inactiveCharacter.seat) < 0.54;
  const bothSeatedZone = activeNearSeat && inactiveNearSeat;

  activeCharacter.sitAmount = THREE.MathUtils.lerp(
    activeCharacter.sitAmount,
    !isMoving && activeNearSeat ? 1 : 0,
    0.12
  );
  inactiveCharacter.sitAmount = THREE.MathUtils.lerp(
    inactiveCharacter.sitAmount,
    inactiveMode === "eat" && inactiveNearSeat && !inactiveMoving ? 1 : 0,
    0.12
  );

  if (pairDistance < 1.15 && !bothSeatedZone) {
    if (pairDistance < 0.92 && elapsedTime > state.lastPairedActionAt + 8.5) {
      characterSystem.triggerPairedHighFive(activeCharacter, inactiveCharacter, elapsedTime);
      state.lastPairedActionAt = elapsedTime;
      state.lastInteractionEmoteAt = elapsedTime;
    } else if (elapsedTime > state.lastInteractionEmoteAt + 2.2) {
      characterSystem.triggerPresetEmote(activeCharacter, "hello", elapsedTime);
      characterSystem.triggerPresetEmote(inactiveCharacter, "greet", elapsedTime);
      state.lastInteractionEmoteAt = elapsedTime;
    } else {
      characterSystem.setCharacterEmote(activeCharacter, "♥", "#ef8fa1", 0.2, elapsedTime);
      characterSystem.setCharacterEmote(inactiveCharacter, "♥", "#ef8fa1", 0.2, elapsedTime);
    }
  } else if (bothSeatedZone) {
    characterSystem.setCharacterEmote(activeCharacter, "✦", "#f2c57f", 0.2, elapsedTime);
    characterSystem.setCharacterEmote(inactiveCharacter, "♪", "#9e93ef", 0.2, elapsedTime);
  } else if (inactiveMode === "eat" && inactiveNearSeat) {
    characterSystem.setCharacterEmote(inactiveCharacter, "☕", "#f2c57f", 0.2, elapsedTime);
  }

  activeCharacter.root.rotation.y = lerpAngle(
    activeCharacter.root.rotation.y,
    state.playerFacing,
    0.15
  );
  inactiveCharacter.root.rotation.y = lerpAngle(
    inactiveCharacter.root.rotation.y,
    inactiveCharacter.targetFacing ??
      Math.atan2(
        activeCharacter.root.position.x - inactiveCharacter.root.position.x,
        activeCharacter.root.position.z - inactiveCharacter.root.position.z
      ),
    0.06
  );

  characterSystem.animateCharacter(activeCharacter, elapsedTime, isMoving ? 1 : 0.18, 0);
  characterSystem.animateCharacter(inactiveCharacter, elapsedTime, inactiveMoving ? 0.8 : 0.22, 1.4);

  leftCurtain.rotation.z = Math.sin(elapsedTime * 1.2) * 0.03 + 0.03;
  rightCurtain.rotation.z = -Math.sin(elapsedTime * 1.2) * 0.03 - 0.03;
  leftDoor.material.opacity = state.isNight ? 0.24 : 0.18;
  rightDoor.material.opacity = state.isNight ? 0.24 : 0.18;

  animatedLeaves.forEach((leaf) => {
    leaf.mesh.rotation.z = leaf.baseRotationZ + Math.sin(elapsedTime * 1.7 + leaf.phase) * leaf.sway;
    leaf.mesh.rotation.x = leaf.baseRotationX + Math.cos(elapsedTime * 1.4 + leaf.phase) * (leaf.sway * 0.6);
    leaf.mesh.position.y = leaf.baseY + Math.sin(elapsedTime * 1.3 + leaf.phase) * 0.015;
  });

  animatedLaundry.forEach((cloth) => {
    cloth.mesh.rotation.z = cloth.baseRotationZ + Math.sin(elapsedTime * 1.9 + cloth.phase) * 0.08;
    cloth.mesh.rotation.x = Math.cos(elapsedTime * 1.5 + cloth.phase) * 0.06;
    cloth.mesh.position.y = cloth.baseY + Math.sin(elapsedTime * 1.2 + cloth.phase) * 0.03;
  });

  animatedPaperItems.forEach((paper) => {
    paper.mesh.rotation.z = paper.baseRotationZ + Math.sin(elapsedTime * 1.8 + paper.phase) * 0.05;
    paper.mesh.position.y = paper.baseY + Math.sin(elapsedTime * 1.3 + paper.phase) * 0.015;
  });

  animatedSteam.forEach((puff) => {
    const cycle = (elapsedTime * puff.speed + puff.phase) % 1;
    puff.mesh.position.set(
      puff.origin.x + Math.sin(cycle * Math.PI * 2) * puff.radius * 0.35 + puff.drift * cycle * 0.35,
      puff.origin.y + cycle * puff.height,
      puff.origin.z + Math.cos(cycle * Math.PI * 2) * puff.radius * 0.18
    );
    const scale = 0.6 + cycle * 0.9;
    puff.mesh.scale.set(scale, scale * 1.25, scale);
    puff.mesh.material.opacity = Math.sin(cycle * Math.PI) * 0.28;
  });

  spinningFans.forEach((fan) => {
    fan.mesh.rotation.z = elapsedTime * fan.speed;
  });

  hangingDecor.forEach((decor) => {
    decor.mesh.rotation.z = decor.baseRotationZ + Math.sin(elapsedTime * 1.4 + decor.phase) * 0.08;
    decor.mesh.position.y = decor.basePositionY + Math.cos(elapsedTime * 1.4 + decor.phase) * 0.012;
  });

  shimmerMaterials.forEach((entry) => {
    entry.material.emissiveIntensity =
      entry.min + ((Math.sin(elapsedTime * entry.speed + entry.phase) + 1) * 0.5) * (entry.max - entry.min);
  });

  clouds.forEach((cloud, index) => {
    cloud.position.x += Math.sin(elapsedTime * 0.15 + index) * 0.003;
  });

  stars.forEach((star, index) => {
    if (star.visible) {
      star.material.opacity = 0.5 + Math.sin(elapsedTime * 2.2 + index * 0.6) * 0.22;
    }
  });

  carLights.forEach((light, index) => {
    light.position.x -= 0.012 + index * 0.0015;
    if (light.position.x < 15.6) {
      light.position.x = 22.4 + index * 0.3;
    }
  });

  updateHotspots(elapsedTime);

  cameraTarget.lerp(
    new THREE.Vector3(
      activeCharacter.root.position.x * 0.62 - 0.82,
      1.28,
      activeCharacter.root.position.z * 0.62 + 1.24
    ),
    0.08
  );

  cameraPosition.copy(cameraTarget).add(cameraOffset);
  cameraPosition.x += state.pointer.x * 0.32;
  cameraPosition.y += state.pointer.y * -0.14;
  cameraPosition.z += state.pointer.y * -0.22;
  camera.position.lerp(cameraPosition, 0.08);
  camera.lookAt(cameraTarget.x + state.pointer.x * 0.2, cameraTarget.y, cameraTarget.z + state.pointer.y * 0.18);

  renderer.render(scene, camera);
  if (!state.simplified) {
    requestAnimationFrame(animate);
  }
}

animate();
