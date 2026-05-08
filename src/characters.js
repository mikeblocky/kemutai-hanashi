import * as THREE from "three";

function createHairStrandTexture(makeCanvasTexture, style = "soft-spiky") {
  const texture = makeCanvasTexture(160, 256, (context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";

    const strokeCount = style === "soft-spiky" ? 9 : 7;
    for (let index = 0; index < strokeCount; index += 1) {
      const x = width * (style === "soft-spiky" ? 0.13 + index * 0.085 : 0.16 + index * 0.09);
      const curve =
        style === "soft-spiky"
          ? (index - strokeCount * 0.5) * 5.4
          : (index < strokeCount * 0.5 ? -1 : 1) * (8 + Math.abs(index - strokeCount * 0.5) * 4);
      context.strokeStyle = "rgba(255, 255, 255, 1.0)";
      context.lineWidth = style === "soft-spiky" ? 11 - (index % 3) : 9 - (index % 2);
      context.beginPath();
      context.moveTo(x, 8 + (index % 2) * 6);
      context.bezierCurveTo(
        x + curve,
        height * 0.22,
        x - curve * 0.38,
        height * (style === "soft-spiky" ? 0.58 : 0.64),
        x + curve * 0.2,
        height - 12
      );
      context.stroke();

      context.strokeStyle = style === "soft-spiky" ? "rgba(86, 62, 44, 0.42)" : "rgba(44, 48, 62, 0.42)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(x - 4, 8);
      context.bezierCurveTo(
        x + curve * 0.34,
        height * 0.24,
        x - curve * 0.22,
        height * 0.68,
        x - 1,
        height - 12
      );
      context.stroke();
    }
  });

  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createHairCardTexture(makeCanvasTexture, style = "soft-spiky", layer = "front") {
  const texture = makeCanvasTexture(256, 256, (context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    const fillBase = (alpha = 1) => {
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.fill();
    };

    if (style === "soft-spiky") {
      if (layer === "front") {
        context.beginPath();
        context.moveTo(26, 86);
        context.quadraticCurveTo(52, 44, 102, 34);
        context.quadraticCurveTo(150, 22, 192, 40);
        context.quadraticCurveTo(226, 56, 236, 96);
        context.lineTo(214, 112);
        context.lineTo(202, 102);
        context.lineTo(182, 134);
        context.lineTo(160, 108);
        context.lineTo(132, 182);
        context.lineTo(108, 110);
        context.lineTo(76, 148);
        context.lineTo(62, 118);
        context.lineTo(38, 130);
        context.lineTo(26, 104);
        context.closePath();
        fillBase();
      } else if (layer === "back") {
        context.beginPath();
        context.moveTo(40, 52);
        context.quadraticCurveTo(66, 18, 128, 18);
        context.quadraticCurveTo(194, 20, 220, 60);
        context.lineTo(226, 112);
        context.lineTo(214, 152);
        context.lineTo(228, 194);
        context.lineTo(198, 182);
        context.lineTo(186, 220);
        context.lineTo(152, 204);
        context.lineTo(128, 230);
        context.lineTo(102, 204);
        context.lineTo(68, 220);
        context.lineTo(56, 184);
        context.lineTo(28, 194);
        context.lineTo(42, 148);
        context.lineTo(30, 110);
        context.closePath();
        fillBase();
      } else if (layer === "side") {
        context.beginPath();
        context.moveTo(70, 28);
        context.quadraticCurveTo(162, 34, 196, 92);
        context.lineTo(194, 126);
        context.lineTo(214, 156);
        context.lineTo(184, 156);
        context.lineTo(188, 194);
        context.lineTo(156, 180);
        context.lineTo(134, 226);
        context.lineTo(110, 186);
        context.lineTo(84, 194);
        context.lineTo(90, 156);
        context.lineTo(64, 122);
        context.lineTo(72, 90);
        context.closePath();
        fillBase();
      } else if (layer === "inner") {
        context.strokeStyle = "rgba(78, 58, 42, 0.38)";
        context.lineWidth = 6;
        for (let index = 0; index < 6; index += 1) {
          const x = 68 + index * 24;
          context.beginPath();
          context.moveTo(x, 42);
          context.bezierCurveTo(x - 12, 86, x + 12, 126, x - 4, 196);
          context.stroke();
        }

        context.strokeStyle = "rgba(255, 255, 255, 0.3)";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(92, 44);
        context.bezierCurveTo(106, 82, 102, 124, 94, 174);
        context.stroke();
        context.beginPath();
        context.moveTo(150, 40);
        context.bezierCurveTo(160, 78, 154, 126, 144, 186);
        context.stroke();
      }
    } else {
      if (layer === "front") {
        context.beginPath();
        context.moveTo(30, 78);
        context.quadraticCurveTo(56, 40, 120, 34);
        context.quadraticCurveTo(186, 30, 222, 72);
        context.lineTo(216, 104);
        context.lineTo(188, 102);
        context.lineTo(164, 122);
        context.lineTo(148, 176);
        context.lineTo(126, 112);
        context.lineTo(104, 146);
        context.lineTo(82, 112);
        context.lineTo(54, 120);
        context.lineTo(34, 102);
        context.closePath();
        fillBase();
      } else if (layer === "back") {
        context.beginPath();
        context.moveTo(38, 48);
        context.quadraticCurveTo(60, 18, 126, 18);
        context.quadraticCurveTo(198, 18, 220, 62);
        context.lineTo(224, 140);
        context.lineTo(208, 184);
        context.lineTo(182, 176);
        context.lineTo(158, 214);
        context.lineTo(128, 198);
        context.lineTo(98, 214);
        context.lineTo(74, 178);
        context.lineTo(48, 188);
        context.lineTo(34, 146);
        context.closePath();
        fillBase();
      } else if (layer === "side") {
        context.beginPath();
        context.moveTo(80, 26);
        context.quadraticCurveTo(166, 34, 196, 86);
        context.lineTo(194, 124);
        context.lineTo(204, 162);
        context.lineTo(174, 156);
        context.lineTo(168, 204);
        context.lineTo(134, 180);
        context.lineTo(112, 198);
        context.lineTo(92, 162);
        context.lineTo(68, 154);
        context.lineTo(76, 114);
        context.lineTo(60, 84);
        context.closePath();
        fillBase();
      } else if (layer === "inner") {
        context.strokeStyle = "rgba(36, 40, 54, 0.38)";
        context.lineWidth = 5;
        for (let index = 0; index < 5; index += 1) {
          const x = 86 + index * 22;
          context.beginPath();
          context.moveTo(x, 44);
          context.bezierCurveTo(x - 10, 84, x + 10, 126, x, 182);
          context.stroke();
        }

        context.strokeStyle = "rgba(255, 255, 255, 0.24)";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(112, 42);
        context.bezierCurveTo(124, 76, 120, 116, 114, 154);
        context.stroke();
      }
    }
  });

  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function createCharacterSystem({ world, camera, makeCanvasTexture, createBubbleTexture }) {
  function createFaceTexture({
    sleepy = false,
    cheerful = true,
    mouthShape = cheerful ? "open" : "smile",
    blush = "#efb1a7",
    mouth = "#d58b83",
    iris = "#7ba46e",
    eye = "#1c1820"
  }) {
    return makeCanvasTexture(320, 320, (context, width, height) => {
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineJoin = "round";

      const eyeY = sleepy ? 142 : 144;
      const browY = sleepy ? 104 : 106;
      const mouthY = cheerful ? 218 : 214;
      const noseX = width / 2 + 2;

      for (const side of [-1, 1]) {
        const centerX = width / 2 + side * 46;

        context.strokeStyle = "rgba(38, 25, 24, 0.96)";
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(centerX - 19, browY + 2);
        context.quadraticCurveTo(centerX, browY - (sleepy ? 4 : 8), centerX + 19, browY + 2);
        context.stroke();

        context.fillStyle = blush;
        context.globalAlpha = 0.16;
        context.beginPath();
        context.ellipse(centerX, 184, 18, 10, 0, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;

        if (sleepy) {
          context.strokeStyle = eye;
          context.lineWidth = 7;
          context.beginPath();
          context.moveTo(centerX - 15, eyeY);
          context.quadraticCurveTo(centerX, eyeY + 3, centerX + 15, eyeY);
          context.stroke();
        } else {
          context.strokeStyle = eye;
          context.lineWidth = 4;
          context.beginPath();
          context.moveTo(centerX - 18, eyeY - 6);
          context.quadraticCurveTo(centerX, eyeY - 14, centerX + 18, eyeY - 6);
          context.stroke();

          context.fillStyle = eye;
          context.beginPath();
          context.ellipse(centerX, eyeY + 1, 10, 12, 0, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = iris;
          context.beginPath();
          context.ellipse(centerX, eyeY + 1, 6.6, 7.8, 0, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = "#ffffff";
          context.beginPath();
          context.arc(centerX - 3.2, eyeY - 3.2, 2.8, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.strokeStyle = "rgba(64, 44, 38, 0.92)";
      context.lineWidth = 4.2;
      context.beginPath();
      context.moveTo(noseX, 164);
      context.quadraticCurveTo(noseX - 8, 176, noseX - 3, 190);
      context.quadraticCurveTo(noseX + 3, 195, noseX + 9, 190);
      context.stroke();

      if (mouthShape === "open") {
        context.fillStyle = eye;
        context.beginPath();
        context.ellipse(width / 2, mouthY, 7, 10, 0, 0, Math.PI * 2);
        context.fill();
      } else if (mouthShape === "small-o") {
        context.fillStyle = eye;
        context.beginPath();
        context.ellipse(width / 2, mouthY - 1, 9, 12, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = mouth;
        context.globalAlpha = 0.35;
        context.beginPath();
        context.ellipse(width / 2, mouthY + 2, 4, 5, 0, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      } else {
        context.strokeStyle = eye;
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(width / 2 - 24, mouthY);
        context.quadraticCurveTo(width / 2, mouthY + 11, width / 2 + 24, mouthY);
        context.stroke();
      }
    });
  }

  function setCharacterAction(character, type, until, elapsedTime) {
    character.actionType = type;
    character.actionStartedAt = elapsedTime;
    character.actionUntil = Math.max(character.actionUntil ?? 0, elapsedTime + until);
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

  function clearCharacterEmote(character, elapsedTime) {
    if (elapsedTime > character.emoteUntil) {
      character.emote.visible = false;
      character.currentEmote = null;
    }

    if (elapsedTime > (character.actionUntil ?? 0)) {
      character.actionType = null;
    }
  }

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

  function createStylizedCharacter({
  hairColor,
  skinColor,
  outfitColor,
  accentColor,
  pantsColor,
  shoeColor,
  faceTexture,
  scale = 1,
  hairFlip = 1,
  hairStyle = "soft-spiky",
  outfitStyle = hairStyle === "soft-spiky" ? "olive-hoodie" : "blue-jacket"
}) {
  const root = new THREE.Group();
  const bodyRoot = new THREE.Group();
  root.add(bodyRoot);

  const hairMotionNodes = [];

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.46 * scale, 28),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.14 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  const outfitMat = new THREE.MeshStandardMaterial({ color: outfitColor, roughness: 0.95 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.9 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
  const hairDarkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hairColor).multiplyScalar(0.78),
    roughness: 0.94
  });
  const earInnerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor).lerp(new THREE.Color(0xffb6b0), 0.3),
    roughness: 0.94
  });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.96 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.96 });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor).lerp(new THREE.Color(0xffffff), 0.22),
    roughness: 0.9
  });
  const cuffMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor).multiplyScalar(0.88),
    roughness: 0.94
  });
  const detailMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor).multiplyScalar(0.92),
    roughness: 0.92
  });
  const isSoftSpiky = hairStyle === "soft-spiky";

  function registerHairMotion(mesh, axis, amplitude, phase) {
    hairMotionNodes.push({
      mesh,
      axis,
      amplitude,
      phase,
      baseRotationX: mesh.rotation.x,
      baseRotationY: mesh.rotation.y,
      baseRotationZ: mesh.rotation.z
    });
    return mesh;
  }

  const hairGroup = new THREE.Group();

  function addHairPiece({
    geometry,
    position,
    scaleVector = new THREE.Vector3(1, 1, 1),
    rotation = new THREE.Euler(),
    material = hairMat,
    phase = 0,
    axis = "z",
    amplitude = 0.004
  }) {
    const piece = new THREE.Mesh(geometry, material);
    piece.position.copy(position);
    piece.scale.copy(scaleVector);
    piece.rotation.set(rotation.x, rotation.y, rotation.z);
    hairGroup.add(piece);
    registerHairMotion(piece, axis, amplitude, phase);
    return piece;
  }

  function addBang(x, y, z, width, length, tilt, phase, material = hairMat) {
    addHairPiece({
      geometry: new THREE.ConeGeometry(width * scale, length * scale, 16),
      position: new THREE.Vector3(x * scale, y * scale, z * scale),
      rotation: new THREE.Euler(Math.PI * 0.5, 0, tilt),
      material,
      phase,
      amplitude: 0.003
    });
  }

  function addSideburn(x, phase) {
    addHairPiece({
      geometry: new THREE.CapsuleGeometry(0.045 * scale, 0.24 * scale, 8, 12),
      position: new THREE.Vector3(x * scale, -0.04 * scale, 0.22 * scale),
      scaleVector: new THREE.Vector3(0.86, 1, 0.7),
      rotation: new THREE.Euler(0.16, 0, x < 0 ? -0.2 : 0.2),
      material: hairDarkMat,
      phase,
      amplitude: 0.002
    });
  }

  function addHairSpike(x, y, z, radius, length, tiltX, tiltZ, phase, material = hairMat) {
    addHairPiece({
      geometry: new THREE.ConeGeometry(radius * scale, length * scale, 12),
      position: new THREE.Vector3(x * scale, y * scale, z * scale),
      rotation: new THREE.Euler(tiltX, 0, tiltZ),
      material,
      phase,
      amplitude: 0.003
    });
  }

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(isSoftSpiky ? 0.145 * scale : 0.138 * scale, 0.2 * scale, 8, 12),
    outfitMat
  );
  torso.position.y = 0.47 * scale;
  torso.scale.set(isSoftSpiky ? 1.1 : 1.04, isSoftSpiky ? 1.04 : 1.02, isSoftSpiky ? 0.82 : 0.78);
  bodyRoot.add(torso);

  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(isSoftSpiky ? 0.088 * scale : 0.072 * scale, 0.018 * scale, 10, 18),
    shirtMat
  );
  collar.position.set(0, isSoftSpiky ? 0.58 * scale : 0.56 * scale, 0.025 * scale);
  collar.rotation.x = Math.PI / 2;
  bodyRoot.add(collar);

  if (!isSoftSpiky) {
    const chestPanel = new THREE.Mesh(new THREE.SphereGeometry(0.09 * scale, 18, 18), shirtMat);
    chestPanel.position.set(0, 0.45 * scale, 0.1 * scale);
    chestPanel.scale.set(0.92, 0.82, 0.28);
    bodyRoot.add(chestPanel);
  }

  const armLeft = new THREE.Mesh(
    new THREE.CapsuleGeometry(isSoftSpiky ? 0.05 * scale : 0.044 * scale, isSoftSpiky ? 0.22 * scale : 0.2 * scale, 8, 10),
    outfitMat
  );
  armLeft.position.set(-0.18 * scale, 0.44 * scale, 0);
  armLeft.rotation.z = -0.16;
  bodyRoot.add(armLeft);

  const armRight = armLeft.clone();
  armRight.position.x *= -1;
  armRight.rotation.z = 0.1;
  bodyRoot.add(armRight);

  const handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.052 * scale, 16, 16), skinMat);
  handLeft.position.set(-0.23 * scale, 0.28 * scale, 0.01 * scale);
  bodyRoot.add(handLeft);

  const handRight = handLeft.clone();
  handRight.position.x *= -1;
  bodyRoot.add(handRight);

  const cuffLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.048 * scale, 0.05 * scale, 0.03 * scale, 14), cuffMat);
  cuffLeft.position.set(-0.23 * scale, 0.31 * scale, 0.01 * scale);
  cuffLeft.rotation.z = -0.1;
  bodyRoot.add(cuffLeft);

  const cuffRight = cuffLeft.clone();
  cuffRight.position.x *= -1;
  cuffRight.rotation.z *= -1;
  bodyRoot.add(cuffRight);

  const legLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.052 * scale, 0.22 * scale, 8, 10), pantsMat);
  legLeft.position.set(-0.062 * scale, 0.13 * scale, 0);
  bodyRoot.add(legLeft);

  const legRight = legLeft.clone();
  legRight.position.x *= -1;
  bodyRoot.add(legRight);

  const shoeLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.066 * scale, 0.095 * scale, 8, 12), shoeMat);
  shoeLeft.position.set(-0.062 * scale, -0.035 * scale, 0.045 * scale);
  shoeLeft.rotation.x = Math.PI / 2;
  shoeLeft.scale.set(1, 0.78, 1.12);
  bodyRoot.add(shoeLeft);

  const shoeRight = shoeLeft.clone();
  shoeRight.position.x *= -1;
  bodyRoot.add(shoeRight);

  if (outfitStyle === "olive-hoodie") {
    const hoodBack = new THREE.Mesh(new THREE.TorusGeometry(0.12 * scale, 0.045 * scale, 12, 22), outfitMat);
    hoodBack.position.set(0, 0.56 * scale, -0.08 * scale);
    hoodBack.scale.set(1.02, 1.16, 0.72);
    hoodBack.rotation.x = Math.PI / 2;
    bodyRoot.add(hoodBack);

    const hoodLip = new THREE.Mesh(new THREE.TorusGeometry(0.092 * scale, 0.018 * scale, 10, 20), detailMat);
    hoodLip.position.set(0, 0.58 * scale, 0.005 * scale);
    hoodLip.rotation.x = Math.PI / 2;
    bodyRoot.add(hoodLip);

    const hoodieFrontLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.074 * scale, 0.145 * scale, 8, 10), outfitMat);
    hoodieFrontLeft.position.set(-0.052 * scale, 0.46 * scale, 0.11 * scale);
    hoodieFrontLeft.scale.set(0.9, 1.02, 0.34);
    hoodieFrontLeft.rotation.z = -0.06;
    bodyRoot.add(hoodieFrontLeft);

    const hoodieFrontRight = hoodieFrontLeft.clone();
    hoodieFrontRight.position.x *= -1;
    hoodieFrontRight.rotation.z *= -1;
    bodyRoot.add(hoodieFrontRight);

    const zipperGap = new THREE.Mesh(new THREE.BoxGeometry(0.018 * scale, 0.21 * scale, 0.038 * scale), shirtMat);
    zipperGap.position.set(0, 0.455 * scale, 0.138 * scale);
    bodyRoot.add(zipperGap);

    const knitPanel = new THREE.Mesh(new THREE.CapsuleGeometry(0.048 * scale, 0.095 * scale, 8, 10), shirtMat);
    knitPanel.position.set(0, 0.435 * scale, 0.132 * scale);
    knitPanel.scale.set(0.68, 0.92, 0.16);
    bodyRoot.add(knitPanel);

    for (let index = 0; index < 3; index += 1) {
      const cable = new THREE.Mesh(new THREE.BoxGeometry(0.012 * scale, 0.12 * scale, 0.012 * scale), detailMat);
      cable.position.set((-0.028 + index * 0.028) * scale, 0.438 * scale, 0.154 * scale);
      cable.rotation.z = (index - 1) * 0.08;
      bodyRoot.add(cable);
    }

    for (const side of [-1, 1]) {
      const drawstring = new THREE.Mesh(new THREE.CylinderGeometry(0.006 * scale, 0.006 * scale, 0.16 * scale, 6), detailMat);
      drawstring.position.set(side * 0.052 * scale, 0.5 * scale, 0.15 * scale);
      drawstring.rotation.z = side * 0.18;
      bodyRoot.add(drawstring);

      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.052 * scale, 0.045 * scale, 0.012 * scale), cuffMat);
      pocket.position.set(side * 0.08 * scale, 0.37 * scale, 0.154 * scale);
      pocket.rotation.z = side * 0.08;
      bodyRoot.add(pocket);
    }
  } else {
    const jacketFront = new THREE.Mesh(new THREE.CapsuleGeometry(0.116 * scale, 0.165 * scale, 8, 10), outfitMat);
    jacketFront.position.set(0, 0.47 * scale, 0.06 * scale);
    jacketFront.scale.set(1.02, 1.02, 0.44);
    bodyRoot.add(jacketFront);

    const innerShirt = new THREE.Mesh(new THREE.CapsuleGeometry(0.072 * scale, 0.105 * scale, 8, 10), detailMat);
    innerShirt.position.set(0, 0.44 * scale, 0.122 * scale);
    innerShirt.scale.set(0.76, 0.9, 0.18);
    bodyRoot.add(innerShirt);

    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.014 * scale, 0.22 * scale, 0.022 * scale), shirtMat);
    placket.position.set(0, 0.47 * scale, 0.138 * scale);
    bodyRoot.add(placket);

    const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06 * scale, 0.035 * scale, 0.014 * scale), shirtMat);
    collarLeft.position.set(-0.045 * scale, 0.56 * scale, 0.148 * scale);
    collarLeft.rotation.z = -0.32;
    bodyRoot.add(collarLeft);

    const collarRight = collarLeft.clone();
    collarRight.position.x *= -1;
    collarRight.rotation.z *= -1;
    bodyRoot.add(collarRight);

    for (const side of [-1, 1]) {
      const chestPocket = new THREE.Mesh(new THREE.BoxGeometry(0.048 * scale, 0.042 * scale, 0.012 * scale), cuffMat);
      chestPocket.position.set(side * 0.075 * scale, 0.45 * scale, 0.154 * scale);
      chestPocket.rotation.z = side * -0.05;
      bodyRoot.add(chestPocket);

      const cuffBand = new THREE.Mesh(new THREE.CylinderGeometry(0.052 * scale, 0.052 * scale, 0.018 * scale, 12), detailMat);
      cuffBand.position.set(side * 0.23 * scale, 0.31 * scale, 0.014 * scale);
      cuffBand.rotation.z = side * -0.1;
      bodyRoot.add(cuffBand);
    }
  }

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * scale, 0.065 * scale, 0.09 * scale, 16), skinMat);
  neck.position.y = 0.72 * scale;
  bodyRoot.add(neck);

  const headPivot = new THREE.Group();
  headPivot.position.y = 1.16 * scale;
  bodyRoot.add(headPivot);

  const headCore = new THREE.Group();
  headPivot.add(headCore);

  const faceGroup = new THREE.Group();
  faceGroup.position.set(0, 0.015 * scale, 0.405 * scale);
  headPivot.add(faceGroup);

  headPivot.add(hairGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42 * scale, 44, 36), skinMat);
  head.position.y = 0.02 * scale;
  head.scale.set(0.94, 1.12, 0.9);
  headCore.add(head);

  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.29 * scale, 28, 22), skinMat);
  jaw.position.set(0, -0.27 * scale, 0.035 * scale);
  jaw.scale.set(0.98, 0.72, 0.82);
  headCore.add(jaw);

  const earOuterLeft = new THREE.Mesh(new THREE.SphereGeometry(0.055 * scale, 16, 14), skinMat);
  earOuterLeft.position.set(-0.405 * scale, -0.01 * scale, 0.045 * scale);
  earOuterLeft.scale.set(0.68, 0.92, 0.52);
  headCore.add(earOuterLeft);

  const earOuterRight = earOuterLeft.clone();
  earOuterRight.position.x *= -1;
  headCore.add(earOuterRight);

  const earInnerLeft = new THREE.Mesh(new THREE.SphereGeometry(0.023 * scale, 12, 10), earInnerMat);
  earInnerLeft.position.set(-0.404 * scale, -0.01 * scale, 0.074 * scale);
  earInnerLeft.scale.set(0.48, 0.8, 0.3);
  headCore.add(earInnerLeft);

  const earInnerRight = earInnerLeft.clone();
  earInnerRight.position.x *= -1;
  headCore.add(earInnerRight);

  if (isSoftSpiky) {
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.19 * scale, 24, 16),
      position: new THREE.Vector3(0, 0.36 * scale, -0.01 * scale),
      scaleVector: new THREE.Vector3(1.06, 0.62, 0.96),
      rotation: new THREE.Euler(0, 0, 0),
      material: hairMat,
      axis: "y",
      phase: 0.04,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.42 * scale, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.64),
      position: new THREE.Vector3(0, 0.17 * scale, -0.02 * scale),
      scaleVector: new THREE.Vector3(1.04, 0.82, 1),
      rotation: new THREE.Euler(-0.02, 0, 0),
      material: hairMat,
      axis: "y",
      phase: 0.08,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.36 * scale, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.7),
      position: new THREE.Vector3(0, 0.02 * scale, -0.18 * scale),
      scaleVector: new THREE.Vector3(1.12, 0.98, 0.82),
      rotation: new THREE.Euler(0.3, 0, 0),
      material: hairDarkMat,
      axis: "y",
      phase: 0.14,
      amplitude: 0.001
    });
    addHairSpike(-0.22, 0.38, -0.02, 0.06, 0.17, -0.2, -0.62, 0.22);
    addHairSpike(-0.08, 0.44, 0.01, 0.058, 0.19, -0.1, -0.2, 0.28);
    addHairSpike(0.08, 0.45, 0.01, 0.058, 0.19, 0.08, 0.18, 0.34);
    addHairSpike(0.22, 0.39, -0.02, 0.06, 0.17, 0.22, 0.6, 0.4);
    addHairSpike(-0.3, 0.31, -0.07, 0.052, 0.16, -0.08, -0.86, 0.43);
    addHairSpike(0.31, 0.32, -0.08, 0.05, 0.15, 0.12, 0.84, 0.45);
    addHairSpike(0, 0.49, -0.02, 0.052, 0.16, -0.08, 0.02, 0.46);
    addBang(-0.19, 0.08, 0.34, 0.074, 0.22, 0.42, 0.48);
    addBang(-0.05, 0.06, 0.37, 0.076, 0.25, 0.12, 0.54);
    addBang(0.08, 0.06, 0.36, 0.074, 0.24, -0.18, 0.6);
    addBang(0.2, 0.08, 0.33, 0.066, 0.2, -0.48, 0.66);
    addBang(-0.28, 0.04, 0.27, 0.052, 0.18, 0.74, 0.69, hairDarkMat);
    addBang(0.29, 0.04, 0.26, 0.05, 0.17, -0.76, 0.71, hairDarkMat);
    addSideburn(-0.31, 0.72);
    addSideburn(0.31, 0.78);
  } else {
    const partBias = hairFlip >= 0 ? 1 : -1;
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.2 * scale, 24, 18),
      position: new THREE.Vector3(0, 0.36 * scale, -0.005 * scale),
      scaleVector: new THREE.Vector3(1.08, 0.72, 0.98),
      rotation: new THREE.Euler(0, 0, 0),
      material: hairMat,
      axis: "y",
      phase: 0.04,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.16 * scale, 20, 16),
      position: new THREE.Vector3(0.06 * partBias * scale, 0.29 * scale, 0.02 * scale),
      scaleVector: new THREE.Vector3(1.18, 0.42, 0.74),
      rotation: new THREE.Euler(0.02, 0.18 * partBias, 0),
      material: hairDarkMat,
      axis: "x",
      phase: 0.06,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.43 * scale, 40, 28),
      position: new THREE.Vector3(0, 0.18 * scale, -0.02 * scale),
      scaleVector: new THREE.Vector3(1.02, 0.84, 0.98),
      rotation: new THREE.Euler(-0.03, 0, 0),
      material: hairMat,
      axis: "y",
      phase: 0.08,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.SphereGeometry(0.34 * scale, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.6),
      position: new THREE.Vector3(0, 0.02 * scale, -0.18 * scale),
      scaleVector: new THREE.Vector3(1.08, 0.88, 0.78),
      rotation: new THREE.Euler(0.28, 0, 0),
      material: hairDarkMat,
      axis: "y",
      phase: 0.14,
      amplitude: 0.001
    });
    addHairPiece({
      geometry: new THREE.CapsuleGeometry(0.055 * scale, 0.16 * scale, 8, 10),
      position: new THREE.Vector3(-0.24 * partBias * scale, 0.14 * scale, 0.04 * scale),
      scaleVector: new THREE.Vector3(0.9, 1.08, 0.74),
      rotation: new THREE.Euler(0.14, -0.06 * partBias, -0.34 * partBias),
      material: hairDarkMat,
      phase: 0.18,
      amplitude: 0.002
    });
    addHairPiece({
      geometry: new THREE.CapsuleGeometry(0.055 * scale, 0.16 * scale, 8, 10),
      position: new THREE.Vector3(0.24 * partBias * scale, 0.14 * scale, 0.04 * scale),
      scaleVector: new THREE.Vector3(0.88, 1.04, 0.72),
      rotation: new THREE.Euler(0.1, 0.04 * partBias, 0.26 * partBias),
      material: hairDarkMat,
      phase: 0.24,
      amplitude: 0.002
    });
    addHairSpike(-0.08 * partBias, 0.44, -0.01, 0.046, 0.12, -0.14, -0.14 * partBias, 0.2, hairDarkMat);
    addHairSpike(0.08 * partBias, 0.45, -0.01, 0.046, 0.12, 0.14, 0.16 * partBias, 0.26, hairDarkMat);
    addHairSpike(-0.02 * partBias, 0.5, -0.02, 0.052, 0.15, -0.12, -0.08 * partBias, 0.28, hairDarkMat);
    addHairSpike(-0.18 * partBias, 0.35, 0.0, 0.05, 0.14, -0.16, -0.5 * partBias, 0.22);
    addHairSpike(0.16 * partBias, 0.37, 0.02, 0.052, 0.15, 0.12, 0.42 * partBias, 0.3);
    addHairSpike(-0.3 * partBias, 0.28, 0.0, 0.046, 0.16, -0.08, -0.78 * partBias, 0.34);
    addHairSpike(0.28 * partBias, 0.29, 0.0, 0.044, 0.15, 0.08, 0.72 * partBias, 0.38);
    addHairSpike(-0.3 * partBias, 0.08, -0.08, 0.04, 0.12, 0.42, -0.36 * partBias, 0.36, hairDarkMat);
    addHairSpike(0.28 * partBias, 0.1, -0.08, 0.04, 0.12, 0.4, 0.3 * partBias, 0.42, hairDarkMat);
    addBang(-0.16 * partBias, 0.09, 0.35, 0.064, 0.2, 0.28 * partBias, 0.4);
    addBang(0.02 * partBias, 0.07, 0.37, 0.07, 0.22, -0.04 * partBias, 0.48);
    addBang(0.18 * partBias, 0.08, 0.34, 0.06, 0.18, -0.36 * partBias, 0.56);
    addBang(-0.3 * partBias, 0.08, 0.28, 0.052, 0.18, 0.6 * partBias, 0.6, hairDarkMat);
    addBang(0.3 * partBias, 0.08, 0.27, 0.048, 0.17, -0.58 * partBias, 0.64, hairDarkMat);
    addSideburn(-0.28, 0.62);
    addSideburn(0.28, 0.68);
  }

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.56 * scale, 0.62 * scale),
    new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      alphaTest: 0.05,
      depthTest: false
    })
  );
  face.position.set(0, 0.01 * scale, 0.03 * scale);
  face.renderOrder = 12;
  faceGroup.add(face);

  const emote = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62 * scale, 0.46 * scale),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.96 })
  );
  emote.position.set(0, 2.55 * scale, 0);
  emote.visible = false;
  root.add(emote);

  world.add(root);

  return {
    root,
    bodyRoot,
    headPivot,
    torso,
    armLeft,
    armRight,
    legLeft,
    legRight,
    face,
    hairGroup,
    hairMotionNodes,
    emote,
    shadow,
    sitAmount: 0,
    actionType: null,
    actionStartedAt: 0,
    actionUntil: 0,
    emoteUntil: 0,
    currentEmote: null
  };
}

  function animateCharacter(character, elapsedTime, moveAmount = 0, idleOffset = 0) {
    const swing = Math.sin(elapsedTime * 8 + idleOffset) * moveAmount;
    const bounce = Math.sin(elapsedTime * 2.4 + idleOffset);
    const shoulderRoll = Math.sin(elapsedTime * 3.2 + idleOffset) * 0.03;
    const sitWave = Math.sin(elapsedTime * 2.8 + idleOffset);
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
    character.headPivot.rotation.z = Math.sin(elapsedTime * 1.6 + idleOffset) * 0.02;
    character.armLeft.rotation.z = -0.3 - swing * 0.38 + character.sitAmount * 0.18;
    character.armRight.rotation.z = 0.3 + swing * 0.38 - character.sitAmount * 0.18;
    character.armLeft.rotation.x = 0.04 + moveAmount * 0.06;
    character.armRight.rotation.x = -0.04 - moveAmount * 0.06;
    character.legLeft.rotation.x = swing * 0.38 - character.sitAmount * 1.18;
    character.legRight.rotation.x = -swing * 0.38 - character.sitAmount * 1.18;
    character.torso.rotation.x = -character.sitAmount * 0.15 + bounce * 0.01;
    character.torso.rotation.z = -shoulderRoll * 0.8;

    if (character.sitAmount > 0.08) {
      const sitBlend = character.sitAmount;
      character.bodyRoot.position.y -= sitBlend * 0.06;
      character.torso.rotation.x -= sitBlend * 0.22;
      character.headPivot.rotation.x -= sitBlend * 0.06;
      character.headPivot.rotation.z += sitWave * 0.012 * sitBlend;
      character.armLeft.rotation.z = THREE.MathUtils.lerp(character.armLeft.rotation.z, -0.72, sitBlend);
      character.armRight.rotation.z = THREE.MathUtils.lerp(character.armRight.rotation.z, 0.72, sitBlend);
      character.armLeft.rotation.x = THREE.MathUtils.lerp(character.armLeft.rotation.x, -0.56 + sitWave * 0.04, sitBlend);
      character.armRight.rotation.x = THREE.MathUtils.lerp(character.armRight.rotation.x, -0.56 - sitWave * 0.04, sitBlend);
      character.legLeft.rotation.x = THREE.MathUtils.lerp(character.legLeft.rotation.x, -1.42, sitBlend);
      character.legRight.rotation.x = THREE.MathUtils.lerp(character.legRight.rotation.x, -1.42, sitBlend);
    }

    if (actionType === "wave") {
      character.armRight.rotation.z = 0.92;
      character.armRight.rotation.x = -0.68 + actionWave * 0.18;
      character.headPivot.rotation.z += 0.08 * actionPulse;
      character.bodyRoot.position.y += actionPulse * 0.05;
    } else if (actionType === "bow") {
      character.torso.rotation.x += 0.42 * actionPulse;
      character.headPivot.rotation.x += 0.16 * actionPulse;
      character.armLeft.rotation.z = -0.18;
      character.armRight.rotation.z = 0.18;
      character.bodyRoot.position.y -= actionPulse * 0.03;
    } else if (actionType === "jump") {
      character.bodyRoot.position.y += actionPulse * 0.34;
      character.armLeft.rotation.z = -0.9;
      character.armRight.rotation.z = 0.9;
      character.legLeft.rotation.x += -0.48 * actionPulse;
      character.legRight.rotation.x += -0.48 * actionPulse;
      character.headPivot.rotation.x -= 0.08 * actionPulse;
    } else if (actionType === "hop") {
      character.bodyRoot.position.y += actionPulse * 0.2;
      character.armLeft.rotation.z = -0.56;
      character.armRight.rotation.z = 0.56;
      character.headPivot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.08 * actionPulse;
    } else if (actionType === "cheer") {
      character.bodyRoot.position.y += actionPulse * 0.24;
      character.armLeft.rotation.z = -1.04 + actionWave * 0.1;
      character.armRight.rotation.z = 1.04 - actionWave * 0.1;
      character.armLeft.rotation.x = -0.28;
      character.armRight.rotation.x = -0.28;
    } else if (actionType === "sway") {
      character.bodyRoot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.12 * actionPulse;
      character.armLeft.rotation.z = -0.26 - actionPulse * 0.08;
      character.armRight.rotation.z = 0.26 + actionPulse * 0.08;
      character.headPivot.rotation.z += Math.sin(actionProgress * Math.PI * 2) * 0.08 * actionPulse;
    } else if (actionType === "high-five-right") {
      character.bodyRoot.position.y += actionPulse * 0.12;
      character.torso.rotation.z -= 0.12 * actionPulse;
      character.armRight.rotation.z = 1.18;
      character.armRight.rotation.x = -0.44 + actionPulse * 0.18;
      character.armLeft.rotation.z = -0.2;
    } else if (actionType === "high-five-left") {
      character.bodyRoot.position.y += actionPulse * 0.12;
      character.torso.rotation.z += 0.12 * actionPulse;
      character.armLeft.rotation.z = -1.18;
      character.armLeft.rotation.x = -0.44 + actionPulse * 0.18;
      character.armRight.rotation.z = 0.2;
    }

    character.hairMotionNodes?.forEach((motion, index) => {
      const offset =
        Math.sin(elapsedTime * (2 + moveAmount * 3) + idleOffset + motion.phase + index * 0.12) *
        motion.amplitude;
      motion.mesh.rotation.x = motion.baseRotationX + (motion.axis === "x" ? offset : 0);
      motion.mesh.rotation.y = motion.baseRotationY + (motion.axis === "y" ? offset : 0);
      motion.mesh.rotation.z = motion.baseRotationZ + (motion.axis === "z" ? offset : 0);
    });

    const emoteFloat = Math.sin(elapsedTime * 4.2 + idleOffset) * 0.04;
    const emoteDrift = Math.sin(elapsedTime * 2.1 + idleOffset) * 0.05;
    const emotePulse = 1 + actionPulse * 0.18 + moveAmount * 0.04;
    character.emote.quaternion.copy(camera.quaternion);
    character.emote.position.x = emoteDrift;
    character.emote.position.y = 2.5 - character.sitAmount * 0.18 + emoteFloat + actionPulse * 0.12;
    character.emote.position.z = 0;
    character.emote.rotation.z = Math.sin(elapsedTime * 3.6 + idleOffset) * 0.05 + actionPulse * 0.1;
    character.emote.scale.setScalar(emotePulse);
    character.shadow.scale.setScalar(1 - moveAmount * 0.06 + Math.sin(elapsedTime * 4 + idleOffset) * 0.02);
    clearCharacterEmote(character, elapsedTime);
  }

  return {
    createFaceTexture,
    createStylizedCharacter,
    triggerPresetEmote,
    triggerPairedHighFive,
    setCharacterEmote,
    animateCharacter
  };
}
