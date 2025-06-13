// Example test file

describe('Example test suite', () => {
  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });

  it('should mock chrome.storage.local', async () => {
    // Test chrome.storage.local.set
    await chrome.storage.local.set({ key: 'value' });
    
    // Test chrome.storage.local.get
    const result = await chrome.storage.local.get('key');
    expect(result).toEqual({ key: 'value' });
  });
});
