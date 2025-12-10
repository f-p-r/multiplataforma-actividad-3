import React, { createContext, useState, ReactNode } from 'react';

interface ExampleContextType {
    value: string;
    setValue: (value: string) => void;
}

export const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

interface ExampleProviderProps {
    children: ReactNode;
}

export const ExampleProvider: React.FC<ExampleProviderProps> = ({ children }) => {
    const [value, setValue] = useState<string>('');

    return (
        <ExampleContext.Provider value={{ value, setValue }}>
            {children}
        </ExampleContext.Provider>
    );
};
