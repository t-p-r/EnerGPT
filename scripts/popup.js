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


document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0};
        const weeklyUsage = data.weeklyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0};

        document.getElementById('daily-prompts').textContent = dailyUsage.prompts;
        document.getElementById('daily-energy').textContent = dailyUsage.energyUsed.toFixed(2);
        document.getElementById('daily-water').textContent = dailyUsage.waterUsed; 


        document.getElementById('weekly-prompts').textContent = weeklyUsage.prompts;
        document.getElementById('weekly-energy').textContent = weeklyUsage.energyUsed.toFixed(2);
        document.getElementById('weekly-water').textContent = weeklyUsage.waterUsed;
    });
});
