browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
    console.log("onInstalled", reason, temporary);
    // if (temporary) return;
    switch (reason) {
      case "install":
        {
          const url = browser.runtime.getURL("scripts/install.html");
          await browser.tabs.create({ url });
        }
        break;
    }
});