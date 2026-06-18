import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Container, Tabs, Tab } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useDashboardStore } from '../../store/dashboardStore.js';

export default function LoginView() {
  const [tab, setTab]           = useState(0); // 0 = login, 1 = register
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const setCurrentUser = useDashboardStore((state) => state.setCurrentUser);

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setError(''); setSuccess(''); };

  const handleTabChange = (e, newVal) => { setTab(newVal); resetForm(); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Bypass login for testing
    if (email === 'rushikeshharad21@gmail.com' && password === 'Rushi4441@#') {
      setCurrentUser({ name: 'Rushi Admin', email: 'rushikeshharad21@gmail.com', role: 'admin' });
      return;
    }
    if (email === 'user@test.com' && password === 'user123') {
      setCurrentUser({ name: 'Rushi User', email: 'user@test.com', role: 'user' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Unable to connect to the backend server.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
           console.log(name)
    if (!name.trim()) { setError('Name is required.'); return; }

    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password, role: 'user' }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Account created! You can now sign in.');
        setTab(0);
        resetForm();
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Unable to connect to the backend server.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>

          <Box sx={{ m: 1, bgcolor: '#7c3aed', color: 'white', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            {tab === 0 ? <LockOutlinedIcon /> : <PersonAddIcon />}
          </Box>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Feedback System
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            {tab === 0 ? 'Sign in to your dashboard' : 'Create a new account'}
          </Typography>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              width: '100%',
              mb: 3,
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '14px' },
              '& .MuiTabs-indicator': { bgcolor: '#7c3aed' },
              '& .Mui-selected': { color: '#7c3aed !important' }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error   && <Alert severity="error"   sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{success}</Alert>}

          {/* ── LOGIN FORM ── */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField
                margin="normal" required fullWidth
                label="Email Address" autoComplete="email" autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal" required fullWidth
                label="Password" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit" fullWidth variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '15px' }}
              >
                Sign In
              </Button>
            </Box>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
              <TextField
                margin="normal" required fullWidth
                label="Full Name" autoFocus
                value={name} onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal" required fullWidth
                label="Email Address" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal" required fullWidth
                label="Password" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit" fullWidth variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '15px' }}
              >
                Create Account
              </Button>
            </Box>
          )}

        </Paper>
      </Container>
    </Box>
  );
}