import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Avatar,
    Chip,
    IconButton,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import CountUp from 'react-countup';
import styled from '@emotion/styled';

// Styled Components from Newsletter.jsx
const StyledMetricCard = styled(Paper)(({ theme, isDarkMode }) => ({
    padding: '24px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: isDarkMode
        ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.8) 0%, rgba(21, 27, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 247, 250, 0.9) 100%)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: isDarkMode
            ? '0 12px 30px rgba(217, 118, 74, 0.2)'
            : '0 12px 30px rgba(43, 90, 158, 0.2)',
    }
}));

const MetricIcon = styled(Box)(({ color }) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)`,
    color: 'white',
    transition: 'all 0.3s ease',
    '& svg': {
        fontSize: '24px'
    }
}));

const Subscribers = () => {
    const { isDarkMode } = useTheme();
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });
    const [subscribers, setSubscribers] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState('all');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse, subscribersResponse, monthlyResponse] = await Promise.all([
                    fetch(`${baseUrl}/api/subscribers/count/total`),
                    fetch(`${baseUrl}/api/subscribers`),
                    fetch(`${baseUrl}/api/subscribers/count/monthly/${selectedYear}`)
                ]);

                const statsData = await statsResponse.json();
                const subscribersData = await subscribersResponse.json();
                const monthlyData = await monthlyResponse.json();

                setStats({
                    total: statsData.total,
                    active: statsData.active,
                    inactive: statsData.inactive
                });
                setSubscribers(subscribersData);

                const transformedMonthlyData = monthlyData.map(item => ({
                    name: new Date(selectedYear, item.month - 1, 1).toLocaleString('default', { month: 'short' }),
                    active: item.active,
                    inactive: item.inactive,
                    total: item.total
                }));
                setMonthlyData(transformedMonthlyData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear]);

    // Filter subscribers
    const filteredSubscribers = subscribers.filter(sub => {
        if (filter === 'all') return true;
        if (filter === 'active') return sub.status === 'Subscribed';
        if (filter === 'inactive') return sub.status === 'Unsubscribed';
        return true;
    });

    return (
        <Box sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
            background: isDarkMode
                ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            <Grid container spacing={3}>
                {/* Metric Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MetricIcon color={isDarkMode ? ['#d9764a', '#de7527'] : ['#d9764a', '#de7527']}>
                                    <PeopleIcon sx={{ fontSize: '24px', color: '#fff' }} />
                                </MetricIcon>
                                <Box>
                                    <Typography variant="h3" sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600, mb: 0.5 }}>
                                        <CountUp end={stats.total} duration={2.5} separator="," />
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Total Subscribers
                                    </Typography>
                                </Box>
                            </Box>
                        </StyledMetricCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MetricIcon color={isDarkMode ? ['#4CAF50', '#45a049'] : ['#4CAF50', '#45a049']}>
                                    <PersonAddIcon  sx={{ fontSize: '24px', color: '#fff' }} />
                                </MetricIcon>
                                <Box>
                                    <Typography variant="h3" sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600, mb: 0.5 }}>
                                        <CountUp end={stats.active} duration={2.5} separator="," />
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Active Subscribers
                                    </Typography>
                                </Box>
                            </Box>
                        </StyledMetricCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MetricIcon color={isDarkMode ? ['#FF5252', '#ff4444'] : ['#FF5252', '#ff4444']}>
                                    <PersonOffIcon sx={{ fontSize: '24px', color: '#fff' }} />
                                </MetricIcon>
                                <Box>
                                    <Typography variant="h3" sx={{ color: isDarkMode ? '#fff' : '#19234d', fontWeight: 600, mb: 0.5 }}>
                                        <CountUp end={stats.inactive} duration={2.5} separator="," />
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Inactive Subscribers
                                    </Typography>
                                </Box>
                            </Box>
                        </StyledMetricCard>
                    </motion.div>
                </Grid>

                {/* Subscribers Graph */}
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: '20px',
                        background: isDarkMode
                            ? 'rgba(25, 35, 77, 0.8)'
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Typography variant="h5" sx={{
                                fontWeight: 600,
                                color: isDarkMode ? '#fff' : '#19234d',
                            }}>
                                Subscriber Growth
                            </Typography>

                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 120,
                                    '& .MuiOutlinedInput-root': {
                                        color: isDarkMode ? '#fff' : '#19234d',
                                        '& fieldset': {
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: isDarkMode ? '#a0aec0' : '#718096',
                                    },
                                }}
                            >
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    label="Year"
                                >
                                    {[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <MenuItem
                                                key={year}
                                                value={year}
                                                sx={{
                                                    //   color: isDarkMode ? '#fff' : '#19234d',
                                                    '&.Mui-selected': {
                                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                                    },
                                                    
                                                }}
                                            >
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Box>

                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF5252" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2A3A5A" : "#E2E8F0"} />
                                <XAxis dataKey="name" stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
                                <YAxis stroke={isDarkMode ? "#A0AEC0" : "#718096"} />
                                <Tooltip
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
                                    dataKey="active"
                                    stroke="#4CAF50"
                                    fillOpacity={1}
                                    fill="url(#activeGradient)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="inactive"
                                    stroke="#FF5252"
                                    fillOpacity={1}
                                    fill="url(#inactiveGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Subscribers Table */}
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{
                        borderRadius: '20px',
                        background: isDarkMode
                            ? 'rgba(25, 35, 77, 0.8)'
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(12px)',
                        overflow: 'hidden'
                    }}>
                        {loading && <LinearProgress />}

                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#19234d' }}>
                                Subscribers List
                            </Typography>

                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Filter</InputLabel>
                                <Select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    label="Filter"
                                    sx={{
                                        color: isDarkMode ? '#fff' : '#19234d',
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: isDarkMode ? '#fff' : '#19234d',
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{
                                        // color: isDarkMode ? '#fff' : '#19234d',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}>
                                        All Subscribers
                                    </MenuItem>
                                    <MenuItem value="active" sx={{
                                        // color: isDarkMode ? '#fff' : '#19234d',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}>
                                        Active Subscribers
                                    </MenuItem>
                                    <MenuItem value="inactive" sx={{
                                        // color: isDarkMode ? '#fff' : '#19234d',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}>
                                        Inactive Subscribers
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>S.No</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Name</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Email</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Status</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Joined Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubscribers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((subscriber, index) => (
                                        <TableRow key={subscriber._id}>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {subscriber.name.charAt(0).toUpperCase() + subscriber.name.slice(1)}
                                            </TableCell>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {subscriber.email}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={subscriber.status}
                                                    color={subscriber.status === 'Subscribed' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {new Date(subscriber.subscribedAt).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
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
        </Box>
    );
};

export default Subscribers;

