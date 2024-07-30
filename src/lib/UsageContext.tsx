import { createContext, useEffect, useState } from "react";

type UsageType = {
    time: number,
    icon: string;
    url: string;
};

type UsageContextType = {
    usage: { [key: string]: UsageType } | null;
    usageArr: [string, UsageType][];
}


const UsageContext = createContext<UsageContextType>({
    usage: {},
    usageArr: [],
});


const UsageProvider = ({ children }: { children: React.ReactNode }) => {
    const [usage, setUsage] = useState<{ [key: string]: UsageType } | null>(null);

    useEffect(() => {
        if (usage == null) {
            updateUsage();
        }

        async function updateUsage() {
            // @ts-expect-error browser is "not defined", but it is in our case
            const usage = (await browser.storage.local.get("usage")).usage || {};
            setUsage(usage);
        }
    }, [usage]);

    return (
        <UsageContext.Provider value={{
            usage: usage,
            usageArr: usage ? Object.entries(usage).sort((a, b) => b[1].time - a[1].time) : [],
        }}>
            {children}
        </UsageContext.Provider>
    )
}

export { UsageContext, UsageProvider };