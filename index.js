const flames = document.querySelectorAll(".flame");
const candles = document.querySelectorAll(".candle");
const body = document.body;

let blown = false;
let blowCounter = 0;
let micStarted = false;
let audioCtx, analyser, dataArray;

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

  flames.forEach(flame => {
    flame.classList.add("off");

    const smoke = document.createElement("div");
    smoke.className = "smoke";
    flame.parentElement.appendChild(smoke);

    setTimeout(() => smoke.remove(), 2000);
  });

  showMessage("Make a wish… ✨");
  setTimeout(celebrate, 3000);
}

// CELEBRATION
function celebrate() {
  showMessage("🎉 Happy Birthday Sandra! 🎉");
  const cake = document.querySelector(".cake");
  cake.style.animation = "bounce 1s ease-in-out";
  setTimeout(() => cake.style.animation = "float 5s ease-in-out infinite", 1000);


  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = `hsl(${Math.random() * 360},100%,50%)`;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
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

  // LOWERED THRESHOLD & FRAMES TO MAKE IT EASIER
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