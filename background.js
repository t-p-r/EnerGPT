// Base consumption per prompt (example values)
const energyPerPrompt = {
  "gpt-o1": 2.3,
  "gpt-o1-mini": 2.3,
  "gpt-4": 2.9,
  "gpt-4-mini": 2.9,
};

const waterPerPrompt = {
  "gpt-o1": 8,
  "gpt-o1-mini": 8,
  "gpt-4": 10,
  "gpt-4-mini": 10,
};

// Function to get model from the request body
function extractModelFromRequestBody(requestBody) {
  if (!requestBody || !requestBody.formData) {
    return "gpt-4"; // Fallback
  }

  try {
    const raw = requestBody.raw?.[0]?.bytes;
    if (raw) {
      const decoder = new TextDecoder("utf-8");
      const jsonString = decoder.decode(raw);
      const parsed = JSON.parse(jsonString);
      if (parsed.model) {
        return parsed.model;
      }
    }
  } catch (e) {
    console.warn("Could not parse request body for model:", e);
  }

  return "gpt-4"; // Fallback
}

// Initialize data if not present in storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
    if (!data.dailyUsage) {
      chrome.storage.local.set({
        dailyUsage: { prompts: 0, energyUsed: 0, waterUsed: 0 },
      });
    }
    if (!data.weeklyUsage) {
      // 7 days, with 0 usage each
      const initialWeekly = Array.from({ length: 7 }, () => ({
        prompts: 0,
        energyUsed: 0,
        waterUsed: 0,
      }));
      chrome.storage.local.set({ weeklyUsage: initialWeekly });
    }
  });
});

// Listen for POST requests to the ChatGPT conversation endpoint
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === "POST") {
      chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
        let dailyUsage = data.dailyUsage || {
          prompts: 0,
          energyUsed: 0,
          waterUsed: 0,
        };
        let weeklyUsage =
          data.weeklyUsage ||
          Array.from({ length: 7 }, () => ({
            prompts: 0,
            energyUsed: 0,
            waterUsed: 0,
          }));

        const model = extractModelFromRequestBody(details.requestBody);
        const energyUsage = energyPerPrompt[model] || energyPerPrompt["gpt-4"];
        const waterUsage = waterPerPrompt[model] || waterPerPrompt["gpt-4"];

        // 1) Update daily usage
        dailyUsage.prompts++;
        dailyUsage.energyUsed += energyUsage;
        dailyUsage.waterUsed += waterUsage;

        // 2) Also mirror daily usage into the "current day" slot of weeklyUsage (index 6).
        //    This allows real-time reflection of today's usage in the weekly array.
        const todayIndex = 6;
        weeklyUsage[todayIndex].prompts = dailyUsage.prompts;
        weeklyUsage[todayIndex].energyUsed = dailyUsage.energyUsed;
        weeklyUsage[todayIndex].waterUsed = dailyUsage.waterUsed;

        // Save updated usage
        chrome.storage.local.set({ dailyUsage, weeklyUsage }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving usage:", chrome.runtime.lastError);
          } else {
            console.log("Daily & Weekly usage updated:", {
              dailyUsage,
              weeklyUsage,
            });
          }
        });
      });
    }
  },
  { urls: ["*://chatgpt.com/backend-api/conversation*"] },
  ["requestBody"]
);

// Function to shift weekly usage array daily, then reset daily usage
function resetDailyAndUpdateWeekly() {
  chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
    let dailyUsage = data.dailyUsage || {
      prompts: 0,
      energyUsed: 0,
      waterUsed: 0,
    };
    let weeklyUsage =
      data.weeklyUsage ||
      Array.from({ length: 7 }, () => ({
        prompts: 0,
        energyUsed: 0,
        waterUsed: 0,
      }));

    // The last index (6) in weeklyUsage is "today". We want to shift
    // so that day 0 is the oldest day, day 5 is yesterday, and day 6 is new day.
    // So we remove the first element, shift the array, and push today's usage at the end.
    weeklyUsage.shift(); // remove earliest day
    weeklyUsage.push({ ...dailyUsage }); // push old daily usage to the array as a finished day

    // Reset daily usage to 0 for the new day
    dailyUsage = { prompts: 0, energyUsed: 0, waterUsed: 0 };

    // Also reset the new 'today' in weeklyUsage (index 6) to 0
    weeklyUsage[6] = { prompts: 0, energyUsed: 0, waterUsed: 0 };

    // Save updated data
    chrome.storage.local.set({ dailyUsage, weeklyUsage }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving reset data:", chrome.runtime.lastError);
      } else {
        console.log("New day started. Weekly usage updated:", {
          dailyUsage,
          weeklyUsage,
        });
      }
    });
  });
}

// Reset weekly usage to all zero once a week
function resetWeeklyUsage() {
  const emptyWeeklyUsage = Array.from({ length: 7 }, () => ({
    prompts: 0,
    energyUsed: 0,
    waterUsed: 0,
  }));
  chrome.storage.local.set({ weeklyUsage: emptyWeeklyUsage }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error resetting weekly usage:", chrome.runtime.lastError);
    } else {
      console.log("Weekly usage fully reset:", emptyWeeklyUsage);
    }
  });
}

// Align reset timing with midnight (daily) and start of the week (weekly)
const now = new Date();
const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const millisUntilMidnight = nextMidnight - now;

chrome.alarms.create("resetDailyUsage", {
  when: Date.now() + millisUntilMidnight,
  periodInMinutes: 1440, // once a day
});

const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
const millisUntilNextWeek = nextWeek - now;

chrome.alarms.create("resetWeeklyUsage", {
  when: Date.now() + millisUntilNextWeek,
  periodInMinutes: 1440 * 7, // once a week
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "resetDailyUsage") {
    resetDailyAndUpdateWeekly();
  } else if (alarm.name === "resetWeeklyUsage") {
    resetWeeklyUsage();
  }
});

// Listen for storage changes (optional logging)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.dailyUsage) {
      console.log("Daily usage changed:", changes.dailyUsage.newValue);
    }
    if (changes.weeklyUsage) {
      console.log("Weekly usage changed:", changes.weeklyUsage.newValue);
    }
  }
});
