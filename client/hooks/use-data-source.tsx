"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiAdapter } from '../lib/api-adapter';
import { toast } from './use-toast';

export type DataMode = 'dummy' | 'live';

interface DataSourceContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  isConnected: boolean;
  checkingConnection: boolean;
  retryConnection: () => Promise<boolean>;
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataMode, setDataModeState] = useState<DataMode>('dummy');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(true);

  // Initialize data mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('astra_data_mode') as DataMode;
      if (stored === 'live') {
        // Run health check before staying in live mode
        checkServerConnection();
      } else {
        setDataModeState('dummy');
        setCheckingConnection(false);
      }
    }
  }, []);

  const checkServerConnection = async () => {
    setCheckingConnection(true);
    const isUp = await apiAdapter.checkHealth();
    setIsConnected(isUp);
    
    if (isUp) {
      setDataModeState('live');
      localStorage.setItem('astra_data_mode', 'live');
    } else {
      setDataModeState('dummy');
      localStorage.setItem('astra_data_mode', 'dummy');
      toast({
        title: 'Server Connection Failed',
        description: 'AstraHealth backend is unreachable. Reverted to Demo (Dummy) mode.',
        variant: 'destructive',
      });
    }
    setCheckingConnection(false);
  };

  const setDataMode = async (mode: DataMode) => {
    if (mode === 'live') {
      setCheckingConnection(true);
      const isUp = await apiAdapter.checkHealth();
      setIsConnected(isUp);
      setCheckingConnection(false);

      if (isUp) {
        setDataModeState('live');
        localStorage.setItem('astra_data_mode', 'live');
        toast({
          title: 'Connected to Server',
          description: 'AstraHealth is now fetching records directly from the database.',
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Cannot switch to Live. NestJS backend is offline.',
          variant: 'destructive',
        });
      }
    } else {
      setDataModeState('dummy');
      localStorage.setItem('astra_data_mode', 'dummy');
      toast({
        title: 'Demo Mode Activated',
        description: 'Using simulated local data records.',
      });
    }
  };

  const retryConnection = async (): Promise<boolean> => {
    setCheckingConnection(true);
    const isUp = await apiAdapter.checkHealth();
    setIsConnected(isUp);
    setCheckingConnection(false);
    if (isUp) {
      toast({
        title: 'Connection Successful',
        description: 'NestJS backend server is online.',
      });
    }
    return isUp;
  };

  return (
    <DataSourceContext.Provider
      value={{
        dataMode,
        setDataMode,
        isConnected,
        checkingConnection,
        retryConnection,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};
