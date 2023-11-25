chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParams = tab.url.split("?"); // Split into an array
        const queryString = queryParams[1]; // Get the part after the "?" (if it exists)

        if (queryString) {
            const urlParams = new URLSearchParams(queryString); // Convert to URLSearchParams
            console.log(urlParams);

            // Passing this data to contentScript.js
            chrome.tabs.sendMessage(tabId, {
                type: "NEW",
                videoId: urlParams.get("v"), // Gets the value of v, i.e., the video ID
            });
        }
    }
});
