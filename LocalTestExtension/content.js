// content.js

// Common utility functions
function generateConversationId() {
  return window.crypto && window.crypto.randomUUID 
    ? window.crypto.randomUUID() 
    : Date.now().toString();
}

function downloadJSON(data, filename = "conversation.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Domain detection and scraper delegation
async function scrapeConversation() {
  const url = window.location.href;
  let conversation;

  if (url.includes('chatgpt.com')) {
    conversation = await scrapeChatGPT();
  } else if (url.includes('claude.ai')) {
    conversation = await scrapeClaude();
  } else if (url.includes('grok.com')) {
    conversation = await scrapeGrok();
  } else if (url.includes('chat.deepseek.com')) {
    conversation = await scrapeDeepseek();
  } else if (url.includes('chat.qwenlm.ai')) {
    conversation = await scrapeQwenlm();
  } else if (url.includes('gemini.google.com')) {
    conversation = await scrapeGemini();
  } else if (url.includes('coral.cohere.com')) {
    conversation = await scrapeCohere();
  } else if (url.includes('chat.mistral.ai')) {
    conversation = await scrapeMistral();
  } else if (url.includes('perplexity.ai')) {
    conversation = await scrapePerplexity();
  } else {
    return { error: 'Unsupported domain' };
  }

  if (!conversation || conversation.error || !conversation.messages || conversation.messages.length === 0) {
    console.error('Scraping failed or no messages found:', conversation?.error || 'Unknown error');
    return { error: 'No messages found in conversation' };
  }

  return conversation;
}

// Message listener for background actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeConversation') {
    scrapeConversation()
      .then(data => sendResponse(data))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  
  if (request.action === 'downloadConversation') {
    scrapeConversation()
      .then(data => {
        downloadJSON(data);
        sendResponse({ success: true });
      })
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});