import React, { createContext, useContext, useState } from 'react';

type SyncContextType = {
    isSyncing: boolean;
    setIsSyncing: (value: boolean) => void;
};

const SyncContext = createContext<SyncContextType>({} as SyncContextType);

export const SyncProvider = ({ children }: any) => {
    const [isSyncing, setIsSyncing] = useState(false);

    return (
        <SyncContext.Provider value={{ isSyncing, setIsSyncing }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => useContext(SyncContext);