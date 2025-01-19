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
      chrome.storage.local.set({ dailyUsage: { prompts: 0, energyUsed: 0, waterUsed: 0 } });
    }
    if (!data.weeklyUsage) {
      chrome.storage.local.set({
        weeklyUsage: Array.from({ length: 7 }, () => ({
          prompts: 0,
          energyUsed: 0,
          waterUsed: 0,
        })),
      });
    }
  });
});

// Listen for POST requests to the ChatGPT conversation endpoint
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === "POST") {
      chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
        let dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };
        let weeklyUsage = data.weeklyUsage || Array.from({ length: 7 }, () => ({
          prompts: 0,
          energyUsed: 0,
          waterUsed: 0,
        }));

        const model = extractModelFromRequestBody(details.requestBody);
        const energyUsage = energyPerPrompt[model] ?? energyPerPrompt["gpt-4"];
        const waterUsage = waterPerPrompt[model] ?? waterPerPrompt["gpt-4"];

        // Update daily usage
        dailyUsage.prompts++;
        dailyUsage.energyUsed += energyUsage;
        dailyUsage.waterUsed += waterUsage;

        // Save updated usage
        chrome.storage.local.set({ dailyUsage }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving daily usage:", chrome.runtime.lastError);
          } else {
            console.log("Daily usage updated:", dailyUsage);
          }
        });
      });
    }
  },
  { urls: ["*://chatgpt.com/backend-api/conversation*"] },
  ["requestBody"]
);

// Function to reset daily usage and update weekly usage
function resetDailyAndUpdateWeekly() {
  chrome.storage.local.get(["dailyUsage", "weeklyUsage"], (data) => {
    let dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };
    let weeklyUsage = data.weeklyUsage || Array.from({ length: 7 }, () => ({
      prompts: 0,
      energyUsed: 0,
      waterUsed: 0,
    }));

    // Push the current daily usage into weekly usage
    weeklyUsage.shift();
    weeklyUsage.push(dailyUsage);

    // Reset daily usage
    dailyUsage = { prompts: 0, energyUsed: 0, waterUsed: 0 };

    // Save updated data
    chrome.storage.local.set({ dailyUsage, weeklyUsage }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving reset data:", chrome.runtime.lastError);
      } else {
        console.log("Daily usage reset and weekly usage updated:", { dailyUsage, weeklyUsage });
      }
    });
  });
}

// Reset weekly usage every 7 days
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
      console.log("Weekly usage reset:", emptyWeeklyUsage);
    }
  });
}

// Align reset timing with midnight and start of the week
const now = new Date();
const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const millisUntilMidnight = nextMidnight - now;

chrome.alarms.create("resetDailyUsage", {
  when: Date.now() + millisUntilMidnight,
  periodInMinutes: 1440,
});

const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
const millisUntilNextWeek = nextWeek - now;

chrome.alarms.create("resetWeeklyUsage", {
  when: Date.now() + millisUntilNextWeek,
  periodInMinutes: 1440 * 7,
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
