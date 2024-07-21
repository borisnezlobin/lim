browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
    console.log("onInstalled", reason, temporary);
    // if (temporary) return;
    switch (reason) {
      case "update":
        {
          const url = browser.runtime.getURL("blocked_page.html");
          await browser.tabs.create({ url });
        }
        break;
    }
  });