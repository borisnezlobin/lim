import { createContext, useEffect, useMemo, useState } from 'react';
import { Limit, LimitController } from './LimitController';

type LimitControllerContextType = {
    limits: Limit[] | null;
    addLimit: (name: string, regex: string, time: number) => void;
    isEmpty: () => boolean;
}

const LimitControllerContext = createContext<LimitControllerContextType>({
    limits: null,
    addLimit: () => {},
    isEmpty: () => true,
});

const LimitControllerProvider = ({ children }: { children: React.ReactNode }) => {
    const limitController = useMemo(() => new LimitController(), []);
    const [limits, setLimits] = useState<Limit[] | null>(null);

    useEffect(() => {
        if(limits === null) {
            limitController.read().then((result) => {
                setLimits(result.limits);
            });
        }
    }, [limits, limitController]);

    function addLimit(name: string, regex: string, time: number){
        const limit: Limit = {
            id: (limits && limits.length + 1) || 0,
            name: name,
            urlRegex: regex,
            perDay: time,
            allowOneMoreMinute: false,
        }
        limitController.add(limit);
        setLimits(limitController.limits);
    }

    function isEmpty(){
        return limits === null || limits === undefined || limits.length === 0;
    }

    return (
        <LimitControllerContext.Provider value={{
            limits,
            addLimit,
            isEmpty
        }}>
            {children}
        </LimitControllerContext.Provider>
    );
}


export { LimitControllerContext, LimitControllerProvider };