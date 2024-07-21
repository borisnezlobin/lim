import { Link, useNavigate } from "react-router-dom";
import { LimitListItem } from "../components/LimitListItem";
import { useContext } from "react";
import { LimitControllerContext } from "../lib/LimitControllerContext";

// const limits: Limit[] = [
//     {
//         id: 1,
//         perDay: 60,
//         urlRegex: "instagram.com",
//         usedToday: 0,
//         allowOneMoreMinute: true
//     },
//     {
//         id: 2,
//         perDay: 30,
//         urlRegex: "facebook.com",
//         usedToday: 0,
//         allowOneMoreMinute: false
//     }
// ]

/** 
 * Lists all of the current limits
 */
function HomePage() {
    const nav = useNavigate();
    const { limits, isEmpty } = useContext(LimitControllerContext);

    return (
        <div>
            <h1 style={{ marginBottom: 0 }}>Your Limits</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => nav("/create")}>Create Limit</button>
                <Link to="/usage">Go to Usage</Link>
            </div>
            {limits && limits.map((limit) => <LimitListItem limit={limit} key={limit.id} />)}
            {isEmpty() && <p>No limits yet! <Link to="/create">Create one</Link> and it will show up here.</p>}
        </div>
    )
}

export { HomePage };
