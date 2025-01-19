var i = 0;
async function determineGpt() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const current_url = tab.url;
    const gptMatches = current_url.match(/https:\/\/chatgpt.com/gi);
    const windowIsGpt = gptMatches != null && gptMatches.length > 0;
    //document.getElementById('is_gpt').innerText = "Is this gpt? " +  (windowIsGpt ? "Yes." : "No.");
}
determineGpt();