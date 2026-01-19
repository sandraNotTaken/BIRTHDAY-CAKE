const flames = document.querySelectorAll(".flame");

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

        if (volume > 40) {
          flames.forEach(flame => flame.classList.add("off"));
        }

        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    })
    .catch(err => {
      console.log("Microphone access denied", err);
    });
