import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', symbol: '$', rate: 1, label: 'USD' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP' },
  { code: 'NGN', symbol: '₦', rate: 1550, label: 'NGN' },
];

interface CurrencyContextType {
  selectedCurrency: CurrencyOption;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (val: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencyOptions[0]);

  const setCurrencyByCode = (code: string) => {
    const opt = currencyOptions.find(o => o.code === code);
    if (opt) {
      setSelectedCurrency(opt);
    }
  };

  const formatPrice = (val: number) => {
    const converted = val * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setCurrencyByCode, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
