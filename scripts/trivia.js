document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0 };
        const weeklyUsage = data.weeklyUsage || { prompts: 0, energyUsed: 0 };


        function f0() { return "That is enough to charge " + dailyUsage.prompts / 16 + " phone to 100%"; }
        function f1() { return "That is enough to light a LED bulb for " + dailyUsage.prompts / 10 + " hours"; }

        func_list = [f0, f1]

        const Trivia = document.getElementById('trivia');
        Trivia.textContent = func_list[Math.floor(Math.random() * func_list.length)]();
    });
});