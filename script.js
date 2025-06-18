const recordBtn = document.getElementById('recordBtn');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recordBtn.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById('output').innerText = `You: ${transcript}`;
  fetchResponseFromGemini(transcript);
});

async function fetchResponseFromGemini(prompt) {
  try {
    const response = await fetch('http://localhost:5000/get-gemini-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    speakText(data.response);
    document.getElementById('output').innerText += `\nAssistant: ${data.response}`;
  } catch (error) {
    console.error('Error:', error);
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  utterance.onstart = () => {
    document.dispatchEvent(new Event('avatarSpeaking'));
  };
  utterance.onend = () => {
    document.dispatchEvent(new Event('avatarStopSpeaking'));
  };

  window.speechSynthesis.speak(utterance);
}
