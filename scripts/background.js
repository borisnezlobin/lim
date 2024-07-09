let currentTab = "";
let currentFavicon = "";
let startTime = Date.now();
let currentWindowID = browser.windows.WINDOW_ID_NONE;
let browserAwake = true;
let lastIntervalTime = Date.now();

browser.windows.onFocusChanged.addListener((abc) => {
    console.log("window focus changed", abc);
    // iffy — browser window could be mildly sus because it could be a sidebar or something. might as well count that as "active", though
    currentWindowID = abc;
})

// run this interval every 2 minutes, then if the difference is significantly greater than 2 minutes, don't count the time spent
const time = 2 *  1000;
setInterval(() => {
    if(Date.now() - lastIntervalTime > time + 1 * 60 * 1000){
        // the computer went to sleep, don't count the last one
        browserAwake = false; // todo: mvoe this from handleNewUrl to here, maybe?
        console.log("browser was asleep since", new Date(lastIntervalTime));
    } else {
        browserAwake = true;
    }
    lastIntervalTime = Date.now();
}, time);

setInterval(async () => {
    // don't update current tab if the browser window is not focused
    // todo: verify this works
    if(!browserAwake || currentWindowID == browser.windows.WINDOW_ID_NONE){
        console.log("not updating tiem because browserawake is", browserAwake, ", currentwindowid is", currentWindowID);
        currentTab = "";
        currentFavicon = "";
        startTime = Date.now(); // or something
        return;
    }

    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    console.log(tab[0]);
    handleNewUrl(getURL(tab[0].url), tab[0].favIconUrl);
}, 1000);

const handleNewUrl = (url, favicon) => {
    // write this time spent to storage under url's sitename
    if(!url) return;
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