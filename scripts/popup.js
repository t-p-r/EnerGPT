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

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve data from storage
    chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
      const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };
      const weeklyUsage = data.weeklyUsage || Array.from({ length: 7 }, () => ({
        prompts: 0,
        energyUsed: 0,
        waterUsed: 0,
      }));
  
      // Display daily usage
      document.getElementById("daily-prompts").textContent = dailyUsage.prompts;
      document.getElementById("daily-energy").textContent = dailyUsage.energyUsed.toFixed(2);
      document.getElementById("daily-water").textContent = dailyUsage.waterUsed.toFixed(2);
  
      // Display weekly usage (aggregate data)
      const totalWeeklyPrompts = weeklyUsage.reduce((sum, day) => sum + (day.prompts || 0), 0);
      const totalWeeklyEnergy = weeklyUsage.reduce((sum, day) => sum + (day.energyUsed || 0), 0);
      const totalWeeklyWater = weeklyUsage.reduce((sum, day) => sum + (day.waterUsed || 0), 0);
  
      document.getElementById("weekly-prompts").textContent = totalWeeklyPrompts;
      document.getElementById("weekly-energy").textContent = totalWeeklyEnergy.toFixed(2);
      document.getElementById("weekly-water").textContent = totalWeeklyWater.toFixed(2);
  
      console.log("Weekly Usage Breakdown:", weeklyUsage);
    });
  });
  
  
