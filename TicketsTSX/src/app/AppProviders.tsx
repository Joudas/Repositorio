import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/Context/Auth/AuthContext'
import { useQueryClient } from '@/Hooks/useQuery'
import { LoginProvider } from '@/features/Login/context/LoginContext'
import { RegisterProvider } from '@/features/Register/context/RegisterContext'


export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <QueryClientProvider client={useQueryClient()}>
                <AuthProvider>
                    <RegisterProvider>
                        <LoginProvider>
                            {children}
                        </LoginProvider>
                    </RegisterProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    )
}
