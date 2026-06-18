import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Rating, Chip, Avatar, Grid } from '@mui/material'; // ⚡ Fixed: Imports the completely stable standard Grid
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupIcon from '@mui/icons-material/Group';
import { useDashboardStore } from '../../../store/dashboardStore';

const C = { accent: '#00d4aa', card: '#ffffff', text: '#0f2027', textSub: '#6b7f8e', border: '#d8eee9', orange: '#ff6b35', purple: '#7c3aed', teal: '#00d4aa' };

const categoryMap = {
  general: { label: 'General', color: '#3b82f6', icon: '💬' },
  bug: { label: 'Bug Report', color: '#ef4444', icon: '🐛' },
  feature: { label: 'Feature Request', color: '#8b5cf6', icon: '🚀' },
  praise: { label: 'Praise', color: '#ec4899', icon: '💖' },
};

export default function FormsView() {
  const feedbacks = useDashboardStore((state) => state.feedbacks);

  const uniqueUsersList = useMemo(() => {
    const records = feedbacks && feedbacks.length > 0 ? feedbacks : [
      { _id: '1', name: 'Rushi Harad', email: 'rushi@example.com', category: 'feature', rating: 5, message: 'Excellent UI layout! Let\'s scale this application architecture.', createdAt: '2026-05-30T10:00:00Z' },
      { _id: '2', name: 'Kiran Shinde', email: 'kiran@gmail.com', category: 'bug', rating: 2, message: 'Dashboard crashes when handling heavy operational assets.', createdAt: '2026-05-29T14:22:00Z' },
      { _id: '3', name: 'Rushi Harad', email: 'rushi@example.com', category: 'general', rating: 4, message: 'Second entry confirming testing parameters are functional.', createdAt: '2026-05-30T11:15:00Z' },
    ];

    const userMap = {};
    records.forEach(item => {
      const emailKey = item.email?.toLowerCase().trim();
      if (!emailKey) return;

      if (!userMap[emailKey]) {
        userMap[emailKey] = {
          ...item, name: item.name || 'Anonymous User', message: item.message || 'No text content provided',
          rating: item.rating || 0, category: item.category?.toLowerCase() || 'general', date: item.createdAt || new Date(), submissionCount: 1
        };
      } else {
        userMap[emailKey].submissionCount += 1;
        if (new Date(item.createdAt) > new Date(userMap[emailKey].date)) {
          userMap[emailKey].message = item.message;
          userMap[emailKey].rating = item.rating;
          userMap[emailKey].category = item.category?.toLowerCase() || 'general';
          userMap[emailKey].date = item.createdAt;
        }
      }
    });
    return Object.values(userMap);
  }, [feedbacks]);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredUniqueUsers = useMemo(() => {
    return uniqueUsersList.filter(u =>
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueUsersList, searchQuery]);

  return (
    <Box>
      {/* ⚡ Fixed: Replaced size prop layout with standard v5 layout breakpoints props (xs, sm) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <MiniStatCard title="Total Unique Respondents" value={uniqueUsersList.length} icon={<GroupIcon sx={{ color: C.teal }} />} color={C.teal} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MiniStatCard title="Total Raw Feedback Items Filed" value={feedbacks ? feedbacks.length : 3} icon={<AssignmentTurnedInIcon sx={{ color: C.purple }} />} color={C.purple} />
        </Grid>
      </Grid>

      <Paper sx={{ bgcolor: C.card, border: `1px solid ${C.border}`, borderRadius: 2, p: 2.5, boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: C.text }}>Unique User Response Registry</Typography>
            <Typography variant="caption" sx={{ color: C.textSub }}>Aggregating unique emails synced to the live /api/feedback layer</Typography>
          </Box>
          <TextField size="small" placeholder="Search matching names or responses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: C.textSub, fontSize: 20 }} /></InputAdornment> }}
            sx={{ width: 320, bgcolor: '#fbfdfd' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f4fbf9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13 }}>User Profile</TableCell>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13 }}>Submissions</TableCell>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13 }}>Latest Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13 }}>Latest Score</TableCell>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13, width: '42%' }}>Latest Stored Message</TableCell>
                <TableCell sx={{ fontWeight: 700, color: C.text, fontSize: 13 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUniqueUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                const catDetails = categoryMap[user.category] || { label: user.category, color: '#64748b', icon: '📝' };
                return (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 700 }}>{user.name[0]?.toUpperCase()}</Avatar>
                        <Box><Typography sx={{ fontWeight: 700, fontSize: 13, color: C.text }}>{user.name}</Typography><Typography sx={{ fontSize: 11, color: C.textSub }}>{user.email}</Typography></Box>
                      </Box>
                    </TableCell>
                    <TableCell><Chip size="small" label={`${user.submissionCount} Submissions`} sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 11 }} /></TableCell>
                    <TableCell><Chip size="small" label={`${catDetails.icon} ${catDetails.label}`} sx={{ bgcolor: `${catDetails.color}12`, color: catDetails.color, fontWeight: 700, fontSize: 11, border: `1px solid ${catDetails.color}33` }} /></TableCell>
                    <TableCell><Rating value={user.rating} readOnly size="small" precision={0.5} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <MessageIcon sx={{ color: '#cbd5e1', fontSize: 16, mt: 0.3 }} />
                        <Typography sx={{ fontSize: 12.5, color: C.text, lineHeight: 1.4, wordBreak: 'break-word' }}>{user.message}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: C.textSub, whiteSpace: 'nowrap' }}>{new Date(user.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredUniqueUsers.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ fontSize: 12, borderTop: `1px solid ${C.border}`, mt: 1 }} />
      </Paper>
    </Box>
  );
}

function MiniStatCard({ title, value, icon, color }) {
  return (
    <Paper sx={{ p: 2, bgcolor: C.card, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'none' }}>
      <Box>
        <Typography sx={{ color: C.textSub, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{title}</Typography>
        <Typography sx={{ color: C.text, fontSize: 22, fontWeight: 800, mt: 0.5 }}>{value}</Typography>
      </Box>
      <Box sx={{ p: 1, bgcolor: `${color}12`, borderRadius: 2, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    </Paper>
  );
}