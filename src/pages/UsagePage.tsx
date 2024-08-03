import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { formatMS } from "../lib/formatMS";
import { UsageContext } from "../lib/UsageContext";


/** 
 * Lists all of the websites used today, in order of most used to least used
 */
function UsagePage() {
    const nav = useNavigate();
    const { usageArr } = useContext(UsageContext);
    // @ts-expect-error should work
    const limURL = browser.runtime.getURL("html/regexlimits.html").replaceAll("html/regexlimits.html", "").match(/[a-z0-9]{6,9}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)[0];

    return (
        <div style={{ width: "100%" }}>
            <h1 style={{ marginBottom: 0 }}>Usage Today</h1>
            <button onClick={() => nav("/")} style={{ marginBottom: "1rem" }}>
                Back
            </button>
            {usageArr ? usageArr.map((m) => {
                if (m.time < 60 * 1000 && usageArr.length > 20) return null;
                if (m.url.includes(limURL)) return null;
                const e = m;
                const name = e.url.length > 40 ? e.url.slice(0, 40) + "..." : e.url;
                return (
                    <div key={e.url} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {e.icon ?
                                <img src={e.icon} style={{ width: 16, height: 16, backgroundColor: "white", borderRadius: 1024, padding: 4 }} />
                            :
                                <div style={{ width: 16, height: 16 }}></div>
                            }
                            <div>
                                <p>
                                    {name}
                                </p>
                                <p style={{ color: "gray", fontSize: "0.9rem" }}>
                                    {e.pickups} pickup{e.pickups === 1 ? "" : "s"}
                                </p>
                            </div>
                        </div>
                        <code style={{ margin: 0, padding: ".5em .5em" }}>
                            {formatMS(e.time)}
                        </code>
                    </div>
                )
            }) : <p>Loading...</p>}
        </div>
    )
}

export { UsagePage };
