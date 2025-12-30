import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeContextProvider from './contexts/themeContext/themeContextProvider.jsx'
import ProfileContextProvider from './contexts/profileContext/profileContextProvider.jsx'
import FriendRequestContextProvider from './contexts/friendRequestContext/friendRequestContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
      <ProfileContextProvider>
        <FriendRequestContextProvider>
          <App />
        </FriendRequestContextProvider>
      </ProfileContextProvider>
    </ThemeContextProvider>
  </StrictMode>,
)
