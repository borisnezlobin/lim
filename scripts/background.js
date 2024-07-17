/**
 * This script runs in the background and listens for tab changes, browser focus changes,
 * OS sleep events, etc. It then records the time spent on each tab and stores it in
 * the extension's local storage. Resets every day. Due to Manifest V3 changes,
 * this background script is NOT persistent and will be unloaded after a few seconds...
 * which is why we have some funnies.
 */

let currentTab = "";
let startTime = Date.now();
let currentWindowID = browser.windows.WINDOW_ID_NONE;
let hasBrowserBeenAwake = true;
let lastIntervalTime = Date.now();
let currentFavicon = "";

// basically if we run a quick little interval (under 15s), we can keep the background script running
// this is a hacky way to keep the background script running
// https://stackoverflow.com/questions/37017209/persistent-background-page-on-demand-or-an-event-page-that-doesnt-unload
setInterval(() => {
    console.log("background script is running");
}, 10000);


browser.windows.onFocusChanged.addListener((abc) => {
    console.log("window focus changed", abc);
    // if we switch windows from the browser, we need to add the time spent on the previous tab
    if(abc == browser.windows.WINDOW_ID_NONE) handleNewUrl(currentTab, currentFavicon);
    // iffy — browser window could be a sidebar or something. might as well count that as "active", though
    currentWindowID = abc;
});

// run this interval every 2 minutes, then if the difference is significantly greater than 2 minutes, don't count the time spent
const time = 2 * 60 * 1000;
setInterval(() => {
    if (Date.now() - lastIntervalTime > time + 1 * 60 * 1000) {
        // the computer went to sleep, don't count the last amount of time that has been spent
        currentTab = "";
        currentFavicon = "";
        startTime = Date.now();
        hasBrowserBeenAwake = false;
        console.log("browser was asleep since", new Date(lastIntervalTime));
    } else {
        hasBrowserBeenAwake = true;
    }
    lastIntervalTime = Date.now();
}, time);

setInterval(async () => {
    // don't update current tab if the browser window is not focused
    if (
        !hasBrowserBeenAwake ||
        currentWindowID == browser.windows.WINDOW_ID_NONE
    ) {
        console.log(
            "not updating time because browserawake is",
            hasBrowserBeenAwake,
            ", currentwindowid is",
            currentWindowID
        );
        currentTab = "";
        currentFavicon = "";
        startTime = Date.now();
        return;
    }

    // todo: tbh, could make this a one-time thing instead of an interval (pov: friendzoned)
    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    console.log(tab[0]);
    handleNewUrl(getURL(tab[0].url), tab[0].favIconUrl);
}, time);

const handleNewUrl = async (url, favicon) => {
    // write this time spent to storage under url's sitename
    if (!currentTab){
        startTime = Date.now();
        currentTab = url;
        currentFavicon = favicon;
        return;
    }

    let timeSpent = Date.now() - startTime;
    console.log("time spent on", currentTab, ":", timeSpent);

    const lastDateUpdatedStorage = await browser.storage.local.get("lastDateUpdated");
    const lastDateUpdated = new Date(lastDateUpdatedStorage.lastDateUpdated).getDate();

    const result = await browser.storage.local.get("usage");

    // if the date has changed, reset the time spent on all tabs
    // awaits are necessary here, I think
    if (result && new Date().getDate() != lastDateUpdated) {
        // clear usage from storage
        await browser.storage.local.set({
            usage: {
                [currentTab]: {
                    time: timeSpent,
                    icon: currentFavicon,
                    url: currentTab,
                },
            },
            lastDateUpdated: Date.now(),
        });
    } else if (!result || !result.usage || !result.usage[currentTab]) {
        await browser.storage.local.set({
            usage: {
                ...result.usage,
                [currentTab]: {
                    time: timeSpent,
                    icon: currentFavicon,
                    url: currentTab,
                },
            },
            lastDateUpdated: Date.now(),
        });
    } else {
        await browser.storage.local.set({
            usage: {
                ...result.usage,
                [currentTab]: {
                    time: result.usage[currentTab].time + timeSpent,
                    icon: currentFavicon,
                    url: currentTab,
                },
            },
            lastDateUpdated: Date.now(),
        });
    }

    // reset start time
    startTime = Date.now();
    currentTab = url;
    currentFavicon = favicon;

    // try {
    //     browser.runtime.sendMessage({ newUrl: url, type: "location-change" });
    // } catch (e) {}
};

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
        const url = new URL(str).hostname;
        return url ? url : str.split("#")[0];
    } catch (e) {
        return str.split("#")[0];
    }
};
