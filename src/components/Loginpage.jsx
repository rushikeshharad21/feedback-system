import React, { useState } from 'react';
import { 
  Container, Box, Card, CardContent, Typography, TextField, Button, IconButton, InputAdornment, Stack 
} from '@mui/material';
import { 
  Visibility, VisibilityOff, EmailOutlined, LockOutlined, ArrowBack 
} from '@mui/icons-material';

function LoginPage({ onNavigateBack }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Button startIcon={<ArrowBack />} onClick={onNavigateBack} sx={{ mb: 3, color: '#475569' }}>
          Back to Home
        </Button>

        <Card sx={{ borderRadius: 4, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="#1e293b" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to manage your system insights
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="text" size="small" sx={{ textTransform: 'none' }}>
                    Forgot password?
                  </Button>
                </Box>

                <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}>
                  Sign In
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;