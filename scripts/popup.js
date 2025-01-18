document.addEventListener('DOMContentLoaded', async () => {
    const counterDisplay = document.getElementById('counter');
    const incrementButton = document.getElementById('increment');
    const resetButton = document.getElementById('reset');

    // Where we will expose all the data we retrieve from storage.sync.
    const storageCache = { count: 0 };
    // Asynchronously retrieve data from storage.sync, then cache it.
    const initStorageCache = chrome.storage.sync.get().then((items) => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(storageCache, items);
    });

    await initStorageCache;
    
    let counter = storageCache.count;

    // Update the counter display
    function updateDisplay() {
        counterDisplay.textContent = counter;
    }

    function saveCount() {
        storageCache.count = counter;
        chrome.storage.sync.set(storageCache);
    }

    // Event listeners
    incrementButton.addEventListener('click', () => {
        counter++;
        updateDisplay();
        saveCount();
    });

    resetButton.addEventListener('click', () => {
        counter = 0;
        updateDisplay();
        saveCount();
    });

    // Set initial display
    updateDisplay();
});
