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
  MenuItem,
  FormControl,
  InputAdornment,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  Group as GroupIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Campaign as CampaignIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import CountUp from 'react-countup';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';


// Reusing styled components from Blogs.jsx
const CreateButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
    : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
  borderRadius: '20px',
  padding: '10px 12px',
  color: '#fff',
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
  }
}));

const StyledMetricCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '28px',
  borderRadius: '24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.8) 0%, rgba(21, 27, 59, 0.8) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 247, 250, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: isDarkMode
      ? '0 12px 30px rgba(0,0,0,0.4)'
      : '0 12px 30px rgba(43, 90, 158, 0.2)',
    '& .metric-icon': {
      transform: 'scale(1.1) rotate(5deg)',
    },
    '& .background-glow': {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1.2)',
    }
  }
}));

const MetricIcon = styled(Avatar)(({ theme, color }) => ({
  width: 64,
  height: 64,
  background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
  boxShadow: `0 8px 20px ${color[0]}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& svg': {
    fontSize: '2rem',
    transition: 'transform 0.3s ease',
  }
}));

const BackgroundGlow = styled('div')(({ color }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '120%',
  height: '120%',
  background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
  transform: 'translate(-50%, -50%) scale(0.8)',
  opacity: 0.5,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  pointerEvents: 'none',
}));

// Add YearSelector component
const YearSelector = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
    },
  },
  '& .MuiSelect-select': {
    color: isDarkMode ? '#fff' : '#19234d',
  },
}));

const Newsletter = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    cancelled: 0,
    subscribers: 0
  });
  const [newsletters, setNewsletters] = useState([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelledNewsletters, setCancelledNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newsletterType, setNewsletterType] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    subject: '',
    announcement: '',
    buttonText: '',
    buttonUrl: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [sending, setSending] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchBlogTerm, setSearchBlogTerm] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogForm, setBlogForm] = useState({
    subject: '',
    additionalContent: '',
    scheduledFor: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }).slice(0, 16)
  });

  // Fetch data implementation...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalRes, scheduledRes, cancelledRes] = await Promise.all([
          fetch(`${baseUrl}/api/newsletters/counts/total`),
          fetch(`${baseUrl}/api/newsletters/scheduled/count`),
          fetch(`${baseUrl}/api/newsletters/cancelled/count`)
        ]);

        const [totalData, scheduledData, cancelledData] = await Promise.all([
          totalRes.json(),
          scheduledRes.json(),
          cancelledRes.json()
        ]);

        setStats({
          total: totalData.totalCount,
          scheduled: scheduledData.scheduledCount,
          cancelled: cancelledData.cancelledCount,
          subscribers: newsletters.length
        });
      } catch (error) {
        console.error('Error fetching newsletter stats:', error);
        toast.error('Failed to fetch newsletter statistics');
      }
    };

    fetchData();
  }, [newsletters]);

  // Add this useEffect for fetching monthly data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/newsletters/counts/monthly/${selectedYear}`);
        const data = await response.json();
        setMonthlyData(data);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
        toast.error('Failed to fetch monthly statistics');
      }
    };

    fetchMonthlyData();
  }, [selectedYear]);

  // Add this useEffect for fetching newsletters
  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/newsletters`);
      const data = await response.json();
      // Sort by createdAt in descending order (latest first)
      const sortedData = data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNewsletters(sortedData);
      setFilteredNewsletters(sortedData);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to fetch newsletters');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchNewsletters();
  }, []);

  // Add this useEffect for fetching cancelled newsletters
  useEffect(() => {
    const fetchCancelledNewsletters = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/newsletters/cancelled`);
        const { data } = await response.json();
        setCancelledNewsletters(data);
      } catch (error) {
        console.error('Error fetching cancelled newsletters:', error);
        toast.error('Failed to fetch cancelled newsletters');
      }
    };

    if (statusFilter === 'Cancelled') {
      fetchCancelledNewsletters();
    }
  }, [statusFilter]);

  // Update the filter function
  useEffect(() => {
    let filtered = [];

    if (statusFilter === 'Cancelled') {
      filtered = cancelledNewsletters;
    } else {
      filtered = newsletters.filter(newsletter => {
        const matchesSearch = newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          newsletter.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }

    setFilteredNewsletters(filtered);
    setPage(0);
  }, [searchQuery, statusFilter, newsletters, cancelledNewsletters]);

  // Add these handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add years array for selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Add this function to handle newsletter cancellation
  const handleCancelNewsletter = async (newsletterId) => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Newsletter?',
        text: 'Are you sure you want to cancel this scheduled newsletter? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it',
        background: isDarkMode ? '#1a2035' : '#fff',
        color: isDarkMode ? '#fff' : '#19234d',
      });

      if (result.isConfirmed) {
        const response = await fetch(`${baseUrl}/api/newsletters/cancel/${newsletterId}`, {
          method: 'POST',
        });

        const data = await response.json();

        if (response.ok) {
          // Update the local state to reflect the change
          setNewsletters(newsletters.map(newsletter =>
            newsletter._id === newsletterId
              ? { ...newsletter, status: 'Draft' }
              : newsletter
          ));

          toast.success('Newsletter cancelled successfully');
          Swal.fire({
            title: 'Cancelled!',
            text: 'The newsletter has been cancelled.',
            icon: 'success',
            background: isDarkMode ? '#1a2035' : '#fff',
            color: isDarkMode ? '#fff' : '#19234d',
          });
        } else {
          throw new Error(data.message || 'Failed to cancel newsletter');
        }
      }
    } catch (error) {
      console.error('Error cancelling newsletter:', error);
      toast.error(error.message || 'Failed to cancel newsletter');
    }
  };

  // Add this function to handle newsletter view
  const handleViewNewsletter = async (newsletterId) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/newsletters/${newsletterId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedNewsletter(data);
        setViewDialogOpen(true);
      } else {
        throw new Error(data.message || 'Failed to fetch newsletter details');
      }
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      toast.error(error.message || 'Failed to fetch newsletter details');
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Add this function to handle announcement submission
  const handleAnnouncementSubmit = async () => {
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('title', announcementForm.title);
      formData.append('subject', announcementForm.subject);
      formData.append('announcement', announcementForm.announcement);
      formData.append('buttonText', announcementForm.buttonText);
      formData.append('buttonUrl', announcementForm.buttonUrl);

      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${baseUrl}/api/newsletters/send-announcement`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Announcement sent successfully!');
        setOpenDialog(false);
        // Reset form
        setAnnouncementForm({
          title: '',
          subject: '',
          announcement: '',
          buttonText: '',
          buttonUrl: '',
          images: []
        });
        setImageFiles([]);
        setImagePreviewUrls([]);
        setNewsletterType('');

        // Refresh newsletters list
        fetchNewsletters();
      } else {
        throw new Error(data.message || 'Failed to send announcement');
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      toast.error(error.message || 'Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  // Add this function to fetch blogs
  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await fetch(`${baseUrl}/api/blogs`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Add this function to handle blog newsletter submission
  const handleBlogNewsletterSubmit = async () => {
    if (selectedBlogs.length === 0) {
      toast.error('Please select at least one blog');
      return;
    }

    setSending(true);
    try {
      // Convert the scheduled time and add 5:30 hours
      const scheduledDate = new Date(blogForm.scheduledFor);
      scheduledDate.setHours(scheduledDate.getHours() + 5);
      scheduledDate.setMinutes(scheduledDate.getMinutes() + 30);

      const response = await fetch(`${baseUrl}/api/newsletters/schedule-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogIds: selectedBlogs,
          scheduledFor: scheduledDate.toISOString(),
          subject: blogForm.subject,
          additionalContent: blogForm.additionalContent
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Blog newsletter scheduled successfully');
        handleCloseDialog();
        // Refresh newsletters list
        // const updatedNewsletters = await fetch(`${baseUrl}/api/newsletters`).then(res => res.json());
        fetchNewsletters();
      } else {
        throw new Error(data.message || 'Failed to schedule newsletter');
      }
    } catch (error) {
      console.error('Error scheduling blog newsletter:', error);
      toast.error(error.message || 'Failed to schedule newsletter');
    } finally {
      setSending(false);
    }
  };

  // Add useEffect to fetch blogs when dialog opens
  useEffect(() => {
    if (openDialog && newsletterType === 'blog') {
      fetchBlogs();
    }
  }, [openDialog, newsletterType]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewsletterType('');
    setAnnouncementForm({
      title: '',
      subject: '',
      announcement: '',
      buttonText: '',
      buttonUrl: '',
      images: []
    });
    setImageFiles([]);
    setImagePreviewUrls([]);
    setSelectedBlogs([]);
    setBlogForm({
      subject: '',
      additionalContent: '',
      scheduledFor: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }).slice(0, 16)
    });
    setSearchBlogTerm('');
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'metadata',
      headerName: 'Scheduled For',
      flex: 1,
      renderCell: (params) => {
        if (params.row.metadata?.scheduledFor) {
          const scheduledDate = new Date(params.row.metadata.scheduledFor);
          return (
            <Typography variant="body2">
              {scheduledDate.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Typography>
          );
        }
        return '-';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Scheduled' ? 'primary' :
            params.value === 'Sent' ? 'success' :
            params.value === 'Failed' ? 'error' :
            'default'
          }
          size="small"
        />
      )
    },
    {
      field: 'recipients',
      headerName: 'Recipients',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={`Success: ${params.row.recipients.successful}, Failed: ${params.row.recipients.failed}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon sx={{ fontSize: '1rem' }} />
            {params.row.recipients.total}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {params.row.status === 'Scheduled' && (
            <Tooltip title="Cancel Newsletter">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleCancelNewsletter(params.row._id)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewNewsletter(params.row._id)}
              sx={{
                color: isDarkMode ? '#90caf9' : '#1976d2',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  return (
    <Box sx={{
      p: 3,
      background: isDarkMode
        ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Grid container spacing={3}>
        {/* Header with Create Button */}
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{
            color: isDarkMode ? '#fff' : '#19234d',
            fontWeight: 600
          }}>
            Newsletter Management
          </Typography>

        </Grid>

        {/* Metric Cards Row */}
        <Grid container spacing={3} sx={{ mt: 2, px: 3 }}>
          {/* Total Newsletters Card */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StyledMetricCard isDarkMode={isDarkMode}>
                <BackgroundGlow color={isDarkMode ? '#d9764a' : '#2b5a9e'} className="background-glow" />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MetricIcon
                      className="metric-icon"
                      color={isDarkMode ? ['#d9764a', '#de7527'] : ['#2b5a9e', '#19234d']}
                    >
                      <MailIcon />
                    </MetricIcon>
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: isDarkMode ? '#fff' : '#19234d',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        <CountUp end={stats.total} duration={2.5} separator="," />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? '#a0aec0' : '#718096',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <MailIcon sx={{ fontSize: '1rem' }} />
                        Total Newsletters
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </StyledMetricCard>
            </motion.div>
          </Grid>

          {/* Scheduled Newsletters Card */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <StyledMetricCard isDarkMode={isDarkMode}>
                <BackgroundGlow color={isDarkMode ? '#4CAF50' : '#2E7D32'} className="background-glow" />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MetricIcon
                      className="metric-icon"
                      color={isDarkMode ? ['#4CAF50', '#388E3C'] : ['#2E7D32', '#1B5E20']}
                    >
                      <ScheduleIcon />
                    </MetricIcon>
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: isDarkMode ? '#fff' : '#19234d',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        <CountUp end={stats.scheduled} duration={2.5} separator="," />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? '#a0aec0' : '#718096',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <ScheduleIcon sx={{ fontSize: '1rem' }} />
                        Scheduled
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </StyledMetricCard>
            </motion.div>
          </Grid>

          {/* Cancelled Newsletters Card */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <StyledMetricCard isDarkMode={isDarkMode}>
                <BackgroundGlow color={isDarkMode ? '#f44336' : '#c62828'} className="background-glow" />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MetricIcon
                      className="metric-icon"
                      color={isDarkMode ? ['#f44336', '#d32f2f'] : ['#c62828', '#b71c1c']}
                    >
                      <BlockIcon />
                    </MetricIcon>
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: isDarkMode ? '#fff' : '#19234d',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        <CountUp end={stats.cancelled} duration={2.5} separator="," />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? '#a0aec0' : '#718096',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <BlockIcon sx={{ fontSize: '1rem' }} />
                        Cancelled
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </StyledMetricCard>
            </motion.div>
          </Grid>


        </Grid>

        {/* Newsletter Activity Chart */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            borderRadius: '20px',
            background: isDarkMode
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                Newsletter Activity
              </Typography>
              <YearSelector
                select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ width: 120 }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </YearSelector>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={monthlyData.map(item => ({
                month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.month - 1],
                count: item.count
              }))}>
                <defs>
                  <linearGradient id="newsletterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isDarkMode ? "#d9764a" : "#2b5a9e"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={isDarkMode ? "#d9764a" : "#2b5a9e"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2A3A5A" : "#E2E8F0"} />
                <XAxis
                  dataKey="month"
                  stroke={isDarkMode ? "#A0AEC0" : "#718096"}
                  tick={{ fill: isDarkMode ? "#A0AEC0" : "#718096" }}
                />
                <YAxis
                  stroke={isDarkMode ? "#A0AEC0" : "#718096"}
                  tick={{ fill: isDarkMode ? "#A0AEC0" : "#718096" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: isDarkMode ? 'rgba(25, 35, 77, 0.9)' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: isDarkMode ? '#fff' : '#19234d'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={isDarkMode ? "#d9764a" : "#2b5a9e"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#newsletterGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Newsletters Table */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            borderRadius: '20px',
            background: isDarkMode
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search newsletters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  minWidth: '200px',
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#fff' : 'inherit',
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    borderRadius: '12px',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    color: isDarkMode ? '#fff' : 'inherit',
                    borderRadius: '12px',
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Sent">Sent</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <CreateButton
                isDarkMode={isDarkMode}
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Create Newsletter
              </CreateButton>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600 }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600 }}>
                      Recipients
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600 }}>
                      Created At
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : (rowsPerPage > 0
                    ? filteredNewsletters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredNewsletters
                  ).map((newsletter) => (
                    <TableRow key={newsletter._id} hover>
                      <TableCell sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {newsletter.title}
                        </Typography>
                        {newsletter.metadata?.description && (
                          <Typography variant="caption" color="textSecondary" display="block" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }} noWrap>
                            {newsletter.metadata.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={newsletter.status}
                          size="small"
                          sx={{
                            bgcolor: (() => {
                              switch (newsletter.status) {
                                case 'Sent': return isDarkMode ? '#4caf5033' : '#4caf5022';
                                case 'Draft': return isDarkMode ? '#64748b33' : '#64748b22';
                                case 'Scheduled': return isDarkMode ? '#2196f333' : '#2196f322';
                                case 'Cancelled': return isDarkMode ? '#f4433633' : '#f4433622';
                                default: return 'transparent';
                              }
                            })(),
                            color: (() => {
                              switch (newsletter.status) {
                                case 'Sent': return '#4caf50';
                                case 'Draft': return '#64748b';
                                case 'Scheduled': return '#2196f3';
                                case 'Cancelled': return '#f44336';
                                default: return 'inherit';
                              }
                            })(),
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                        <Tooltip title={`Success: ${newsletter.recipients.successful}, Failed: ${newsletter.recipients.failed}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon sx={{ fontSize: '1rem' }} />
                            {newsletter.recipients.total}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {newsletter.status === 'Scheduled' && (
                            <Tooltip title="Cancel Newsletter">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleCancelNewsletter(newsletter._id)}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewNewsletter(newsletter._id)}
                              sx={{
                                color: isDarkMode ? '#90caf9' : '#1976d2',
                                '&:hover': {
                                  backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredNewsletters.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: isDarkMode ? '#fff' : 'inherit',
                '.MuiTablePagination-select': {
                  color: isDarkMode ? '#fff' : 'inherit',
                },
                '.MuiTablePagination-displayedRows': {
                  color: isDarkMode ? '#fff' : 'inherit',
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Newsletter View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? '#1a2035' : '#fff',
            color: isDarkMode ? '#fff' : 'inherit',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: 1,
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Newsletter Details
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{ color: isDarkMode ? '#fff' : 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedNewsletter ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedNewsletter.title}
                </Typography>
                <Chip
                  label={selectedNewsletter.status}
                  size="small"
                  sx={{
                    bgcolor: (() => {
                      switch (selectedNewsletter.status) {
                        case 'Sent': return isDarkMode ? '#4caf5033' : '#4caf5022';
                        case 'Draft': return isDarkMode ? '#64748b33' : '#64748b22';
                        case 'Scheduled': return isDarkMode ? '#2196f333' : '#2196f322';
                        case 'Cancelled': return isDarkMode ? '#f4433633' : '#f4433622';
                        default: return 'transparent';
                      }
                    })(),
                    color: (() => {
                      switch (selectedNewsletter.status) {
                        case 'Sent': return '#4caf50';
                        case 'Draft': return '#64748b';
                        case 'Scheduled': return '#2196f3';
                        case 'Cancelled': return '#f44336';
                        default: return 'inherit';
                      }
                    })(),
                    mb: 2
                  }}
                />
              </Grid>
              {selectedNewsletter.metadata?.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }} gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                    {selectedNewsletter.metadata.description}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }} gutterBottom>
                  Content
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }} gutterBottom>
                  Recipients
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Total</Typography>
                    <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>{selectedNewsletter.recipients.total}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Successful</Typography>
                    <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                      {selectedNewsletter.recipients.successful}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Failed</Typography>
                    <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                      {selectedNewsletter.recipients.failed}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }} gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                  {new Date(selectedNewsletter.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>Newsletter not found</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Newsletter Creation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? 'rgba(25, 35, 77, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: 1,
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          color: isDarkMode ? '#fff' : 'inherit',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Create Newsletter
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ color: isDarkMode ? '#fff' : 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!newsletterType ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                Select Newsletter Type
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    onClick={() => setNewsletterType('announcement')}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      color: isDarkMode ? '#fff' : 'inherit',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : 4
                      }
                    }}
                  >
                    <CampaignIcon sx={{ fontSize: 40, mb: 1, color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                    <Typography variant="h6">Announcement</Typography>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : 'text.secondary' }}>
                      Send important announcements to subscribers
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    onClick={() => setNewsletterType('blog')}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      color: isDarkMode ? '#fff' : 'inherit',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : 4
                      }
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 40, mb: 1, color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                    <Typography variant="h6">Blog Newsletter</Typography>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : 'text.secondary' }}>
                      Create newsletter from blog posts
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : newsletterType === 'announcement' ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3} sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    required
                    sx={{
                      color: isDarkMode ? '#fff' : 'inherit',
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                        borderRadius: '12px',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={announcementForm.subject}
                    onChange={(e) => setAnnouncementForm(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))}
                    required
                    sx={{
                      color: isDarkMode ? '#fff' : 'inherit',
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                        borderRadius: '12px',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Announcement Content"
                    multiline
                    rows={4}
                    value={announcementForm.announcement}
                    onChange={(e) => setAnnouncementForm(prev => ({
                      ...prev,
                      announcement: e.target.value
                    }))}
                    required
                    sx={{
                      color: isDarkMode ? '#fff' : 'inherit',
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                        borderRadius: '12px',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Button Text"
                    value={announcementForm.buttonText}
                    onChange={(e) => setAnnouncementForm(prev => ({
                      ...prev,
                      buttonText: e.target.value
                    }))}
                    sx={{
                      color: isDarkMode ? '#fff' : 'inherit',
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                        borderRadius: '12px',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Button URL"
                    value={announcementForm.buttonUrl}
                    onChange={(e) => setAnnouncementForm(prev => ({
                      ...prev,
                      buttonUrl: e.target.value
                    }))}
                    sx={{
                      color: isDarkMode ? '#fff' : 'inherit',
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                        borderRadius: '12px',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                      startIcon={<ImageIcon />}
                    >
                      Upload Images
                    </Button>
                  </label>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {imagePreviewUrls.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'background.paper'
                          }}
                          onClick={() => {
                            setImageFiles(prev => prev.filter((_, i) => i !== index));
                            setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3} sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Search Blogs"
                    value={searchBlogTerm}
                    onChange={(e) => setSearchBlogTerm(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      }
                    }}
                  />
                  <FormGroup>
                    {blogs
                      .filter(blog => 
                        blog.title.toLowerCase().includes(searchBlogTerm.toLowerCase())
                      )
                      .map(blog => (
                        <FormControlLabel
                          key={blog._id}
                          control={
                            <Checkbox
                              checked={selectedBlogs.includes(blog._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBlogs([...selectedBlogs, blog._id]);
                                } else {
                                  setSelectedBlogs(selectedBlogs.filter(id => id !== blog._id));
                                }
                              }}
                              sx={{
                                color: isDarkMode ? '#d9764a' : '#2b5a9e',
                                '&.Mui-checked': {
                                  color: isDarkMode ? '#d9764a' : '#2b5a9e',
                                }
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                                {blog.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDarkMode ? '#a0aec0' : 'text.secondary' }}>
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={blogForm.subject}
                    onChange={(e) => setBlogForm({ ...blogForm, subject: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Content"
                    multiline
                    rows={4}
                    value={blogForm.additionalContent}
                    onChange={(e) => setBlogForm({ ...blogForm, additionalContent: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Schedule For"
                    value={blogForm.scheduledFor}
                    onChange={(e) => setBlogForm({ ...blogForm, scheduledFor: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#fff' : 'inherit',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: isDarkMode ? '#fff' : 'inherit',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            Cancel
          </Button>
          {newsletterType === 'blog' && (
            <LoadingButton
              variant="contained"
              onClick={handleBlogNewsletterSubmit}
              loading={sending}
              disabled={!blogForm.subject || selectedBlogs.length === 0}
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                  : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #de7527 0%, #d9764a 100%)'
                    : 'linear-gradient(135deg, #19234d 0%, #2b5a9e 100%)',
                }
              }}
            >
              Schedule Newsletter
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Newsletter;
