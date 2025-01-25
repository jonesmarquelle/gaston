document.addEventListener('DOMContentLoaded', async () => {
  let EMBED_PASSTHROUGH_URL = 'http://localhost:3000';
  
  // Load saved URL from storage
  const result = await chrome.storage.sync.get('serverUrl');
  if (result.serverUrl) {
    EMBED_PASSTHROUGH_URL = result.serverUrl;
  }

  // Get the current active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const finalUrl = `${EMBED_PASSTHROUGH_URL}/?url=${encodeURIComponent(url)}`;
    const urlDisplay = document.getElementById('url-display');
    urlDisplay.textContent = finalUrl;
  });

  // Copy URL functionality
  document.getElementById('copy-button').addEventListener('click', () => {
    const urlDisplay = document.getElementById('url-display');
    navigator.clipboard.writeText(urlDisplay.textContent).then(() => {
      const button = document.getElementById('copy-button');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy URL';
      }, 1500);
    });
  });

  // Settings modal functionality
  const modal = document.getElementById('settings-modal');
  const settingsButton = document.getElementById('settings-button');
  const saveButton = document.getElementById('save-settings');
  const cancelButton = document.getElementById('cancel-settings');
  const serverUrlInput = document.getElementById('server-url');

  // Set initial value
  serverUrlInput.value = EMBED_PASSTHROUGH_URL;

  settingsButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  saveButton.addEventListener('click', async () => {
    const newUrl = serverUrlInput.value.trim();
    if (newUrl) {
      await chrome.storage.sync.set({ serverUrl: newUrl });
      EMBED_PASSTHROUGH_URL = newUrl;
      
      // Update displayed URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const finalUrl = `${EMBED_PASSTHROUGH_URL}/?url=${encodeURIComponent(url)}`;
        const urlDisplay = document.getElementById('url-display');
        urlDisplay.textContent = finalUrl;
      });
    }
    modal.style.display = 'none';
  });

  cancelButton.addEventListener('click', () => {
    serverUrlInput.value = EMBED_PASSTHROUGH_URL;
    modal.style.display = 'none';
  });
}); 