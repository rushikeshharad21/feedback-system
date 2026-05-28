import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  // Form input states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('general')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')

  // Interactive hover rating state
  const [hoverRating, setHoverRating] = useState(0)

  // Request & UX status states
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  // Simple client-side form validation
  const validateForm = () => {
    if (!name.trim()) return 'Please enter your name.'
    if (!email.trim()) return 'Please enter your email.'
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.'
    if (!category) return 'Please select a feedback category.'
    if (rating === 0) return 'Please select a rating from 1 to 5 stars.'
    if (!message.trim()) return 'Please write a message.'
    return null
  }

  // Handle POST Request
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const validationError = validateForm()
    if (validationError) {
      setStatus('error')
      setErrorMsg(validationError)
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          category,
          rating,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during submission.')
      }

      setStatus('success')
      setSubmittedData(data.data)
      // Reset form fields
      setName('')
      setEmail('')
      setCategory('general')
      setRating(0)
      setMessage('')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err.message || 'Failed to connect to the server. Is the backend running?')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setErrorMsg('')
    setSubmittedData(null)
  }

  const categories = [
    { value: 'general', label: 'General Feedback', icon: '💬' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'feature', label: 'Feature Request', icon: '🚀' },
    { value: 'praise', label: 'Praise & Compliment', icon: '💖' },
  ]

  return (
    <div className="app-container">
      {/* Decorative header */}
      <header className="app-header">
        <div className="logo-group">
          <img src={reactLogo} className="tech-logo react" alt="React logo" />
          <span className="logo-separator">+</span>
          <img src={viteLogo} className="tech-logo vite" alt="Vite logo" />
        </div>
        <h1>WheelTrix Feedback Hub</h1>
        <p className="subtitle">Connect your ideas directly with our engineering team</p>
      </header>

      <main className="form-main-card">
        {status === 'success' ? (
          <div className="success-card">
            <div className="success-icon-wrapper">
              <svg className="success-checkmark" viewBox="0 0 52 52">
                <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2>Thank You, {submittedData?.name || 'Friend'}!</h2>
            <p className="success-desc">
              Your feedback has been successfully securely stored in our <strong>MongoDB Database</strong>.
            </p>
            
            <div className="receipt-summary">
              <h3>Submission Summary</h3>
              <div className="receipt-row">
                <span>Category:</span>
                <strong className="category-tag">{categories.find(c => c.value === submittedData?.category)?.label}</strong>
              </div>
              <div className="receipt-row">
                <span>Rating:</span>
                <span className="stars-row">
                  {'★'.repeat(submittedData?.rating || 0)}
                  {'☆'.repeat(5 - (submittedData?.rating || 0))}
                </span>
              </div>
              {submittedData?.message && (
                <div className="receipt-comment">
                  <span className="comment-label">Your message:</span>
                  <p className="comment-text">"{submittedData.message}"</p>
                </div>
              )}
            </div>

            <button type="button" className="btn-primary" onClick={handleReset}>
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{errorMsg}</span>
              </div>
            )}

            {/* Input Row: Name & Email */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name-input">Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'submitting'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-input">Email Address</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="form-group">
              <label>Select Category</label>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-pill ${category === cat.value ? 'active' : ''}`}
                    onClick={() => setCategory(cat.value)}
                    disabled={status === 'submitting'}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-label">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating Selector */}
            <div className="form-group rating-group">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    type="button"
                    className={`star-btn ${(hoverRating || rating) >= index ? 'active' : ''}`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={status === 'submitting'}
                    aria-label={`Rate ${index} out of 5 stars`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="star-svg"
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="rating-helper">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} selected` : 'Select your rating'}
              </span>
            </div>

            {/* Message Area */}
            <div className="form-group">
              <label htmlFor="message-input">Detailed Feedback</label>
              <textarea
                id="message-input"
                rows="4"
                placeholder="What can we improve? Share your feedback or describe the bug/feature..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'submitting'}
                required
              ></textarea>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className={`btn-primary ${status === 'submitting' ? 'loading' : ''}`}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <span className="spinner"></span>
                    Submitting Feedback...
                  </>
                ) : (
                  'Send Securely to MongoDB'
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="app-footer">
        <p>WheelTrix MERN Feedback System Integration. All feedback is securely stored in real-time.</p>
      </footer>
    </div>
  )
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from "./components/Loginpage"
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Custom clean theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' }, // Modern blue
    secondary: { main: '#8b5cf6' }, // Vibrant purple
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Standardizes CSS normalization */}
      {currentPage === 'landing' ? (
        <LandingPage onNavigateToLogin={() => setCurrentPage('login')} />
      ) : (
        <LoginPage onNavigateBack={() => setCurrentPage('landing')} />
      )}
    </ThemeProvider>
  );
}

export default App;