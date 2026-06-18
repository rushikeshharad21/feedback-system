import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🛡️ Error Boundary पॅकेज आणि तुझा Fallback कॉम्पोनंट इम्पोर्ट करा
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from "./components/ErrorFallback.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🛡️ संपूर्ण ॲप्लिकेशनला इथे मुख्य गेटवरच सुरक्षित कवच दिले आहे */}
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 'Try Again' बटणावर क्लिक केल्यास ॲप रीफ्रेश होईल
        window.location.reload();
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)