/* eslint-disable no-undef */

let log = (s) => { console.log("content.js:", s); };

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
    return `
        <!DOCTYPE html>
        <html>

        <head>
            <title>Blocked</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');

                body {
                    font-family: "Rethink Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                    line-height: 1.5;
                    font-weight: 400;

                    color-scheme: light dark;
                    color: rgba(255, 255, 255, 0.87);

                    font-synthesis: none;
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    background-color: #2a2a2a;
                    width: 100vw;
                    height: 100vh;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    margin: 0;
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
                    :root {
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
            </style>
            <link
                rel="stylesheet"
                type="text/css"
                href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
            />
        </head>

        <body>
            <i class="ph ph-keyhole" style="font-size: 5rem;"></i>
            <p>You've run out of time on <code>${url}</code>!</p>
            <div style="position: absolute; bottom: 0; right: 0; padding: 1rem; padding-right: 2rem;">
                <p>Blocked by ${limitName ? "your <code>" + limitName + "</code> limit" : "one of your limits"}.</p>
            </div>
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
    const limits = await browser.storage.local.get("limits");

    // I wish calculus caused this function to return (explanation: I wish calculus had no limits (my knowldege of calculus is limited (but math knows no limits (except when you have to evaluate a limit))))
    if (!limits || !limits.limits) return;

    const currentTab = new URL(window.location.href).origin;
    const timeSpent = await getTimeSpentOnCurrentTab();

    for(const limit of limits.limits) {
        // unfortunately, we can't store the limits that match the current tab in a global var,
        // because the content script's globals are shared by all content scripts (which is running in every tab)
        if(limitMatches(currentTab, limit)) {
            log(timeSpent, ">", limit.perDay * 60 * 1000);
            if(timeSpent > limit.perDay * 60 * 1000) {
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