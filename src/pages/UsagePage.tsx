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

    return (
        <div style={{ width: "100%" }}>
            <h1 style={{ marginBottom: 0 }}>Usage Today</h1>
            <button onClick={() => nav("/")} style={{ marginBottom: "1rem" }}>
                Back
            </button>
            {usageArr ? usageArr.map((m) => {
                if(m[1].time < 60 * 1000) return null;
                const e = m[1];
                const name = e.url.length > 40 ? e.url.slice(0, 40) + "..." : e.url;
                return (
                    <div key={e.url} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
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
