document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0 };
        const weeklyUsage = data.weeklyUsage || { prompts: 0, energyUsed: 0 };

        document.getElementById('daily-prompts').textContent = dailyUsage.prompts;
        document.getElementById('daily-energy').textContent = dailyUsage.energyUsed.toFixed(2);
        document.getElementById('weekly-prompts').textContent = weeklyUsage.prompts;
        document.getElementById('weekly-energy').textContent = weeklyUsage.energyUsed.toFixed(2);
    });
});
