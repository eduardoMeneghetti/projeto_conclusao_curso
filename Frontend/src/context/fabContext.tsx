import React, { createContext, useCallback, useContext, useState } from 'react';

export type ScreenFabConfig = {
    action: () => void;
    requiresHarvest?: boolean;
    requiresPropriety?: boolean;
};

type FabContextType = {
    currentScreen: string | null;
    setCurrentScreen: (name: string | null) => void;
    screenFabConfigs: Map<string, ScreenFabConfig>;
    registerScreenFab: (screenName: string, config: ScreenFabConfig | null) => void;
};

const FabContext = createContext<FabContextType>({} as FabContextType);

export const FabProvider = ({ children }: any) => {
    const [currentScreen, setCurrentScreen] = useState<string | null>(null);
    const [screenFabConfigs, setScreenFabConfigs] = useState<Map<string, ScreenFabConfig>>(
        () => new Map()
    );

    const registerScreenFab = useCallback((screenName: string, config: ScreenFabConfig | null) => {
        setScreenFabConfigs(prev => {
            const next = new Map(prev);
            if (config === null) {
                next.delete(screenName);
            } else {
                next.set(screenName, config);
            }
            return next;
        });
    }, []);

    return (
        <FabContext.Provider value={{ currentScreen, setCurrentScreen, screenFabConfigs, registerScreenFab }}>
            {children}
        </FabContext.Provider>
    );
};

export const useFab = () => useContext(FabContext);
