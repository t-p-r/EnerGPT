document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        const dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };

        function f0() {
            return "That's enough energy to completely charge " + Math.round(dailyUsage.energyUsed * 6.25) / 100 + " phones!";
        }
        function f1() {
            return "That's enough energy to power an LED bulb for " + Math.round(dailyUsage.energyUsed * 10) / 100 + " hours!";
        }
        function f2() {
            return "A hamster running on a wheel would take " + Math.round(dailyUsage.energyUsed * 800) / 100 + " days to produce that energy!";
        }
        function f3() {
            return "That's equivalent to " + Math.round(dailyUsage.energyUsed * 40) / 100 + " people's daily energy consumption!";
        }
        function f4() {
            return "That energy is equivalent to a dog chasing its tail for " + Math.round(dailyUsage.energyUsed * 120) / 100 + " minutes!";
        }
        function f5() {
            return "That's enough energy to brew " + Math.round(dailyUsage.energyUsed / 60 * 100) / 100 + " cups of coffee.";
        }
        function f6() {
            return "That's enough energy to send " + Math.round(dailyUsage.energyUsed * 100) + " emails!";
        }
        function f7() {
            return "That's enough water for you to brush your teeth " + Math.round(dailyUsage.waterUsed * 2) / 100 + " times!";
        }
        function f8() {
            return "That's enough water to make " + Math.round(dailyUsage.waterUsed * 5) / 100 + " ice cubes!";
        }
        function f9() {
            return "You can grow " + Math.round(dailyUsage.waterUsed / 12 * 100) / 100 + " blueberries with that amount of water!";
        }
        function f10() {
            return "That's enough water to rinse " + Math.round(dailyUsage.waterUsed * 10) / 100 + " spoons!";
        }
        function f11() {
            return "This energy can power UBC's Okanagan campus for " + Math.round(dailyUsage.energyUsed / 1.375 * 100) / 100 + " miliseconds!";
        }
        function f12() {
            return "";
        }

        trivia_list = [f2, f3, f4, f5, f6, f7, f8, f9, f10, f11];

        const Trivia = document.getElementById('trivia');
        Trivia.textContent = trivia_list[Math.floor(Math.random() * trivia_list.length)]();
    });
});