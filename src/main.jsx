import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import ThemeContextProvider from './contexts/themeContext/themeContextProvider.jsx'
import ProfileContextProvider from './contexts/profileContext/profileContextProvider.jsx'
import FriendRequestContextProvider from './contexts/friendRequestContext/friendRequestContextProvider.jsx'
import UnreadContextProvider from './contexts/unreadMessageContext/unreadContextProvider.jsx'
import AuthenticateContextProvider from './contexts/authenticateContext/authenticateContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthenticateContextProvider>
      <ThemeContextProvider>
        <ProfileContextProvider>
          <FriendRequestContextProvider>
            <UnreadContextProvider>
              <App />
            </UnreadContextProvider>
          </FriendRequestContextProvider>
        </ProfileContextProvider>
      </ThemeContextProvider>
    </AuthenticateContextProvider>
  </StrictMode>,
);
