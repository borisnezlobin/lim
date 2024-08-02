/* eslint-disable no-undef */

let log = (s) => { console.log("content.js:", s); };

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
    console.log("checking if", url, "matches", limit.urlRegex);
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
    log("starting content script on", window.location.href);
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

    const currentTab = new URL(window.location.href).origin;
    // const timeSpent = await getTimeSpentOnCurrentTab();

    for (const limit of cachedLimits) {
        // unfortunately, we can't store the limits that match the current tab in a global var,
        // because the content script's globals are shared by all content scripts (which is running in every tab)
        if (limitMatches(currentTab, limit)) {
            log(currentTab, "matches", limit, "and has spent", limit.usedToday, "ms today");
            if (limit.usedToday > limit.perDay * 60 * 1000) {
                blockTab(limit.name);
                log("Blocked", currentTab, "because of limit", limit);
                break; // no need to check the other limits, duh
            }
        }
    }
}

browser.runtime.onMessage.addListener((message) => {
    log("received message", message);
    if (message.type === "time-update") {
        if (message.url == getURL(window.location.href)) {
            blockTabIfOvertime();
        }
    }
});

log("content script loaded");
startup();





























/* just don't worry

let log = (s) => { console.log("content.js:", s); };

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
    console.log("checking if", url, "matches", limit.urlRegex);
    return !!url.match(limit.urlRegex);
};

const getBlockedPageHTML = (limitName) => {
    const urlObj = new URL(window.location.href);
    // const url = urlObj.host ? urlObj.host : urlObj.href.split("#")[0];
    return `
        <!DOCTYPE html>
        <html>

        <head>
            <title>Blocked</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');
                
                *:not(script):not(style):not(meta):not(title):not(link):not(svg) {
                    all: unset !important; 
                    font-family: "Rethink Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif !important;
                    line-height: 1.5 !important;
                    font-weight: 400 !important;
                    color: rgba(255, 255, 255, 0.87) !important;
                    background-color: #2a2a2a !important;

                body {
                    font-family: "Rethink Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                    line-height: 1.5 !important;
                    font-weight: 400 !important;

                    color-scheme: light dark !important;
                    color: rgba(255, 255, 255, 0.87) !important;

                    font-synthesis: none !important;
                    text-rendering: optimizeLegibility !important;
                    -webkit-font-smoothing: antialiased !important;
                    -moz-osx-font-smoothing: grayscale !important;
                    background-color: #2a2a2a !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    overflow: hidden !important;
                    justify-content: center !important;
                    align-items: center !important;
                    display: flex !important;
                    flex-direction: column !important;
                    margin: 0 !important;
                }

                a {
                    font-weight: 500;
                    color: #646cff;
                    text-decoration: inherit;
                }

                a:hover {
                    color: #535bf2;
                }

                h1 {
                    font-size: 3.2em;
                    line-height: 1.1;
                }

                button {
                    border-radius: 8px;
                    border: 1px solid transparent;
                    padding: 0.6em 1.2em;
                    font-size: 1em;
                    font-weight: 500;
                    font-family: inherit;
                    background-color: #1a1a1a;
                    cursor: pointer;
                    transition: border-color 0.25s;
                    margin: 1rem 0rem;
                }

                button.icon {
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    margin-right: 0.5em;
                    border-radius: 50%;
                    padding: 0.5em;
                }

                button:hover {
                    border-color: #646cff;
                }

                button:focus,
                button:focus-visible {
                    outline: 4px auto -webkit-focus-ring-color;
                }

                @media (prefers-color-scheme: light) {
                    body {
                        color: #213547;
                        background-color: #ffffff;
                    }

                    a:hover {
                        color: #747bff;
                    }

                    button {
                        background-color: #f9f9f9;
                    }
                }
}
            </style>
        </head>
        <body>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ddd" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-104a40,40,0,1,0-65.94,30.44L88.68,172.77A8,8,0,0,0,96,184h64a8,8,0,0,0,7.32-11.23l-13.38-30.33A40.14,40.14,0,0,0,168,112ZM136.68,143l11,25.05H108.27l11-25.05A8,8,0,0,0,116,132.79a24,24,0,1,1,24,0A8,8,0,0,0,136.68,143Z"></path></svg>
            <div style="position: absolute; bottom: 0; width: 100vw; display: flex; flex-wrap: wrap; flex-direction: row; align-items: center; justify-content: space-between; padding: 1rem; padding-right: 2rem; font-size: 1rem;">
                <p>Not meant to be blocked? Try reloading.</p>
                <p>Blocked by ${limitName ? "your " + limitName + " limit" : "one of your limits"}.</p>
            </div>
            <script type="text/javascript">
                const svg = document.querySelector("svg");
                document.addEventListener("mousemove", (e) => {
                    const rect = svg.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2);
                    svg.style.transform = "rotate(" + angle + "rad)";
                });
            </script>
        </body>
    </html>`
}

// when this content script is loaded, we need to get all limits from storage and see which ones match this tab
// then, we need to check if the time spent on this tab is greater than the limit (or any of the limits)
// if it is, we need to block the tab and show the html
// otherwise, whenever we receive a message from the background script, we need to update the time spent on this tab
// and check if it's greater than the limit (or any of the limits)
// be careful, because some APIs are disabled in content scripts (see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#webextension_apis)
const startup = () => {
    log("starting content script on", window.location.href);
    blockTabIfOvertime();
}

const getTimeSpentOnCurrentTab = async () => {
    const usage = await browser.storage.local.get("usage");
    const url = getURL(window.location.href);
    return (usage && usage.usage && usage.usage[url]) ? usage.usage[url].time : 0;
}

const blockTab = (limitName) => {
    document.documentElement.innerHTML = getBlockedPageHTML(limitName ? limitName : "one of your limits");
}

const blockTabIfOvertime = async () => {
    browser.storage.local.get("limits").then((limits) => {
        if (limits && limits.limits) {
            cachedLimits = limits.limits;
        }
    });

    const currentTab = new URL(window.location.href).origin;
    // const timeSpent = await getTimeSpentOnCurrentTab();

    for(const limit of cachedLimits) {
        // unfortunately, we can't store the limits that match the current tab in a global var,
        // because the content script's globals are shared by all content scripts (which is running in every tab)
        if(limitMatches(currentTab, limit)) {
            log(currentTab, "matches", limit, "and has spent", limit.usedToday, "ms today");
            if(limit.usedToday > limit.perDay * 60 * 1000) {
                blockTab(limit.name);
                log("Blocked", currentTab, "because of limit", limit);
                break; // no need to check the other limits, duh
            }
        }
    }
}

browser.runtime.onMessage.addListener((message) => {
    log("received message", message);
    if(message.type === "time-update") {
        if(message.url == getURL(window.location.href)) {
            blockTabIfOvertime();
        }
    }
});

log("content script loaded");
startup();

*/