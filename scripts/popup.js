document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        // Ensure daily usage is initialized correctly
        const dailyUsage = data.dailyUsage || {
            prompts: 0,
            energyUsed: 0,
            waterUsed: 0,
        };

        // Ensure weekly usage is initialized correctly (array with 7 days of data)
        const weeklyUsage = data.weeklyUsage || Array.from({ length: 7 }, () => ({
            prompts: 0,
            energyUsed: 0,
            waterUsed: 0,
        }));

        // Display daily usage
        document.getElementById('daily-prompts').textContent = dailyUsage.prompts;
        // Ensure toFixed() only runs if energyUsed is a valid number
        document.getElementById('daily-energy').textContent = (dailyUsage.energyUsed || 0).toFixed(2);
        document.getElementById('daily-water').textContent = dailyUsage.waterUsed || 0;

        // Calculate the total weekly usage from the last 7 days
        const totalWeeklyPrompts = weeklyUsage.reduce((sum, day) => sum + (day.prompts || 0), 0);
        const totalWeeklyEnergy = weeklyUsage.reduce((sum, day) => sum + (day.energyUsed || 0), 0);
        const totalWeeklyWater = weeklyUsage.reduce((sum, day) => sum + (day.waterUsed || 0), 0);

        // Display weekly usage (totals for the 7 days)
        document.getElementById('weekly-prompts').textContent = totalWeeklyPrompts;
        document.getElementById('weekly-energy').textContent = (totalWeeklyEnergy || 0).toFixed(2);
        document.getElementById('weekly-water').textContent = totalWeeklyWater || 0;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const Trivia = document.getElementById('trivia');
    Trivia.textContent = "random trivia number: " + Math.floor(Math.random() * 10);
});

