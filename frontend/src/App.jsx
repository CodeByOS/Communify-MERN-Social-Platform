import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboargingPage from "./pages/OnboardingPage.jsx"

import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";


const App = () => {

  const { isLoading, authUser } = useAuthUser(); //* Custom hook to get auth user data

  const isAuthenticated = Boolean(authUser); //* Check if user is authenticated
  const isOnboarded = authUser?.isOnboarded //* Check if user is boarded

  //* Loading spinner Component
  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme="night">

      <Routes>
        {/* Redirect to login page if user is not authenticated */}
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <HomePage />
        ) : (
          <Navigate to={ !isAuthenticated ? "/login" : "/onboarding" } />
        ) } />
        
        
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" /> } />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" /> } />

        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" /> } />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" /> } />
        
        {/* Onboarding page */}
        <Route path="/onboarding" element={isAuthenticated ? (
          isOnboarded ? <Navigate to="/" /> : <OnboargingPage />
        ) : (
          <Navigate to="/login" />
        ) } />
        
      </Routes>


      <Toaster />
    </div>
  )
}

export default App