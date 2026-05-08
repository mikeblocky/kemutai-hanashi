const fs = require("fs");
const mainSource = fs.readFileSync("c:/kemutai-hanashi/src/main.js", "utf8");
const charSource = fs.readFileSync("c:/kemutai-hanashi/src/characters.js", "utf8");

// Extract the 3 texture functions and createStylizedCharacter from mainSource
const strandMatches = mainSource.match(/function createHairStrandTexture\([\s\S]*?\n\}/);
const cardMatches = mainSource.match(/function createHairCardTexture\([\s\S]*?\n\}/);
const faceMatches = mainSource.match(/function createFaceTexture\([\s\S]*?\n\}/);

// createStylizedCharacter inside main.js ends exactly at line 2294 which has a `}` followed by `const roomFloor`
const stylizedStart = mainSource.indexOf("function createStylizedCharacter({");
const stylizedEnd = mainSource.indexOf("\n\nconst roomFloor =");
const stylizedMatches = [mainSource.substring(stylizedStart, stylizedEnd)];

if (!strandMatches || !cardMatches || !faceMatches || !stylizedMatches) {
  console.log("Could not find functions in main.js");
  process.exit(1);
}

// Modify stylizedMatches to apply Mii proportions
let newStylized = stylizedMatches[0];
// Increase head size
newStylized = newStylized.replace(
  /const headPivot = new THREE\.Group\(\);\n  headPivot\.position\.y = 1\.64 \* scale;/,
  "const headPivot = new THREE.Group();\n  headPivot.position.y = 1.15 * scale;\n  headPivot.scale.set(1.3, 1.3, 1.3);"
);
// Adjust Torso
newStylized = newStylized.replace(
  /const torso = new THREE\.Mesh\(\n    new THREE\.CapsuleGeometry\(0\.19 \* scale, 0\.34 \* scale, 8, 14\)/,
  "const torso = new THREE.Mesh(\n    new THREE.CapsuleGeometry(0.24 * scale, 0.28 * scale, 8, 14)"
);
newStylized = newStylized.replace(
  /torso\.position\.y = 0\.96 \* scale;/,
  "torso.position.y = 0.85 * scale;"
);
// Adjust limbs
newStylized = newStylized.replace(
  /const armLeft = new THREE\.Mesh\(\n    new THREE\.CapsuleGeometry\(0\.06 \* scale, 0\.24 \* scale, 6, 10\)/,
  "const armLeft = new THREE.Mesh(\n    new THREE.CapsuleGeometry(0.08 * scale, 0.18 * scale, 6, 10)"
);
newStylized = newStylized.replace(
  /armLeft\.position\.set\(-0\.27 \* scale, 0\.94 \* scale, 0\.01 \* scale\);/,
  "armLeft.position.set(-0.35 * scale, 0.78 * scale, 0.01 * scale);"
);
newStylized = newStylized.replace(
  /const legLeft = new THREE\.Mesh\(\n    new THREE\.CapsuleGeometry\(0\.065 \* scale, 0\.28 \* scale, 6, 10\)/,
  "const legLeft = new THREE.Mesh(\n    new THREE.CapsuleGeometry(0.08 * scale, 0.18 * scale, 6, 10)"
);
newStylized = newStylized.replace(
  /legLeft\.position\.set\(-0\.1 \* scale, 0\.37 \* scale, 0\);/,
  "legLeft.position.set(-0.16 * scale, 0.28 * scale, 0);"
);
// Make hands spheres
newStylized = newStylized.replace(
  /const handLeft = new THREE\.Mesh\(new THREE\.SphereGeometry\(0\.07 \* scale, 10, 10\), skinMat\);/,
  "const handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 12, 12), skinMat);"
);
newStylized = newStylized.replace(
  /handLeft\.position\.set\(-0\.37 \* scale, 0\.74 \* scale, 0\.03 \* scale\);/,
  "handLeft.position.set(-0.46 * scale, 0.58 * scale, 0.03 * scale);"
);
// Reposition shirts to match new torso
newStylized = newStylized.replace(
  /shirtFront\.position\.set\(0, 0\.97 \* scale, 0\.165 \* scale\);/,
  "shirtFront.position.set(0, 0.86 * scale, 0.21 * scale);"
);
newStylized = newStylized.replace(
  /sweaterFront\.position\.set\(0, 0\.95 \* scale, 0\.16 \* scale\);/,
  "sweaterFront.position.set(0, 0.84 * scale, 0.20 * scale);"
);
newStylized = newStylized.replace(
  /shirtHem\.position\.set\(0, 0\.74 \* scale, 0\.13 \* scale\);/,
  "shirtHem.position.set(0, 0.62 * scale, 0.18 * scale);"
);
newStylized = newStylized.replace(
  /collar\.position\.set\(0, 1\.19 \* scale, 0\.02 \* scale\);/,
  "collar.position.set(0, 1.05 * scale, 0.02 * scale);"
);

// We should also replace makeCanvasTexture parameter calls, since the characters.js version takes `makeCanvasTexture` from the system
const strandFixed = strandMatches[0].replace(/function createHairStrandTexture\(style = "soft-spiky"\) {/g, "function createHairStrandTexture(makeCanvasTexture, style = \"soft-spiky\") {");
const cardFixed = cardMatches[0].replace(/function createHairCardTexture\(style = "soft-spiky", layer = "front"\) {/g, "function createHairCardTexture(makeCanvasTexture, style = \"soft-spiky\", layer = \"front\") {");

// Now replace them in characters.js
let newCharSource = charSource.replace(
  /function createHairStrandTexture\([\s\S]*?\n\}/,
  strandFixed
);
newCharSource = newCharSource.replace(
  /function createHairCardTexture\([\s\S]*?\n\}/,
  cardFixed
);

// In characters.js, createStylizedCharacter is inside createCharacterSystem
// We need to replace the old one with the new one.
const oldStylizedStart = newCharSource.indexOf("function createStylizedCharacter({");
const oldStylizedEnd = newCharSource.indexOf("function animateCharacter(character,");
if (oldStylizedStart === -1 || oldStylizedEnd === -1) {
  console.log("Could not find createStylizedCharacter in characters.js");
  process.exit(1);
}

// Ensure the new stylized has access to makeCanvasTexture
newStylized = newStylized.replace(
  /createHairCardTexture\(hairStyle, "front"\)/g,
  "createHairCardTexture(makeCanvasTexture, hairStyle, \"front\")"
);
newStylized = newStylized.replace(
  /createHairCardTexture\(hairStyle, "back"\)/g,
  "createHairCardTexture(makeCanvasTexture, hairStyle, \"back\")"
);
newStylized = newStylized.replace(
  /createHairCardTexture\(hairStyle, "side"\)/g,
  "createHairCardTexture(makeCanvasTexture, hairStyle, \"side\")"
);
newStylized = newStylized.replace(
  /createHairCardTexture\(hairStyle, "inner"\)/g,
  "createHairCardTexture(makeCanvasTexture, hairStyle, \"inner\")"
);
newStylized = newStylized.replace(
  /createHairStrandTexture\(hairStyle\)/g,
  "createHairStrandTexture(makeCanvasTexture, hairStyle)"
);

newCharSource = newCharSource.substring(0, oldStylizedStart) + newStylized + "\n\n  " + newCharSource.substring(oldStylizedEnd);

// Replace face texture
// It is inside createCharacterSystem in character.js, so we pass it inside
const oldFaceStart = newCharSource.indexOf("function createFaceTexture({");
const oldFaceEnd = newCharSource.indexOf("function setCharacterAction(");
const fixedFace = faceMatches[0].replace(
  /return makeCanvasTexture\(320, 320, \(context, width, height\) => {/g,
  "return makeCanvasTexture(320, 320, (context, width, height) => {"
);
newCharSource = newCharSource.substring(0, oldFaceStart) + fixedFace + "\n\n  " + newCharSource.substring(oldFaceEnd);

// Also we don't need createCharacterHairProfile anymore
const oldProfileStart = newCharSource.indexOf("function createCharacterHairProfile(");
const oldProfileEnd = newCharSource.indexOf("export function createCharacterSystem(");
if (oldProfileStart !== -1) {
  newCharSource = newCharSource.substring(0, oldProfileStart) + newCharSource.substring(oldProfileEnd);
}

fs.writeFileSync("c:/kemutai-hanashi/src/characters.js", newCharSource);

// Now strip the duplicated functions out of main.js
let newMainSource = mainSource.substring(0, mainSource.indexOf("function createHairStrandTexture(")) + 
                    mainSource.substring(mainSource.indexOf("function createHotspot("));

// Still need to remove the duplicate createStylizedCharacter
const mainOldStylizedStart = newMainSource.indexOf("function createStylizedCharacter({");
const mainOldStylizedEnd = newMainSource.indexOf("\n\nconst roomFloor =");
if (mainOldStylizedStart !== -1 && mainOldStylizedEnd !== -1) {
  newMainSource = newMainSource.substring(0, mainOldStylizedStart) + newMainSource.substring(mainOldStylizedEnd);
}
fs.writeFileSync("c:/kemutai-hanashi/src/main.js", newMainSource);

console.log("characters.js and main.js rewritten successfully!");
