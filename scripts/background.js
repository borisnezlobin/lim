let currentTab = "";
let currentFavicon = "";
let startTime = Date.now();
let lastWindowId = browser.windows.WINDOW_ID_NONE;

browser.windows.onFocusChanged.addListener((abc) => {
    console.log("window focus changed", abc);
})

// todo: every 30 seconds, update the time in the current tab
setInterval(async () => {
    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    console.log(tab[0]);
    handleNewUrl(getURL(tab[0].url), tab[0].favIconUrl);
}, 1000);

const handleNewUrl = (url, favicon) => {
    // write this time spent to storage under url's sitename
    let timeSpent = Date.now() - startTime;

    browser.storage.local.get("usage").then((result) => {
        if (!result || !result.usage || !result.usage[currentTab]) {
            browser.storage.local.set({
                usage: {
                    ...result.usage, [currentTab]: {
                        time: timeSpent,
                        icon: favicon,
                        url: currentTab
                    }
                }
            });
        } else {
            browser.storage.local.set({
                usage: {
                    ...result.usage, [currentTab]: {
                        time: result.usage[currentTab].time + timeSpent,
                        icon: favicon,
                        url: currentTab
                    }
                }
            });
        }
    });

    // reset start time
    startTime = Date.now();
    currentTab = url;

    // try {
    //     browser.runtime.sendMessage({ newUrl: url, type: "location-change" });
    // } catch (e) {}
}

browser.tabs.onActivated.addListener(async function (activeInfo) {
    console.log("tab activated:", activeInfo);
    let tab = await browser.tabs.get(activeInfo.tabId);
    handleNewUrl(getURL(tab.url), tab.favIconUrl);
});

browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        console.log("tab updated:", tabInfo.url);
        handleNewUrl(getURL(tabInfo.url), tabInfo.favIconUrl);
    }
});

const getURL = (str) => {
    try {
        const url = (new URL(str)).hostname;
        return url ? url : str.split("#")[0];
    } catch (e) {
        return str.split("#")[0];
    }
}