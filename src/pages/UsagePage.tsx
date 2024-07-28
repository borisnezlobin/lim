import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatMS } from "../lib/formatMS";

type UsageType = {
    time: number,
    icon: string;
    url: string;
};


/** 
 * Lists all of the websites used today, in order of most used to least used
 */
function UsagePage() {
    const nav = useNavigate();
    const [usage, setUsage] = useState<[string, UsageType][] | null>(null);

    useEffect(() => {
        const abc = async () => {
            // @ts-expect-error browser is "not defined", but it is in our case
            const arr: [string, UsageType][] = Object.entries((await browser.storage.local.get("usage")).usage || {});

            arr.sort((a, b) => b[1].time - a[1].time);

            setUsage(arr);
        }

        if (usage == null) abc();
    }, [usage]);

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            <h1 style={{ marginBottom: 0 }}>Usage Today</h1>
            <button onClick={() => nav("/")}>Back</button>
            {usage ? usage.map((m) => {
                if(m[1].time < 60 * 1000) return null;
                const e = m[1];
                const name = e.url.length > 40 ? e.url.slice(0, 40) + "..." : e.url;
                return (
                    <div key={e.url} style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {e.icon ? <img src={e.icon} style={{ width: 16, height: 16 }} /> : <div style={{ width: 16, height: 16 }}></div>}
                            <p>{name}</p>
                        </div>
                        <p>{formatMS(e.time)}</p>
                    </div>
                )
            }) : <p>Loading...</p>}
        </div>
    )
}

export { UsagePage };
