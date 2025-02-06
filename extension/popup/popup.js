document.addEventListener('DOMContentLoaded', async () => {
  // Load saved URL from storage
  const result = await chrome.storage.sync.get('serverUrl');
  if (result.serverUrl) {
    EMBED_PASSTHROUGH_URL = result.serverUrl;
  }

  const saveButton = document.getElementById('save-settings');
  const resetButton = document.getElementById('reset-settings');
  const serverUrlInput = document.getElementById('server-url');

  // Set initial value
  serverUrlInput.value = EMBED_PASSTHROUGH_URL;

  saveButton.addEventListener('click', async () => {
    const newUrl = serverUrlInput.value.trim();
    if (newUrl) {
      await chrome.storage.sync.set({ serverUrl: newUrl });
      EMBED_PASSTHROUGH_URL = newUrl;
    }
  });

  resetButton.addEventListener('click', () => {
    serverUrlInput.value = '';
    chrome.storage.sync.set({ serverUrl: '' });
  });
}); 