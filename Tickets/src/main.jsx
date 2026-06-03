import App from './App';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { RegisterProvider } from './Context/Register/RegisterContext';
import { LoginProvider } from './Context/Login/LoginContext';
import { AuthProvider } from './Context/Auth/AuthContext';
import { TicketProvider } from './Context/Tickets/TicketContext';
import { NoteProvider } from './Context/Tickets/NoteContext';
import { TicketFormProvider } from './Context/Tickets/TicketFormContext';
import { AlertProvider } from './Components/Hooks/useAlert';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <AlertProvider>
        <RegisterProvider>
          <LoginProvider>
            <TicketProvider>
              <TicketFormProvider>
                <NoteProvider>
                  <App />
                </NoteProvider>
              </TicketFormProvider>
            </TicketProvider>
          </LoginProvider>
        </RegisterProvider>
          </AlertProvider>
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
