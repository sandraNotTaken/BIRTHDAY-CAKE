const flames = document.querySelectorAll(".flame");
const candles = document.querySelectorAll(".candle");
const cake = document.querySelector(".cake");
const body = document.body;

let blown = false;
let blowCounter = 0;
let micStarted = false;
let audioCtx, analyser, dataArray;
let songPlayed = false;

// Add background birthday song
const birthdaySong = new Audio("birthday-song.mp3"); // put your mp3 file in same folder
birthdaySong.volume = 0.5;

// DOUBLE-CLICK TO TOGGLE DARK MODE AND START MIC
body.addEventListener("dblclick", () => {
  body.classList.toggle("dark");

  if (!micStarted) {
    micStarted = true;
    startMicDetection();
  }
});

// INDIVIDUAL CANDLE RELIGHT
candles.forEach(candle => {
  candle.addEventListener("click", () => {
    const flame = candle.querySelector(".flame");
    flame.classList.remove("off");
    blown = false;
  });
});

// BLOW OUT CANDLES
function blowOut() {
  if (blown) return;
  blown = true;

  // Turn off flames + create smoke
  flames.forEach(flame => {
    flame.classList.add("off");

    const smoke = document.createElement("div");
    smoke.className = "smoke";
    flame.parentElement.appendChild(smoke);

    setTimeout(() => smoke.remove(), 2000);
  });

  // Show make-a-wish message
  showMessage("Make a wish… ✨");

  // Play birthday song once
  if (!songPlayed) {
    birthdaySong.play();
    songPlayed = true;
  }

  // Celebration after short delay
  setTimeout(celebrate, 1000);
}

// CELEBRATION
function celebrate() {
  showMessage("🎉 Happy Birthday! 🎉");

  // Cake bounce
  cake.style.animation = "bounce 1s ease-in-out";
  setTimeout(() => {
    cake.style.animation = "float 5s ease-in-out infinite";
  }, 1000);

  // Generate confetti across full page
  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360},100%,50%)`;
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.width = 6 + Math.random() * 6 + "px";
    confetti.style.height = confetti.style.width;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// MESSAGE HELPER
function showMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2500);
}

// MICROPHONE DETECTION
function startMicDetection() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioCtx = new AudioContext();
      const mic = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();

      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      mic.connect(analyser);

      detectBlow();
    })
    .catch(err => {
      console.log("Microphone access denied", err);
    });
}

// DETECT BLOW
function detectBlow() {
  analyser.getByteFrequencyData(dataArray);

  const volume = dataArray.reduce((a,b) => a + b) / dataArray.length;

  // Lowered threshold & frames for easier blow
  if (volume > 45) {
    blowCounter++;
    if (blowCounter > 10) {
      blowOut();
      blowCounter = 0;
    }
  } else {
    blowCounter = 0;
  }

  requestAnimationFrame(detectBlow);
}