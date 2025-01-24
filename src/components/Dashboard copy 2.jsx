import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Select,
  MenuItem,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Mail as MailIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  BarChart,
  Bar,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import baseUrl from '../api';
import { useTheme } from '../context/ThemeContext';

const YearSelector = ({ selectedYear, onChange, isDarkMode }) => (
  <Select
    value={selectedYear}
    onChange={(e) => onChange(e.target.value)}
    size="small"
    sx={{ 
      ml: 2,
      color: isDarkMode ? '#fff' : '#19234d',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
      },
      '& .MuiSvgIcon-root': {
        color: isDarkMode ? '#fff' : '#19234d',
      }
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: isDarkMode ? '#19234d' : '#fff',
          '& .MuiMenuItem-root': {
            color: isDarkMode ? '#fff' : '#19234d',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.15)' : 'rgba(43, 90, 158, 0.08)',
            },
            '&.Mui-selected': {
              bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.12)',
            },
          }
        }
      }
    }}
  >
    {[...Array(10)].map((_, i) => {
      const year = new Date().getFullYear() - i;
      return (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      );
    })}
  </Select>
);

const StatCard = ({ title, value, icon, color, isDarkMode, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: isDarkMode
        ? `linear-gradient(135deg, ${color}99 0%, ${color}66 100%)`
        : `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
      borderRadius: '24px',
      boxShadow: isDarkMode
        ? `0 8px 32px 0 rgba(0, 0, 0, 0.3),
           inset 0 0 32px 0 rgba(255, 255, 255, 0.05)`
        : `0 8px 32px 0 rgba(31, 38, 135, 0.15),
           inset 0 0 32px 0 rgba(255, 255, 255, 0.2)`,
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: isDarkMode
          ? `0 12px 48px 0 rgba(0, 0, 0, 0.4),
             inset 0 0 32px 0 rgba(255, 255, 255, 0.1)`
          : `0 12px 48px 0 rgba(31, 38, 135, 0.2),
             inset 0 0 32px 0 rgba(255, 255, 255, 0.3)`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: `linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        )`,
        transition: '0.5s',
        pointerEvents: 'none',
      },
      '&:hover::before': {
        left: '100%',
      }
    }}
  >
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start'
      }}>
        <Box>
          <Typography 
            color="white" 
            gutterBottom 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
          <Typography 
            color="white" 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '-1px'
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              color="white" 
              variant="body2" 
              sx={{ 
                mt: 1.5,
                opacity: 0.9,
                fontWeight: 500,
                backdropFilter: 'blur(4px)',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-block'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            height: 56,
            width: 56,
            borderRadius: '16px',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'rotate(15deg) scale(1.1)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {icon}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const DonutChart = ({ data, isDarkMode }) => {
  const COLORS = ['#4CAF50', '#FF5252'];
  
  const chartData = [
    { name: 'Active', value: data.active },
    { name: 'Inactive', value: data.inactive }
  ];

  return (
    <Paper sx={{ 
      p: 3, 
      height: '100%',
      borderRadius: '16px',
      background: isDarkMode 
        ? 'rgba(25, 35, 77, 0.8)'
        : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(4px)',
      boxShadow: isDarkMode
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#19234d', mb: 2 }}>
        Subscribers Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              background: isDarkMode ? 'rgba(25, 35, 77, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: isDarkMode ? '#fff' : '#000'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
        {chartData.map((entry, index) => (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index] }} />
            <Typography color={isDarkMode ? '#fff' : '#19234d'}>
              {entry.name}: {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const NewsletterChart = ({ data, isDarkMode, selectedYear, onYearChange }) => (
  <Paper sx={{ 
    p: 3, 
    height: '100%',
    borderRadius: '16px',
    background: isDarkMode 
      ? 'rgba(25, 35, 77, 0.8)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    boxShadow: isDarkMode
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#19234d' }}>
        Newsletters Sent
      </Typography>
      <YearSelector 
        selectedYear={selectedYear} 
        onChange={onYearChange} 
        isDarkMode={isDarkMode}
      />
    </Box>
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2A3A5A" : "#E2E8F0"} />
        <XAxis dataKey="name" stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
        <YAxis stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
        <Tooltip 
          contentStyle={{ 
            background: isDarkMode ? 'rgba(25, 35, 77, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: isDarkMode ? '#fff' : '#000'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="newsletters" 
          stroke="#38B2AC" 
          strokeWidth={2}
          dot={{ fill: "#38B2AC" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalSubscribers: {
      total: 0,
      active: 0,
      inactive: 0
    },
    totalBlogs: 0,
    totalNewsletters: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [newsletterData, setNewsletterData] = useState([]);
  const [subscriberData, setSubscriberData] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  
  // Separate year states for blogs and newsletters
  const [blogsYear, setBlogsYear] = useState(new Date().getFullYear());
  const [newslettersYear, setNewslettersYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fetch total counts
    const fetchCounts = async () => {
      try {
        const [blogsResponse, newslettersResponse, subscribersResponse] = await Promise.all([
          fetch(`${baseUrl}/api/blogs/counts`),
          fetch(`${baseUrl}/api/newsletters/counts/total`),
          fetch(`${baseUrl}/api/subscribers/count/total`)
        ]);
        
        const blogsData = await blogsResponse.json();
        const newslettersData = await newslettersResponse.json();
        const subscribersData = await subscribersResponse.json();
        
        setStats({
          totalSubscribers: {
            total: subscribersData.total,
            active: subscribersData.active,
            inactive: subscribersData.inactive
          },
          totalBlogs: blogsData.totalBlogs,
          totalNewsletters: newslettersData.totalCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    // Update fetch data to use both year states
    const fetchData = async () => {
      try {
        const [blogsResponse, newslettersResponse, subscribersResponse, recentResponse] = await Promise.all([
          fetch(`${baseUrl}/api/blogs/count/${blogsYear}`),
          fetch(`${baseUrl}/api/newsletters/counts/monthly/${newslettersYear}`),
          fetch(`${baseUrl}/api/subscribers/count/monthly`),
          fetch(`${baseUrl}/api/subscribers/recent`)
        ]);

        const [blogsData, newslettersData, subscribersData, recentData] = await Promise.all([
          blogsResponse.json(),
          newslettersResponse.json(),
          subscribersResponse.json(),
          recentResponse.json()
        ]);

        // Transform data for charts
        const transformedSubscriberData = subscribersData.map(item => ({
          name: new Date(2000, item.month - 1, 1).toLocaleString('default', { month: 'short' }),
          active: item.active,
          inactive: item.inactive,
          total: item.total
        }));
        setSubscriberData(transformedSubscriberData);

        // Transform recent subscribers data
        const transformedRecentData = recentData.map(subscriber => ({
          id: subscriber._id,
          user: subscriber.name,
          action: subscriber.status === 'Subscribed' ? 'Subscribed to newsletter' : 'Unsubscribed from newsletter',
          time: formatTimeAgo(new Date(subscriber.subscribedAt)),
          avatar: '👨‍💻',
        }));
        setRecentSubscribers(transformedRecentData);

        // Transform blogs data
        const transformedBlogsData = blogsData.map(item => ({
          name: new Date(2000, item.month - 1, 1).toLocaleString('default', { month: 'short' }),
          blogs: item.count,
        }));
        setMonthlyData(transformedBlogsData);

        // Transform newsletters data
        const transformedNewslettersData = newslettersData.map(item => ({
          name: new Date(2000, item.month - 1, 1).toLocaleString('default', { month: 'short' }),
          newsletters: item.count,
        }));
        setNewsletterData(transformedNewslettersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCounts();
    fetchData();
  }, [blogsYear, newslettersYear]); // Update dependency array to include both years

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  // Separate handlers for each year selector
  const handleBlogsYearChange = (newYear) => {
    setBlogsYear(newYear);
  };

  const handleNewslettersYearChange = (newYear) => {
    setNewslettersYear(newYear);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, sm: 2.5, md: 3 },
      background: isDarkMode 
        ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1,
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
        zIndex: -1,
      }
    }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Subscribers"
            value={stats.totalSubscribers.total.toLocaleString()}
            icon={<PeopleIcon sx={{ color: 'white', fontSize: 32 }} />}
            color="#4C51BF"
            isDarkMode={isDarkMode}
            subtitle={`${stats.totalSubscribers.active} Active • ${stats.totalSubscribers.inactive} Inactive`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Blogs"
            value={stats.totalBlogs.toLocaleString()}
            icon={<ArticleIcon sx={{ color: 'white', fontSize: 32 }} />}
            color="#2D3748"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Newsletters Sent"
            value={stats.totalNewsletters.toLocaleString()}
            icon={<MailIcon sx={{ color: 'white', fontSize: 32 }} />}
            color="#38B2AC"
            isDarkMode={isDarkMode}
          />
        </Grid>

        {/* Main Charts Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: '24px',
            background: isDarkMode 
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDarkMode
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 32px 0 rgba(255, 255, 255, 0.02)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 32px 0 rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#19234d' }}>
                Blogs Overview
              </Typography>
              <YearSelector 
                selectedYear={blogsYear} 
                onChange={handleBlogsYearChange}
                isDarkMode={isDarkMode}
              />
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDarkMode ? "#d9764a" : "#2D3748"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isDarkMode ? "#d9764a" : "#2D3748"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2A3A5A" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
                <YAxis stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
                <Tooltip 
                  contentStyle={{ 
                    background: isDarkMode ? 'rgba(25, 35, 77, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="blogs" 
                  stroke={isDarkMode ? "#d9764a" : "#2D3748"} 
                  fillOpacity={1} 
                  fill="url(#colorBlogs)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Subscribers Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: '24px',
            background: isDarkMode 
              ? 'rgba(25, 35, 77, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDarkMode
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 32px 0 rgba(255, 255, 255, 0.02)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 32px 0 rgba(255, 255, 255, 0.2)',
            '& .MuiListItem-root': {
              borderRadius: '16px',
              margin: '8px 0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(217, 118, 74, 0.15)'
                  : 'rgba(43, 90, 158, 0.08)',
                transform: 'translateX(8px) scale(1.02)',
              }
            },
            '& .MuiAvatar-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)'
              }
            }
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#19234d'
            }}>
              Recent Subscribers
            </Typography>
            <List>
              {recentSubscribers.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem 
                    sx={{
                      transition: 'all 0.3s ease',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(217, 118, 74, 0.15)'
                          : 'rgba(43, 90, 158, 0.08)',
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #d9764a 0%, #2b5a9e 100%)'
                          : 'linear-gradient(135deg, #4C51BF 0%, #38B2AC 100%)',
                        fontSize: '1.2rem'
                      }}>
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: isDarkMode ? '#fff' : '#19234d'
                        }}>
                          {activity.user}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography 
                            component="span" 
                            variant="body2" 
                            sx={{ 
                              color: isDarkMode ? '#A0AEC0' : '#4A5568'
                            }}
                          >
                            {activity.action}
                          </Typography>
                          <br />
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ 
                              color: isDarkMode ? '#718096' : '#718096'
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentSubscribers.length - 1 && 
                    <Divider 
                      variant="inset" 
                      component="li" 
                      sx={{ 
                        borderColor: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.08)'
                      }} 
                    />
                  }
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Bottom Charts Section */}
        <Grid item xs={12} md={4} mt={6}>
          <DonutChart data={stats.totalSubscribers} isDarkMode={isDarkMode} />
        </Grid>
        <Grid item xs={12} md={8} mt={6}>
          <NewsletterChart 
            data={newsletterData} 
            isDarkMode={isDarkMode} 
            selectedYear={newslettersYear}
            onYearChange={handleNewslettersYearChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
