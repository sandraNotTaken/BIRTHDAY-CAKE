const flames = document.querySelectorAll(".flame");
const candles = document.querySelectorAll(".candle");

let blowCounter = 0;

function blowCandles() {
  flames.forEach(flame => {
    flame.classList.add("off");
    // Add smoke effect or something
    const smoke = document.createElement("div");
    smoke.className = "smoke";
    flame.parentElement.appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000);
  });
  // Celebration
  celebrate();
}

function relightCandles() {
  flames.forEach(flame => flame.classList.remove("off"));
}

function celebrate() {
  const name = "Alex"; // Hardcoded name
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 2 + "s";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
  // Add celebration message
  const message = document.createElement("div");
  message.className = "celebration-message";
  message.textContent = `🎉 Happy Birthday, ${name}! 🎉`;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 5000);
}

candles.forEach(candle => {
  candle.addEventListener("click", relightCandles);
});

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    mic.connect(analyser);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 50) {
        blowCounter++;
        if (blowCounter > 10) {  // Require sustained high volume
          blowCandles();
          blowCounter = 0;
        }
      } else {
        blowCounter = 0;
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  })
  .catch(err => {
    console.log("Microphone access denied", err);
  });
