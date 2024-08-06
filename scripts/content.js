/* eslint-disable no-undef */

var cachedLimits = []; // this allows us to cache the limits (they don't change often), so we avoid a "flash" when we load websites

// I wish imports were allowed in content scripts (but I can't figure out how to make them work)
const getURL = (str) => {
    try {
        const url = new URL(str).hostname;
        return url ? url : str.split("#")[0];
    } catch (e) {
        return str.split("#")[0];
    }
};

const limitMatches = (url, limit) => {
    return !!url.match(limit.urlRegex);
};

const getBlockedPageHTML = (limitName) => {
    const urlObj = new URL(window.location.href);
    const url = urlObj.host ? urlObj.host : urlObj.href.split("#")[0];
    return ``
}

// when this content script is loaded, we need to get all limits from storage and see which ones match this tab
// then, we need to check if the time spent on this tab is greater than the limit (or any of the limits)
// if it is, we need to block the tab and show the html
// otherwise, whenever we receive a message from the background script, we need to update the time spent on this tab
// and check if it's greater than the limit (or any of the limits)
// be careful, because some APIs are disabled in content scripts (see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#webextension_apis)
const startup = () => {
    blockTabIfOvertime();
}

const getTimeSpentOnCurrentTab = async () => {
    const usage = await browser.storage.local.get("usage");
    const url = getURL(window.location.href);
    return (usage && usage.usage && usage.usage[url]) ? usage.usage[url].time : 0;
}

const blockTab = async (limitName) => {
    // send message to background script to close the tab
    browser.runtime.sendMessage({ type: "close-tab", name: limitName });
}

const blockTabIfOvertime = async () => {
    browser.storage.local.get("limits").then((limits) => {
        if (limits && limits.limits) {
            cachedLimits = limits.limits;
        }
    });

    const currentTab = window.location.href;
    // const timeSpent = await getTimeSpentOnCurrentTab();

    for (const limit of cachedLimits) {
        // unfortunately, we can't store the limits that match the current tab in a global var,
        // because the content script's globals are shared by all content scripts (which is running in every tab)
        if (limitMatches(currentTab, limit)) {
            if (limit.usedToday >= limit.perDay * 60 * 1000) {
                blockTab(limit.name);
                log("Blocked", currentTab, "because of limit", limit);
                break;
            }
        }
    }
}

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "time-update") {
        if (message.url == window.location.href) {
            blockTabIfOvertime();
        }
    }
});

startup();