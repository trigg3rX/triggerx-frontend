import { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [refreshBalance, setRefreshBalance] = useState(0); // Use a number instead of boolean for more reliable change detection
  
  const triggerBalanceRefresh = () => {
    console.log("Balance refresh triggered from context");
    // Increment the counter each time to ensure a new value
    setRefreshBalance(prev => prev + 1);
  };
  
  return (
    <WalletContext.Provider value={{ refreshBalance, triggerBalanceRefresh }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);