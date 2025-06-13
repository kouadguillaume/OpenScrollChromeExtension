// background.js

async function saveToScroll(data) {
  try {
    const response = await fetch('https://www.openscroll.me/api/chrome-ext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to save to MongoDB');
    }
    return result;
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    throw error;
  }
}

// Auto-activate and elevate visibility on supported sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedSites = [
      'chat.openai.com',
      'chatgpt.com',
      'claude.ai',
      'www.openscroll.me',
      'grok.com',
      'chat.deepseek.com',
      'chat.qwenlm.ai',
      'gemini.google.com',
      'coral.cohere.com',
      'chat.mistral.ai',
      'perplexity.ai'
    ];
    const isSupportedSite = supportedSites.some(site => tab.url.includes(site));

    if (isSupportedSite) {
      console.log('Supported site detected:', tab.url);
      chrome.action.enable(tabId);
      chrome.action.setBadgeText({ tabId: tabId, text: 'ON' });
      chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: '#4CAF50' });
      chrome.action.setIcon({
        tabId: tabId,
        path: {
          "16": "images/icon16.png",
          "32": "images/icon32.png",
          "48": "images/icon48.png",
          "128": "images/icon128.png"
        }
      });

      // Optional: Show a notification to make it more prominent
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'OpenScroll Active',
        message: 'Click the extension button to save your conversation!',
        silent: true
      });
    } else {
      chrome.action.disable(tabId);
      chrome.action.setBadgeText({ tabId: tabId, text: '' });
    }
  }
});

// Handle MongoDB save requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToMongoDB') {
    saveToMongoDB(message.data)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Async response
  }
});

// Context menu for JSON download
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveAsJson',
    title: 'Save Conversation as JSON',
    contexts: ['page'],
    documentUrlPatterns: [
      "*://chat.openai.com/*",
      "*://chatgpt.com/*",
      "*://claude.ai/*",
      "*://www.openscroll.me/*",
      "*://grok.com/*",
      "*://chat.deepseek.com/*",
      "*://chat.qwenlm.ai/*",
      "*://gemini.google.com/*",
      "*://coral.cohere.com/*",
      "*://chat.mistral.ai/*",
      "*://www.perplexity.ai/*"
    ]
  });

  const details = { reason: chrome.runtime.lastError ? 'update' : 'install' };
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'onboarding.html' });
  } else if (details.reason === 'update') {
    const currentVersion = chrome.runtime.getManifest().version;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: 'OpenScroll Updated',
      message: `Updated to version ${currentVersion}. Check out the new features!`
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveAsJson' && tab) {
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'downloadConversation' },
      (response) => {
        if (chrome.runtime.lastError || response.error) {
          console.error('Download error:', chrome.runtime.lastError || response.error);
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Save Failed',
            message: 'Failed to save conversation as JSON.'
          });
        } else {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Save Successful',
            message: 'Conversation saved as JSON.'
          });
        }
      }
    );
  }
});