import React, { useState } from "react";
import { Box, Paper, Typography, Button, TextField, Rating, Grid, MenuItem, Alert, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDashboardStore } from "../../../../store/dashboardStore.js";

export default function UserFeedbackFormView() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const currentUser = useDashboardStore((state) => state.currentUser);
  
  // Zustand Store Actions
  const injectRealFeedback = useDashboardStore((state) => state.injectRealFeedback);
  const pushAuditLog = useDashboardStore((state) => state.pushAuditLog);

  // Form States
  const [category, setCategory] = useState("General");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (!message.trim()) {
      setStatus({ type: "error", text: "Please type your feedback message!" });
      return;
    }

    const feedbackPayload = {
      name: currentUser?.name || "Rushi Harad", // सुरक्षित फॉलबॅक नाव
      email: currentUser?.email || "rushi@dev.io",
      category: category,
      rating: Number(rating),
      message: message.trim()
    };

    try {
      // १. ऑडिट लॉग ट्रिगर करणे
      if (typeof pushAuditLog === 'function') {
        pushAuditLog('FEEDBACK_SUBMIT', `Broadcasting ${category} transaction.`, 'User Interface');
      }

      // २. बॅकएंड API ला डेटा पाठवणे
      const response = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackPayload),
      });

      // जर बॅकएंडने ४०४ किंवा ५०० एरर दिला तर थेट कॅच (catch) मध्ये जाणे
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // ३. Zustand स्टेट मध्ये डेटा इंजेक्ट करणे
      if (typeof injectRealFeedback === 'function') {
        injectRealFeedback(data);
      }

      setStatus({ type: "success", text: "Your feedback has been submitted live! Thank you. 🎉" });
      setMessage(""); // फॉर्म रिसेट करणे
      setRating(5);
      setCategory("General");

    } catch (err) {
      console.warn("Submission failed, engaging offline memory bypass:", err);
      
      // ── 💡 बॅकएंड बंद असतानाही फॉर्म चालवण्यासाठी मस्ट-हॅव फॉलबॅक ──
      const offlineFallbackItem = {
        _id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        ...feedbackPayload,
        createdAt: new Date().toISOString()
      };

      if (typeof injectRealFeedback === 'function') {
        injectRealFeedback(offlineFallbackItem);
      }

      if (typeof pushAuditLog === 'function') {
        pushAuditLog('OFFLINE_BYPASS', `Cached ${category} item locally in state matrix.`, 'Storage Engine');
      }

      // युझरचा मूड खराब होऊ नये म्हणून ऑफलाइन जतन केल्याचा यशस्वी मेसेज दाखवा!
      setStatus({ 
        type: "success", 
        text: "Feedback simulated successfully! (Saved to Local Dashboard Memory) 💾" 
      });
      
      setMessage(""); 
      setRating(5);
      setCategory("General");
    }
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.formPanel(isDarkMode)}>
        
        {/* ==================== FORM HEADER ==================== */}
        <Typography variant="h5" sx={styles.title}>
          Submit Live Feedback
        </Typography>
        <Typography variant="body2" sx={styles.subtitle}>
          Your feedback will be broadcast directly to our admin panel in real-time.
        </Typography>

        {/* ==================== NOTIFICATION BANNER ==================== */}
        {status.text && (
          <Alert severity={status.type} sx={styles.alertBanner}>
            {status.text}
          </Alert>
        )}

        {/* ==================== FORM BODY ==================== */}
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={3}>
            
            {/* Category Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Feedback Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="General">General Feedback</MenuItem>
                <MenuItem value="Bug">Bug Report (Error)</MenuItem>
                <MenuItem value="Feature">Feature Request (New Feature)</MenuItem>
                <MenuItem value="Praise">Praise (Appreciation)</MenuItem>
              </TextField>
            </Grid>

            {/* Interactive Star Rating Container */}
            <Grid item xs={12}>
              <Box sx={styles.ratingWrapper(isDarkMode)}>
                <Typography variant="body1" sx={styles.ratingLabel}>
                  Rating:
                </Typography>
                <Rating
                  size="large"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue || 5)}
                />
              </Box>
            </Grid>

            {/* Detailed Message Textarea (FIXED Nested Grid) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                placeholder="Describe your feedback or system experience in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>

            {/* Action Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<SendIcon />}
                sx={styles.submitButton(isDarkMode)}
              >
                Submit Live
              </Button>
            </Grid>
            
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

/* ==================== PREMIUM ARCHITECTURAL DESIGN SYSTEM STYLES ==================== */
const styles = {
  container: { p: 1 },
  formPanel: (isDarkMode) => ({
    p: 4,
    borderRadius: 3,
    maxWidth: 600,
    mx: "auto",
    bgcolor: "background.paper",
    backgroundImage: "none", 
    border: isDarkMode ? "1px solid #334155" : "none",
  }),
  title: { fontWeight: 800, mb: 1, color: "text.primary" },
  subtitle: { color: "text.secondary", mb: 3 },
  alertBanner: { mb: 3, borderRadius: 2 },
  ratingWrapper: (isDarkMode) => ({
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 1.5,
    border: "1px solid",
    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.23)" : "#cbd5e1", 
    borderRadius: 1,
  }),
  ratingLabel: { color: "text.secondary", fontWeight: 500 },
  submitButton: (isDarkMode) => ({
    py: 1.5,
    bgcolor: "#7c3aed",
    "&:hover": { bgcolor: isDarkMode ? "#8b5cf6" : "#6d28d9" },
    fontWeight: 700,
    borderRadius: 2,
    boxShadow: isDarkMode 
      ? "0 4px 14px 0 rgba(124, 58, 237, 0.5)" 
      : "0 4px 6px -1px rgba(124, 58, 237, 0.3)",
    textTransform: "none",
    fontSize: "15px",
  }),
};