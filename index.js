const flames = document.querySelectorAll(".flame");

function blowCandles() {
  flames.forEach(flame => {
    flame.classList.add("off");
    // Add smoke effect or something
    const smoke = document.createElement("div");
    smoke.className = "smoke";
    flame.parentElement.appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000);
  });
}

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

      console.log('Volume:', volume); // Debug

      if (volume > 20) {  // Lower threshold
        blowCandles();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  })
  .catch(err => {
    console.log("Microphone access denied", err);
  });
