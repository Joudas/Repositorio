import React, { createContext, useState, type ReactNode } from 'react'

type AlertContextType = {
  isAlertOpen: boolean
  openAlert: () => void
  closeAlert: () => void
  isSecondAlertOpen: boolean
  openSecondAlert: () => void
  closeSecondAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children } : { children: ReactNode }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isSecondAlertOpen, setSecondIsAlertOpen] = useState(false)

  const openAlert = () => setIsAlertOpen(true)
  const closeAlert = () => setIsAlertOpen(false)
  const openSecondAlert = () => setSecondIsAlertOpen(true)
  const closeSecondAlert = () => setSecondIsAlertOpen(false)

  const data: AlertContextType = {
    isAlertOpen, 
    openAlert, 
    closeAlert, 
    isSecondAlertOpen, 
    openSecondAlert, 
    closeSecondAlert
  }

  return (
    <AlertContext.Provider value={data}>{children}</AlertContext.Provider>
  )
}

