import { Link, useNavigate } from "react-router-dom";
import { Limit } from "../lib/LimitController";
import { LimitListItem } from "../components/LimitListItem";

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

    return (
        <div>
            <h1 style={{ marginBottom: 0 }}>Your Limits</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => nav("/create")}>Create Limit</button>
                <Link to="/usage">Go to Usage</Link>
            </div>
            {limits.map((limit) => <LimitListItem limit={limit} key={limit.id} />)}
        </div>
    )
}

export { HomePage };
