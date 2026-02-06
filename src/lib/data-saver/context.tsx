'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type DataSaverMode = 'auto' | 'on' | 'off'

interface DataSaverContextType {
  mode: DataSaverMode
  setMode: (mode: DataSaverMode) => void
  isDataSaverActive: boolean
  // Computed settings based on mode
  imageQuality: 'low' | 'medium' | 'high'
  loadVideos: boolean
  prefetchEnabled: boolean
  animationsEnabled: boolean
}

const DataSaverContext = createContext<DataSaverContextType | null>(null)

export function DataSaverProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DataSaverMode>('auto')
  const [connectionType, setConnectionType] = useState<string>('4g')
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('findr-data-saver')
    if (saved && ['auto', 'on', 'off'].includes(saved)) {
      setModeState(saved as DataSaverMode)
    }

    // Detect connection type and Save-Data header
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      setConnectionType(conn?.effectiveType || '4g')
      setSaveData(conn?.saveData || false)

      conn?.addEventListener('change', () => {
        setConnectionType(conn?.effectiveType || '4g')
        setSaveData(conn?.saveData || false)
      })
    }
  }, [])

  const setMode = (newMode: DataSaverMode) => {
    setModeState(newMode)
    localStorage.setItem('findr-data-saver', newMode)
  }

  // Determine if data saver is active
  const isDataSaverActive = 
    mode === 'on' || 
    (mode === 'auto' && (saveData || connectionType === '2g' || connectionType === 'slow-2g'))

  // Compute settings based on mode and connection
  const getSettings = (): Omit<DataSaverContextType, 'mode' | 'setMode' | 'isDataSaverActive'> => {
    if (mode === 'off') {
      return {
        imageQuality: 'high',
        loadVideos: true,
        prefetchEnabled: true,
        animationsEnabled: true,
      }
    }

    if (mode === 'on' || isDataSaverActive) {
      return {
        imageQuality: 'low',
        loadVideos: false,
        prefetchEnabled: false,
        animationsEnabled: false,
      }
    }

    // Auto mode with good connection
    if (connectionType === '4g') {
      return {
        imageQuality: 'high',
        loadVideos: true,
        prefetchEnabled: true,
        animationsEnabled: true,
      }
    }

    // Auto mode with 3g
    return {
      imageQuality: 'medium',
      loadVideos: false,
      prefetchEnabled: false,
      animationsEnabled: true,
    }
  }

  const settings = getSettings()

  return (
    <DataSaverContext.Provider
      value={{
        mode,
        setMode,
        isDataSaverActive,
        ...settings,
      }}
    >
      {children}
    </DataSaverContext.Provider>
  )
}

export function useDataSaver() {
  const context = useContext(DataSaverContext)
  if (!context) {
    throw new Error('useDataSaver must be used within DataSaverProvider')
  }
  return context
}
