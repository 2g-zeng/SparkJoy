import { Routes, Route, useLocation } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'
import Login from './components/Login'
import StoryGenerator from './components/StoryGenerator'
import StoryLibrary from './components/StoryLibrary'
import StoryViewer from './components/StoryViewer'
import Header from './components/Header'
import { useContext } from 'react'
import { AuthContext } from './components/AuthProvider'

function AppContent() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isLoginPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {user && !isLoginPage && <Header />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create" element={<StoryGenerator />} />
          <Route path="/library" element={<StoryLibrary />} />
          <Route path="/story/:id" element={<StoryViewer />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
