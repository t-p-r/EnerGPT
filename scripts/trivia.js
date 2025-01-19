document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0 };
        const weeklyUsage = data.weeklyUsage || { prompts: 0, energyUsed: 0 };

        function f0() { return "That is enough to charge " + dailyUsage.energyUsed / 16 + " phone to 100%"; }
        function f1() { return "That is enough to light a LED bulb for " + dailyUsage.energyUsed / 10 + " hours"; }
        function f2() { return "That is the equivalent of a hamster running on a wheel for " + dailyUsage.energyUsed * 8 + " days!"; }
        function f3() {
            return "That is the daily energy intake of " + dailyUsage.energyUsed / 2.5 + " people!";
        }

        func_list = [f0, f1, f2, f3];

        const Trivia = document.getElementById('trivia');
        Trivia.textContent = func_list[Math.floor(Math.random() * func_list.length)]();
    });
});