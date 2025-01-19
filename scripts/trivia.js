document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };

        function f0() { return "The energy is enough to charge " + Math.round(dailyUsage.energyUsed * 6.25) / 100 + " phones to 100%."; }
        function f1() { return "The energy is enough to light a LED bulb for " + Math.round(dailyUsage.energyUsed * 10) / 100 + " hours."; }
        function f2() {
            return "The energy is equivalent to a hamster running on a wheel for " + Math.round(dailyUsage.energyUsed * 800) / 100 + " days!";
        }
        function f3() {
            return "The energy is the daily energy intake of " + Math.round(dailyUsage.energyUsed * 40) / 100 + " people!";
        }
        function f4() {
            return "The energy is like a dog chasing its tail for " + Math.round(dailyUsage.energyUsed * 120) / 100 + "minutes!";
        }
        function f5() {
            return "The energy is enough to brew " + Math.round(dailyUsage.energyUsed / 60 * 100) / 100 + " cups of coffee!";
        }
        function f6() {
            return "The energy is enough for Google to send " + Math.round(dailyUsage.energyUsed * 100) + " emails!";
        }
        function f7() {
            return "The water is enough for you to brush your teeth" + Math.round(dailyUsage.waterUsed * 2) / 100 + " emails!";
        }

        func_list = [f0, f1, f2, f3, f4, f5, f6];

        const Trivia = document.getElementById('trivia');
        Trivia.textContent = func_list[Math.floor(Math.random() * func_list.length)]();
    });
});