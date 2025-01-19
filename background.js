// background.js

// Keep track of daily usage
  
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
  
  // Function to get model from the request body (if needed)
  function extractModelFromRequestBody(requestBody) {
    // requestBody can be in different formats depending on how ChatGPT is sending data.
    // For demonstration, we assume JSON with a 'model' field:
    // e.g. { model: "gpt-4" }
    if (!requestBody || !requestBody.formData) {
      // Could also be requestBody.raw if the request is raw JSON
      return "gpt-4"; // fallback
    }
  
    // If it's formData, you'd parse accordingly:
    // If the server expects JSON, check requestBody.raw.
    // If the server expects multipart/form-data, check requestBody.formData.
    try {
      // Example: raw JSON in requestBody.raw
      // Convert array of ArrayBuffer to string, then parse JSON:
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
  
    return "gpt-4"; // fallback
  }
  
  // Listen for POST requests to the ChatGPT conversation endpoint
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      if (details.method === "POST") {
        // Retrieve current usage data from chrome.storage.local
        chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
          let dailyUsage = data.dailyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };
          let weeklyUsage = data.weeklyUsage || { prompts: 0, energyUsed: 0, waterUsed: 0 };
  
          // Increment daily usage
          const model = extractModelFromRequestBody(details.requestBody);
          dailyUsage.prompts++;
          dailyUsage.energyUsed += energyPerPrompt[model] || energyPerPrompt["gpt-4"];
          dailyUsage.waterUsed += waterPerPrompt[model] || waterPerPrompt["gpt-4"];
  
          // Increment weekly usage
          weeklyUsage.prompts++;
          weeklyUsage.energyUsed += energyPerPrompt[model] || energyPerPrompt["gpt-4"];
          weeklyUsage.waterUsed += waterPerPrompt[model] || waterPerPrompt["gpt-4"];
  
          // Save updated usage back to chrome.storage.local
          chrome.storage.local.set({ dailyUsage, weeklyUsage }, () => {
            console.log("Usage saved to Chrome storage:", dailyUsage, weeklyUsage);
          });
        });
      }
    },
    {
      urls: ["*://chatgpt.com/backend-api/conversation*"], // Filter: only watch requests to ChatGPT’s conversation endpoint
    },
    ["requestBody"]
  );
  
  // Ensure data is initialized when the background script starts
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['dailyUsage', 'weeklyUsage'], (data) => {
        if (!data.dailyUsage) {
            // Initialize daily usage if it doesn't exist
            chrome.storage.local.set({ dailyUsage: { prompts: 0, energyUsed: 0, waterUsed: 0 } });
        }
        if (!data.weeklyUsage) {
            // Initialize weekly usage if it doesn't exist
            chrome.storage.local.set({ weeklyUsage: { prompts: 0, energyUsed: 0, waterUsed: 0 } });
        }
    });
  });

  
  // Example storage change listener to track usage over time in 'weeklyUsage', etc.
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.dailyUsage) {
      console.log("dailyUsage changed:", changes.dailyUsage.newValue);
      // Could update weekly usage here...
    }
  });
  