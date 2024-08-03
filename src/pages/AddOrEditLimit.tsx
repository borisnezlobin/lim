import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LimitControllerContext } from '../lib/LimitControllerContext';

/**
 * Page that has a limit-creation form (name of website, some options, and time per day)
 */
function AddOrEditLimitPage() {
    const location = useLocation();
    const isAdding = location.pathname === "/create";

    const [website, setWebsite] = useState<string>(isAdding ? "" : location.state.limit.urlRegex);
    const [name, setName] = useState<string>(isAdding ? "" : location.state.limit.name);
    const [time, setTime] = useState<string>(isAdding ? "" : location.state.limit.perDay.toString());
    const { addLimit, editLimit } = useContext(LimitControllerContext);
    const nav = useNavigate();

    const submit = () => {
        // todo: validate input (IMPORTANT (ish))
        if (isAdding) {
            addLimit(name, website, parseFloat(time));
        } else {
            editLimit(location.state.limit.id, name, website, parseFloat(time));
        }
        nav("/");
    }

    // @ts-expect-error should work
    const url = browser.runtime.getURL("html/regexlimits.html");

    return (
        <div>
            <h1>{isAdding ? "Create" : "Edit"} Limit</h1>
            <form style={{ width: "100%" }}>
                <InputWithTitle placeholder="Ex: Social Media" title='Name' value={name} onChange={setName} />
                <InputWithTitle placeholder='Ex: twitter\.com' title='Website RegEx' value={website} onChange={setWebsite} />
                <p>
                    Don't know what this means? Check out <a href={url} target="_blank" rel="noopener noreferrer">our guide</a>.
                </p>
                <InputWithTitle placeholder="Ex: 20" title='Time per day' value={time} onChange={setTime} />
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

const InputWithTitle = ({ title, placeholder, value, onChange }: { title: string, value: string, placeholder?: string, onChange: (value: string) => void }) => {
    return (
        <div>
            <p style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: 0 }}>
                {title}
            </p>
            <input
                value={value}
                placeholder={placeholder ?? title}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export { AddOrEditLimitPage }
