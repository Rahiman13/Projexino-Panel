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
} from 'recharts';
import baseUrl from '../api';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon, color, isDarkMode, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: isDarkMode
        ? `linear-gradient(135deg, ${color}99 0%, ${color}66 100%)`
        : `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
      borderRadius: '16px',
      boxShadow: isDarkMode
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      backdropFilter: 'blur(4px)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="white" gutterBottom variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography color="white" variant="h3" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              color="white" 
              variant="body2" 
              sx={{ 
                mt: 1, 
                opacity: 0.8,
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            height: 56,
            width: 56,
            backdropFilter: 'blur(4px)',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'rotate(15deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {icon}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

    // Fetch monthly data and recent subscribers
    const fetchData = async () => {
      try {
        const [blogsResponse, newslettersResponse, subscribersResponse, recentResponse] = await Promise.all([
          fetch(`${baseUrl}/api/blogs/count/${selectedYear}`),
          fetch(`${baseUrl}/api/newsletters/counts/monthly/${selectedYear}`),
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
  }, [selectedYear]);

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

  // Add year selector component
  const YearSelector = () => (
    <Select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
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

  // Add Subscribers Chart component
  const SubscribersChart = () => (
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
        Subscribers Overview
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={subscriberData}>
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
            dataKey="active" 
            stroke="#4CAF50" 
            strokeWidth={2}
            dot={{ fill: "#4CAF50" }}
          />
          <Line 
            type="monotone" 
            dataKey="inactive" 
            stroke="#FF5252" 
            strokeWidth={2}
            dot={{ fill: "#FF5252" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, sm: 2.5, md: 3 },
      background: isDarkMode 
        ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1
    }}>
      <Grid container spacing={2}>
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

        {/* Charts */}
        <Grid item xs={12} md={8}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#19234d' }}>
                Blogs Overview
              </Typography>
              <YearSelector />
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

        

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
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


        {/* Newsletter Chart */}
        <Grid item xs={12} md={12} lg={12} mt={6}>
          <SubscribersChart />
          
        </Grid>

        {/* Recent Activities with Subscribers */}
        {/* <Grid item xs={12} md={4}>
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
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#19234d'
            }}>
              Recent Subscribers
            </Typography>
            <List>
              {recentSubscribers.map((subscriber, index) => (
                <Box key={subscriber.id}>
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
                        background: subscriber.status === 'Subscribed'
                          ? (isDarkMode ? '#4CAF5066' : '#4CAF50')
                          : (isDarkMode ? '#FF525266' : '#FF5252'),
                      }}>
                        {subscriber.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: isDarkMode ? '#fff' : '#19234d'
                        }}>
                          {subscriber.user}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ 
                            color: subscriber.status === 'Subscribed'
                              ? (isDarkMode ? '#4CAF5099' : '#4CAF50')
                              : (isDarkMode ? '#FF525299' : '#FF5252')
                          }}>
                            {subscriber.action}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" sx={{ 
                            color: isDarkMode ? '#718096' : '#718096'
                          }}>
                            {subscriber.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentSubscribers.length - 1 && 
                    <Divider variant="inset" component="li" sx={{ 
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.08)'
                    }} />
                  }
                </Box>
              ))}
            </List>
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default Dashboard;
