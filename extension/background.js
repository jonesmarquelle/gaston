// Create context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'fragmentEmbed',
    title: 'Copy Embed URL',
    contexts: ['selection'],
    type: 'normal'
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'fragmentEmbed' && info.selectionText) {
    if (location.protocol !== 'https:') {
        location.href =`https:${location.href.substring(location.protocol.length)}`;
    }
    // Get the server URL from storage
    const result = await chrome.storage.sync.get('serverUrl');
    const EMBED_PASSTHROUGH_URL = result.serverUrl || 'http://localhost:3000';
    
    // Create the URL with text fragment
    const baseUrl = tab.url.split('#')[0]; // Remove any existing fragments
    const textFragment = encodeURIComponent(info.selectionText.trim());
    const paramUrl = encodeURIComponent(`${baseUrl}#:~:text=${textFragment}`);
    const finalUrl = `${EMBED_PASSTHROUGH_URL}/?url=${paramUrl}`;
    
    // Execute clipboard write in the context of the active tab
    // TODO: Would prefer not to use scripting API if possible
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (url) => navigator.clipboard.writeText(url),
      args: [finalUrl]
    });
  }
}); 