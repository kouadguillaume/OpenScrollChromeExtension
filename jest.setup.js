// Mock Chrome extension API for testing
import { chrome } from 'jest-chrome';

// Make Chrome API available globally for tests
global.chrome = chrome;

// Mock browser.runtime.getURL
chrome.runtime.getURL.mockImplementation((path) => `chrome-extension://mock-extension-id/${path}`);

// Mock browser.storage.local
chrome.storage.local.get.mockImplementation((keys, callback) => {
  if (typeof keys === 'function') {
    callback = keys;
    keys = [];
  } else if (Array.isArray(keys)) {
    keys = keys || [];
  } else if (keys === null || typeof keys === 'undefined') {
    keys = [];
  } else {
    keys = Object.keys(keys);
  }
  
  const result = {};
  keys.forEach(key => {
    result[key] = chrome.storage.local.store[key];
  });
  
  if (callback) {
    Promise.resolve(result).then(callback);
  }
  
  return Promise.resolve(result);
});

chrome.storage.local.set.mockImplementation((items, callback) => {
  chrome.storage.local.store = {
    ...chrome.storage.local.store,
    ...items,
  };
  
  if (callback) {
    Promise.resolve().then(callback);
  }
  
  return Promise.resolve();
});

// Reset mocks before each test
beforeEach(() => {
  chrome.storage.local.store = {};
  jest.clearAllMocks();
});
