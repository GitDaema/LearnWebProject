const cube = document.getElementById("cube");
const rollBtn = document.getElementById("rollBtn");
const result = document.getElementById("result");

// Base rotation (degrees) needed to bring each face value to the front.
const FACE_ROTATION = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 },
};

let currentX = -20;
let currentY = 30;
let isRolling = false;

function roll() {
  if (isRolling) return;
  isRolling = true;
  rollBtn.disabled = true;
  result.textContent = "굴리는 중...";
  result.classList.remove("show");

  const value = Math.floor(Math.random() * 6) + 1;
  const target = FACE_ROTATION[value];

  const extraSpinsX = 3 + Math.floor(Math.random() * 2); // 3~4 full turns
  const extraSpinsY = 4 + Math.floor(Math.random() * 2); // 4~5 full turns

  currentX += extraSpinsX * 360 + normalizeDelta(currentX, target.x);
  currentY += extraSpinsY * 360 + normalizeDelta(currentY, target.y);

  cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

  window.setTimeout(() => {
    result.textContent = `결과: ${value}`;
    result.classList.add("show");
    rollBtn.disabled = false;
    isRolling = false;
  }, 1800);
}

// Shortest angular delta so the target face angle lines up after adding full spins.
function normalizeDelta(current, target) {
  const currentMod = ((current % 360) + 360) % 360;
  const targetMod = ((target % 360) + 360) % 360;
  return targetMod - currentMod;
}

rollBtn.addEventListener("click", roll);
