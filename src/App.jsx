import { Routes, Route, Navigate } from 'react-router-dom'
import { InterviewProvider } from './context/InterviewContext'
import Home from './components/Home'
import Interview from './components/Interview'
import AddQuestion from './components/AddQuestion'
import './index.css'
import QuestionsList from './components/QuestionsList'

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/edit-question/:id" element={<AddQuestion />} />   
        <Route path="/questions" element={<QuestionsList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  )
}

export default App