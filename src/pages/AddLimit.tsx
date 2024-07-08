import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Page that has a limit-creation form (name of website, some options, and time per day)
 */
function AddLimitPage() {
    const [website, setWebsite] = useState<string>("");

    const nav = useNavigate();

    return (
        <div>
            <h1>Create Limit</h1>
            <form>
                <input
                    placeholder='Website domain (e.g. instagram.com)'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </form>

            <button onClick={() => nav("/")}>
                Cancel
            </button>
        </div>
    )
}

export { AddLimitPage }
