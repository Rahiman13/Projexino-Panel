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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const StyledDialog = styled(Dialog)(({ theme, isDarkMode }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: isDarkMode
    ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.1), rgba(43, 90, 158, 0.1))'
    : 'white',
    backdropFilter: 'blur(12px)',
    boxShadow: isDarkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(31, 38, 135, 0.15)',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.4)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: isDarkMode
        ? 'linear-gradient(90deg, #d9764a, #de7527, #19234d)'
        : 'linear-gradient(90deg, #2b5a9e, #19234d, #d9764a)',
      zIndex: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: isDarkMode
        ? 'radial-gradient(circle at top right, rgba(217, 118, 74, 0.1), transparent 60%)'
        : 'radial-gradient(circle at top right, rgba(43, 90, 158, 0.1), transparent 60%)',
      pointerEvents: 'none',
    }
  },
  '& .MuiDialogTitle-root': {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.95) 0%, rgba(21, 27, 59, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
    borderBottom: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDialogContent-root': {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.8) 0%, rgba(21, 27, 59, 0.8) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 247, 250, 0.8) 100%)',
  },
  '& .MuiDialogActions-root': {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.95) 0%, rgba(21, 27, 59, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
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
    title: '',
    subject: '',
    announcement: '',
    buttonText: '',
    buttonUrl: '',
    images: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState({
    subscribers: false,
    action: false
  });
  const [filter, setFilter] = useState('all'); // 'all', 'subscribed', 'unsubscribed'
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [availableYears] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 5}, (_, i) => currentYear - 2 + i);
  });

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

  useEffect(() => {
    fetchAnnouncementCounts();
    fetchMonthlyData(selectedYear);
  }, [selectedYear]);

  const fetchAnnouncementCounts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/newsletters/announcement-count`);
      const data = await response.json();
      console.log(data);
      setTotalAnnouncements(data.totalCount);
    } catch (error) {
      console.error('Error fetching announcement counts:', error);
    }
  };

  const fetchMonthlyData = async (year) => {
    try {
      const response = await fetch(`${baseUrl}/api/newsletters/announcement-count/${year}`);
      const data = await response.json();
      setMonthlyData(data.monthlyCounts);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const handleCreateNewsletter = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      subject: '',
      announcement: '',
      buttonText: '',
      buttonUrl: '',
    });
    setImageFiles([]);
    setImagePreviewUrls([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    setSendingNewsletter(true);
    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('announcement', formData.announcement);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonUrl', formData.buttonUrl);
      
      // Append each image file
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${baseUrl}/api/newsletters/send-announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Newsletter sent successfully!');
        handleCloseDialog();
        // Refresh newsletters list
        const updatedNewsletters = await fetch(`${baseUrl}/api/newsletters`).then(res => res.json());
        setNewsletters(updatedNewsletters);
      } else {
        throw new Error(data.message || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error(error.message || 'Failed to send newsletter');
    } finally {
      setSendingNewsletter(false);
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
                  <MailIcon /> Newsletter Stats
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CampaignIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                    <Typography color="text.secondary" sx={{
                      color: isDarkMode ? '#fff' : '#19234d',
                    }}>Total Announcements</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: isDarkMode ? '#d9764a' : '#2b5a9e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    {totalAnnouncements}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" sx={{
                  color: isDarkMode ? '#fff' : '#19234d',

                  }}>Active Subscribers</Typography>
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
                  <Typography color="text.secondary" sx={{
                  color: isDarkMode ? '#fff' : '#19234d',

                  }}>Inactive Subscribers</Typography>
                  <Typography variant="h6" sx={{ 
                    color: isDarkMode ? '#f44336' : '#d32f2f',
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
                        <Tooltip title={`${subscriber.status === 'Subscribed' ? 'Unsubscribe' : 'Subscribe'} user`}>
                          <IconButton 
                            onClick={() => handleStatusToggle(subscriber._id, subscriber.status)}
                            disabled={loading.action}
                            color={subscriber.status === 'Subscribed' ? 'success' : 'error'}
                          >
                            {subscriber.status === 'Subscribed' ? <PersonRemoveIcon /> : <PersonAddIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send email">
                          <IconButton 
                            color="primary"
                            disabled={loading.action || subscriber.status === 'Unsubscribed'}
                          >
                            <MailIcon />
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

        {/* Monthly Announcements */}
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card sx={{
              borderRadius: '16px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.1), rgba(43, 90, 158, 0.1))'
                : 'white',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              p: 3,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  color: isDarkMode ? '#fff' : '#19234d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <CampaignIcon /> Monthly Announcements
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    sx={{
                      color: isDarkMode ? '#fff' : '#19234d',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData.map(item => ({
                      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.month - 1],
                      count: item.count
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2A3A5A" : "#E2E8F0"} />
                    <XAxis 
                      dataKey="month" 
                      stroke={isDarkMode ? "#A0AEC0" : "#718096"}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#A0AEC0" : "#718096"}
                    />
                    <Tooltip
                      contentStyle={{
                        background: isDarkMode ? 'rgba(25, 35, 77, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: isDarkMode ? '#fff' : '#000'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill={isDarkMode ? '#d9764a' : '#2b5a9e'} 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </motion.div>
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
        <DialogTitle
          sx={{
            color: isDarkMode ? '#fff' : '#19234d',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '& .MuiTypography-root': {
              fontSize: '1.75rem',
              fontWeight: 600,
              background: isDarkMode
                ? 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)'
                : 'linear-gradient(135deg, #19234d 0%, #2b5a9e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
          }}
        >
          <CampaignIcon sx={{ 
            fontSize: '2rem',
            color: isDarkMode ? '#d9764a' : '#2b5a9e'
          }} />
          Create Newsletter
        </DialogTitle>

        <DialogContent sx={{ padding: '32px', background: 'transparent' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            position: 'relative',
            marginTop: '15px',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <StyledTextField
                label="Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isDarkMode={isDarkMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <StyledTextField
                label="Subject"
                fullWidth
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                isDarkMode={isDarkMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <StyledTextField
                label="Announcement Content"
                fullWidth
                required
                multiline
                rows={6}
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                isDarkMode={isDarkMode}
                placeholder="You can use HTML tags for formatting"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    fontFamily: 'monospace'
                  } 
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <StyledTextField
                  label="Button Text"
                  fullWidth
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  isDarkMode={isDarkMode}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <StyledTextField
                  label="Button URL"
                  fullWidth
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                  isDarkMode={isDarkMode}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AddIcon />}
                    sx={{
                      color: isDarkMode ? '#d9764a' : '#2b5a9e',
                      borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                      borderRadius: '12px',
                      padding: '10px 24px',
                      borderWidth: '2px',
                      '&:hover': {
                        borderWidth: '2px',
                        background: isDarkMode 
                          ? 'rgba(217, 118, 74, 0.1)'
                          : 'rgba(43, 90, 158, 0.1)',
                      }
                    }}
                  >
                    Add Images
                  </Button>
                </label>

                {imagePreviewUrls.length > 0 && (
                  <Box sx={{ 
                    mt: 2, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 2 
                  }}>
                    {imagePreviewUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: '#fff',
                              '&:hover': { 
                                bgcolor: 'error.dark',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </Box>
            </motion.div>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: '24px 32px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            gap: 2
          }}
        >
          <Button 
            onClick={handleCloseDialog} 
            disabled={sendingNewsletter}
            sx={{ 
              color: isDarkMode ? '#fff' : '#19234d',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={sendingNewsletter || !formData.title || !formData.subject || !formData.announcement}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
              borderRadius: '12px',
              padding: '10px 24px',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 6px 20px rgba(217, 118, 74, 0.4)'
                  : '0 6px 20px rgba(43, 90, 158, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {sendingNewsletter ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                Sending...
              </>
            ) : (
              'Send Newsletter'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Newsletter;
