import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboargingPage from "./pages/OnboardingPage.jsx"

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";

const App = () => {
  //* Tanstack query
  //* get => useQuery
  const { data: authData } = useQuery({ 
    queryKey: ["authUser"],
    queryFn: async() => {
      const res = await axiosInstance("/auth/me");
      return res.data;
    },
    retry: false, //* Disable retrying on failure (e.g., for auth checks)
  })

  const authUser = authData?.user

  return (
    <div className="h-screen" data-theme="night">

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" /> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" /> } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" /> } />

        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" /> } />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" /> } />
        <Route path="/onboarding" element={authUser ? <OnboargingPage /> : <Navigate to="/login" /> } />
        
      </Routes>


      <Toaster />
    </div>
  )
}

export default App