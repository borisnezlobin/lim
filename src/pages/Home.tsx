import { Link, useNavigate } from "react-router-dom";
import { Limit } from "../lib/LimitController";
import { LimitListItem } from "../components/LimitListItem";
import { useEffect, useState } from "react";

const limits: Limit[] = [
    {
        id: 1,
        perDay: 60,
        urlRegex: "instagram.com",
        usedToday: 0,
        allowOneMoreMinute: true
    },
    {
        id: 2,
        perDay: 30,
        urlRegex: "facebook.com",
        usedToday: 0,
        allowOneMoreMinute: false
    }
]

/** 
 * Lists all of the current limits
 */
function HomePage() {
    const nav = useNavigate();
    const [val, setVal] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const abc = async () => {
            // @ts-ignore
            setVal(await browser.storage.local.get("test") || "");
        }

        // @ts-ignore
        const listener = browser.runtime.onMessage.addListener((message) => {
            console.log("got message", message);
            if(message.type == "tab-change"){
                setCurrentTab(message.tabId);
            }
        });

        if(val == null) abc();

        return listener;
    }, [val]);

    return (
        <div>
            <h1 style={{ marginBottom: 0 }}>Your Limits</h1>
            <p>{JSON.stringify(val)}</p>
            <p>Current tab: {currentTab}</p>
            <button onClick={() => nav("/create")}>Create Limit</button>
            <Link to="/usage">Go to Usage</Link>
            <button onClick={() => {
                // @ts-ignore
                browser.tabs.executeScript({
                    file: "scripts/content.js"
                });
                setVal(null);
            }}>Get/set "test"</button>
            {limits.map((limit) => <LimitListItem limit={limit} key={limit.id} />)}
        </div>
    )
}

export { HomePage };
