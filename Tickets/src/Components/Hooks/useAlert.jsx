import React, { createContext, useContext, useState } from 'react'

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isSecondAlertOpen, setSecondIsAlertOpen] = useState(false)

  const openAlert = () => setIsAlertOpen(true)
  const closeAlert = () => setIsAlertOpen(false)
  const openSecondAlert = () => setSecondIsAlertOpen(true)
  const closeSecondAlert = () => setSecondIsAlertOpen(false)

  return (
    <AlertContext.Provider value={{ isAlertOpen, openAlert, closeAlert, isSecondAlertOpen, openSecondAlert, closeSecondAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

const useAlert = () => {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}

export default useAlert;