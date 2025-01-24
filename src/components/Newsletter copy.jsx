import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Send as SendIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Campaign as CampaignIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';

const StyledDialog = styled(Dialog)(({ theme, isDarkMode }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.95) 0%, rgba(21, 27, 59, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
    backdropFilter: 'blur(12px)',
    boxShadow: isDarkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(31, 38, 135, 0.15)',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.4)',
  }
}));

const StyledSearchBar = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    color: isDarkMode ? '#fff' : '#19234d',
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.07) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.09) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
      boxShadow: isDarkMode 
        ? '0 4px 20px rgba(0,0,0,0.2)'
        : '0 4px 20px rgba(0,0,0,0.1)',
    }
  }
}));

// Styled TextField component to match theme
const StyledTextField = ({ isDarkMode, ...props }) => (
  <TextField
    {...props}
    variant="outlined"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
        },
      },
      '& .MuiInputLabel-root': {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        '&.Mui-focused': {
          color: isDarkMode ? '#d9764a' : '#2b5a9e',
        },
      },
      '& .MuiOutlinedInput-input': {
        color: isDarkMode ? '#fff' : '#000',
      },
    }}
  />
);

const Newsletter = () => {
  const { isDarkMode } = useTheme();
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduledDate: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState({
    subscribers: false,
    action: false
  });
  const [filter, setFilter] = useState('all'); // 'all', 'subscribed', 'unsubscribed'

  // Fetch newsletters and subscribers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [newslettersRes, subscribersRes] = await Promise.all([
          fetch(`${baseUrl}/api/newsletters`),
          fetch(`${baseUrl}/api/subscribers`)
        ]);
        
        const [newslettersData, subscribersData] = await Promise.all([
          newslettersRes.json(),
          subscribersRes.json()
        ]);

        setNewsletters(newslettersData);
        setSubscribers(subscribersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNewsletter = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ subject: '', content: '', scheduledDate: '' });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh newsletters list
        const updatedNewsletters = await fetch(`${baseUrl}/api/newsletters`).then(res => res.json());
        setNewsletters(updatedNewsletters);
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error creating newsletter:', error);
    }
  };

  // Handle subscriber status toggle
  const handleStatusToggle = async (subscriberId, currentStatus) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const newStatus = currentStatus === 'Subscribed' ? 'Unsubscribed' : 'Subscribed';
      const response = await fetch(`${baseUrl}/api/subscribers/${subscriberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSubscribers(prev =>
          prev.map(sub =>
            sub._id === subscriberId ? { ...sub, status: newStatus } : sub
          )
        );
        toast.success(`Subscriber ${newStatus.toLowerCase()} successfully`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update subscriber status');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Handle subscriber deletion
  const handleDeleteSubscriber = async (subscriberId) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;
    
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const response = await fetch(`${baseUrl}/api/subscribers/${subscriberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscribers(prev => prev.filter(sub => sub._id !== subscriberId));
        toast.success('Subscriber deleted successfully');
      } else {
        throw new Error('Failed to delete subscriber');
      }
    } catch (error) {
      toast.error('Failed to delete subscriber');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    if (filter === 'all') return true;
    return sub.status.toLowerCase() === filter;
  });

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, sm: 2.5, md: 3 },
      background: isDarkMode
        ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDarkMode
          ? 'radial-gradient(circle at 50% 0%, rgba(217, 118, 74, 0.15), transparent 50%)'
          : 'radial-gradient(circle at 50% 0%, rgba(43, 90, 158, 0.1), transparent 50%)',
        animation: 'pulse 8s ease-in-out infinite',
      },
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 0.5,
        },
        '50%': {
          opacity: 0.8,
        },
      }
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: isDarkMode
          ? 'rgba(25, 35, 77, 0.8)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        p: 3,
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.2)'
          : '0 8px 32px rgba(31, 38, 135, 0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CampaignIcon sx={{ 
            fontSize: '2rem',
            color: isDarkMode ? '#d9764a' : '#2b5a9e'
          }} />
          <Typography variant="h4" sx={{ 
            color: isDarkMode ? '#fff' : '#19234d',
            fontWeight: 600 
          }}>
            Newsletter Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewsletter}
          sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
              : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
            borderRadius: '12px',
            textTransform: 'none',
            padding: '8px 24px',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 6px 20px rgba(217, 118, 74, 0.4)'
                : '0 6px 20px rgba(43, 90, 158, 0.4)',
            }
          }}
        >
          Create Newsletter
        </Button>
      </Box>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{
              borderRadius: '16px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.1), rgba(43, 90, 158, 0.1))'
                : 'white',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  color: isDarkMode ? '#fff' : '#19234d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <DashboardIcon /> Newsletter Stats
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ color: isDarkMode ? '#4CAF50' : '#2E7D32' }} />
                    <Typography color="text.secondary" sx={{
                      color: isDarkMode ? '#fff' : '#19234d',
                    }}>Active Subscribers</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: isDarkMode ? '#4CAF50' : '#2E7D32',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <CheckCircleIcon fontSize="small" />
                    {subscribers.filter(s => s.status === 'Subscribed').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonRemoveIcon sx={{ color: isDarkMode ? '#ff5252' : '#d32f2f' }} />
                    <Typography color="text.secondary" sx={{
                      color: isDarkMode ? '#fff' : '#19234d',
                    }}>Inactive Subscribers</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: isDarkMode ? '#ff5252' : '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <BlockIcon fontSize="small" />
                    {subscribers.filter(s => s.status === 'Unsubscribed').length}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(subscribers.filter(s => s.status === 'Subscribed').length / subscribers.length) * 100}
                  sx={{ 
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                        : 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                    }
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} md={8}>
          <Paper sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '16px',
            background: isDarkMode
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(31, 38, 135, 0.1)',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                Subscribers
              </Typography>
              <Tooltip title="Filter subscribers">
                <Button
                  size="small"
                  startIcon={<FilterListIcon />}
                  onClick={(e) => setFilter(filter === 'all' ? 'subscribed' : filter === 'subscribed' ? 'unsubscribed' : 'all')}
                  sx={{
                    color: isDarkMode ? '#fff' : '#19234d',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  {filter === 'all' ? 'All' : filter === 'subscribed' ? 'Active' : 'Inactive'}
                </Button>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNewsletter}
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                  : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
                borderRadius: '20px',
                padding: '10px 24px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                boxShadow: isDarkMode
                  ? '0 4px 15px rgba(217, 118, 74, 0.3)'
                  : '0 4px 15px rgba(43, 90, 158, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 6px 20px rgba(217, 118, 74, 0.4)'
                    : '0 6px 20px rgba(43, 90, 158, 0.4)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #de7527 0%, #d9764a 100%)'
                    : 'linear-gradient(135deg, #19234d 0%, #2b5a9e 100%)',
                }
              }}
            >
              Create Newsletter
            </Button>
          </Paper>
        </Grid>

        {/* Subscribers Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{
            borderRadius: '16px',
            background: isDarkMode
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(31, 38, 135, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 12px 40px rgba(0, 0, 0, 0.3)'
                : '0 12px 40px rgba(31, 38, 135, 0.15)',
            }
          }}>
            {loading.subscribers && (
              <LinearProgress 
                sx={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                      : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
                  }
                }}
              />
            )}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Subscriber</TableCell>
                  <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Email</TableCell>
                  <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Status</TableCell>
                  <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Joined Date</TableCell>
                  <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscribers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((subscriber) => (
                    <TableRow 
                      key={subscriber._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: subscriber.status === 'Subscribed'
                              ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                              : (isDarkMode ? '#f44336' : '#d32f2f')
                          }}>
                            {subscriber.name[0].toUpperCase()}
                          </Avatar>
                          <Typography sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                            {subscriber.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={subscriber.status}
                          color={subscriber.status === 'Subscribed' ? 'success' : 'error'}
                          sx={{ 
                            borderRadius: '8px',
                            '& .MuiChip-label': {
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }
                          }}
                          icon={subscriber.status === 'Subscribed' ? <CheckCircleIcon /> : <BlockIcon />}
                        />
                      </TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                        <Tooltip title={new Date(subscriber.subscribedAt).toLocaleString()}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon fontSize="small" />
                            {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={subscriber.status === 'Subscribed' ? 'Unsubscribe' : 'Subscribe'}>
                          <IconButton
                            onClick={() => handleStatusToggle(subscriber._id, subscriber.status)}
                            disabled={loading.action}
                            sx={{ 
                              color: subscriber.status === 'Subscribed' 
                                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                                : (isDarkMode ? '#ff5252' : '#d32f2f'),
                              '&:hover': {
                                backgroundColor: subscriber.status === 'Subscribed'
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : 'rgba(255, 82, 82, 0.1)',
                              }
                            }}
                          >
                            {subscriber.status === 'Subscribed' ? <CheckCircleIcon /> : <BlockIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Email">
                          <IconButton
                            sx={{ 
                              color: isDarkMode ? '#d9764a' : '#2b5a9e',
                              '&:hover': {
                                backgroundColor: isDarkMode 
                                  ? 'rgba(217, 118, 74, 0.1)'
                                  : 'rgba(43, 90, 158, 0.1)',
                              }
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete subscriber">
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteSubscriber(subscriber._id)}
                            disabled={loading.action}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredSubscribers.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{ color: isDarkMode ? '#fff' : '#19234d' }}
            />
          </TableContainer>
        </Grid>
      </Grid>

      {/* Create Newsletter Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: isDarkMode ? '#19234d' : 'white',
          }
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
          Create Newsletter
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
              label="Subject"
              fullWidth
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              isDarkMode={isDarkMode}
            />
            <StyledTextField
              label="Content"
              fullWidth
              multiline
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              isDarkMode={isDarkMode}
            />
            <StyledTextField
              label="Scheduled Date"
              type="datetime-local"
              fullWidth
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              isDarkMode={isDarkMode}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Newsletter;
