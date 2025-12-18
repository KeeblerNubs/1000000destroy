const embedGifInput = document.getElementById('embed-gif');
const embedPayloadInput = document.getElementById('embed-payload');
const embedOutputInput = document.getElementById('embed-output');
const embedStatus = document.getElementById('embed-status');

const extractGifInput = document.getElementById('extract-gif');
const extractOutputInput = document.getElementById('extract-output');
const extractStatus = document.getElementById('extract-status');

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.className = `status ${isError ? 'error' : 'success'}`;
}

async function selectAndSet(inputEl, picker) {
  const result = await picker();
  if (result) {
    inputEl.value = result;
  }
}

document.getElementById('browse-embed-gif').addEventListener('click', () => {
  selectAndSet(embedGifInput, () => window.api.selectGif());
});

document
  .getElementById('browse-embed-payload')
  .addEventListener('click', () => {
    selectAndSet(embedPayloadInput, () => window.api.selectPayload());
  });

document
  .getElementById('browse-embed-output')
  .addEventListener('click', () => {
    const defaultPath = embedGifInput.value
      ? embedGifInput.value.replace(/\.gif$/i, '_with_payload.gif')
      : undefined;
    selectAndSet(embedOutputInput, () => window.api.selectOutputGif(defaultPath));
  });

document.getElementById('browse-extract-gif').addEventListener('click', () => {
  selectAndSet(extractGifInput, () => window.api.selectGif());
});

document
  .getElementById('browse-extract-output')
  .addEventListener('click', () => {
    const defaultPath = extractGifInput.value
      ? extractGifInput.value.replace(/\.gif$/i, '_payload.bin')
      : undefined;
    selectAndSet(extractOutputInput, () => window.api.selectOutputPayload(defaultPath));
  });

async function handleEmbed() {
  if (!embedGifInput.value || !embedPayloadInput.value || !embedOutputInput.value) {
    setStatus(embedStatus, 'Select a GIF, payload, and output location.', true);
    return;
  }
  setStatus(embedStatus, 'Embedding payload...');
  try {
    await window.api.embed(embedGifInput.value, embedPayloadInput.value, embedOutputInput.value);
    setStatus(embedStatus, `Payload embedded to ${embedOutputInput.value}`);
  } catch (error) {
    setStatus(embedStatus, error.message, true);
  }
}

async function handleExtract() {
  if (!extractGifInput.value || !extractOutputInput.value) {
    setStatus(extractStatus, 'Select a GIF and output location.', true);
    return;
  }
  setStatus(extractStatus, 'Extracting payload...');
  try {
    await window.api.extract(extractGifInput.value, extractOutputInput.value);
    setStatus(extractStatus, `Payload saved to ${extractOutputInput.value}`);
  } catch (error) {
    setStatus(extractStatus, error.message, true);
  }
}

document.getElementById('run-embed').addEventListener('click', handleEmbed);
document.getElementById('run-extract').addEventListener('click', handleExtract);
