import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LimitControllerContext } from '../lib/LimitControllerContext';

/**
 * Page that has a limit-creation form (name of website, some options, and time per day)
 */
function AddLimitPage() {
    const [website, setWebsite] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const { addLimit } = useContext(LimitControllerContext);
    const nav = useNavigate();

    return (
        <div>
            <h1>Create Limit</h1>
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

            <button onClick={() => {
                // todo: form verification (eh)
                addLimit(name, website, parseFloat(time));
                console.log("added limit for", website);
                nav("/");
            }} style={{
                marginRight: "1em"
            }}>
                Create
            </button>
            <button onClick={() => nav("/")}>
                Cancel
            </button>
        </div>
    )
}

export { AddLimitPage }
