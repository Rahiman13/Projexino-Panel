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


// Reusing styled components from Blogs.jsx
const CreateButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
    : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
  borderRadius: '20px',
  padding: '10px 24px',
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
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  // Add years array for selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
          <CreateButton
            isDarkMode={isDarkMode}
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Newsletter
          </CreateButton>
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
          <TableContainer component={Paper} sx={{ 
            borderRadius: '20px',
            background: isDarkMode 
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Table implementation */}
          </TableContainer>
        </Grid>
      </Grid>

      {/* Create Newsletter Dialog */}
      {/* Dialog implementation */}
    </Box>
  );
};

export default Newsletter;
