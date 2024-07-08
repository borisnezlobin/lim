let currentTab = "ur mom"
let startTime = Date.now();

// todo: every 30 seconds, update the time in the current tab

const handleNewUrl = (url, favicon) => {
    console.log('new url:', url);
    let urlObj = new URL(url);
    const key = urlObj.hostname;
    if(!key) return;

    // write this time spent to storage under url's sitename
    let timeSpent = Date.now() - startTime;
    console.log('time spent:', timeSpent);

    browser.storage.local.get("usage").then((result) => {
        console.log('result:', result);
        if (!result.usage[key]) {
            browser.storage.local.set({
                usage: {
                    ...result.usage, [key]: {
                        time: timeSpent,
                        icon: favicon,
                        url: key
                    }
                }
            });
        } else {
            browser.storage.local.set({
                usage: {
                    ...result.usage, [key]: {
                        time: result.usage[key].time + timeSpent,
                        icon: favicon,
                        url: key
                    }
                }
            });
        }
    });

    // reset start time
    startTime = Date.now();
    currentTab = url;

    browser.runtime.sendMessage({ newUrl: url, type: "location-change" });
}

browser.tabs.onActivated.addListener(async function (activeInfo) {
    console.log("tab activated:", activeInfo);
    let tab = await browser.tabs.get(activeInfo.tabId);
    handleNewUrl(tab.url, tab.favIconUrl);
});

browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        console.log("tab updated:", tabInfo.url);
        handleNewUrl(tabInfo.url, tabInfo.favIconUrl);
    }
});