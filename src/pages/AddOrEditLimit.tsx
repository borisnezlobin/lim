import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LimitControllerContext } from '../lib/LimitControllerContext';

/**
 * Page that has a limit-creation form (name of website, some options, and time per day)
 */
function AddLimitPage() {
    const location = useLocation();
    const isAdding = location.pathname === "/create";

    const [website, setWebsite] = useState<string>(isAdding ? "" : location.state.limit.urlRegex);
    const [name, setName] = useState<string>(isAdding ? "" : location.state.limit.name);
    const [time, setTime] = useState<string>(isAdding ? "" : location.state.limit.perDay.toString());
    const { addLimit, editLimit } = useContext(LimitControllerContext);
    const nav = useNavigate();

    const submit = () => {
        if (isAdding) {
            addLimit(name, website, parseFloat(time));
        } else {
            editLimit(location.state.limit.id, name, website, parseFloat(time));
        }
        nav("/");
    }

    return (
        <div>
            <h1>{isAdding ? "Create" : "Edit"} Limit</h1>
            <form style={{ width: "100%" }}>
                <input
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder='Website domain (e.g. instagram.com)'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
                <input
                    placeholder="Time limit (in minutes)"
                    value={time}
                    type='number'
                    onChange={(e) => setTime(e.target.value)}
                />
            </form>

            <button onClick={submit} style={{
                marginRight: "1em"
            }}>
                {isAdding ? "Create" : "Save"}
            </button>
            <button onClick={() => nav("/")}>
                Cancel
            </button>
        </div>
    )
}

export { AddLimitPage }
