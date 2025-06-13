function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = isError ? 'red' : 'green';
  status.style.opacity = '1';
  status.style.transition = 'opacity 0.3s ease-in-out';

  setTimeout(() => {
    status.style.opacity = '0';
    setTimeout(() => {
      status.textContent = '';
      status.style.color = 'inherit';
    }, 300);
  }, 2000);
}

function updateButtonFeedback(button, success) {
  button.classList.add(success ? 'success' : 'error');
  setTimeout(() => button.classList.remove(success ? 'success' : 'error'), 1000);
}

const exportButton = document.getElementById('exportJson');
const saveButton = document.getElementById('saveToMongo');

exportButton.addEventListener('click', async () => {
  exportButton.disabled = true;
  saveButton.disabled = true;
  showStatus('Exporting...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeConversation' });
    if (response.error) throw new Error(response.error);

    await chrome.tabs.sendMessage(tab.id, { action: 'downloadConversation' });
    showStatus('Exported successfully!');
    updateButtonFeedback(exportButton, true);
  } catch (error) {
    console.error('Error during export:', error);
    showStatus(`Export Error: ${error.message}`, true);
    updateButtonFeedback(exportButton, false);
  } finally {
    exportButton.disabled = false;
    saveButton.disabled = false;
  }
});

saveButton.addEventListener('click', async () => {
  exportButton.disabled = true;
  saveButton.disabled = true;
  showStatus('Saving...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeConversation' });
    if (response.error) throw new Error(response.error);

    const saveResponse = await chrome.runtime.sendMessage({
      action: 'saveToScroll',
      data: response
    });

    showStatus('Saved successfully!');
    updateButtonFeedback(saveButton, true);
  } catch (error) {
    console.error('Error during save:', error);
    showStatus(`Save Error: ${error.message}`, true);
    updateButtonFeedback(saveButton, false);
  } finally {
    exportButton.disabled = false;
    saveButton.disabled = false;
  }
});
