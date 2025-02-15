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
    TextField,
    InputAdornment,
    CircularProgress,
    LinearProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    PersonAdd as PersonAddIcon,
    PersonOff as PersonOffIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

// Styled Components
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

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            '& .search-icon': {
                transform: 'scale(1.1)',
            }
        },
        '&.Mui-focused': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            '& .search-icon': {
                color: isDarkMode ? '#d9764a' : '#2b5a9e',
            }
        },
        '& fieldset': {
            borderColor: 'transparent',
            '&:hover': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }
        },
    },
    '& .MuiInputBase-input': {
        padding: '12px 16px',
        color: isDarkMode ? '#fff' : '#19234d',
        fontSize: '1rem',
        '&::placeholder': {
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            opacity: 1
        }
    }
}));

const Teams = () => {
    const { isDarkMode } = useTheme();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTeams(data);

            // Calculate stats based on user roles
            const adminCount = data.filter(member => member.role === 'Admin').length;
            const authorCount = data.filter(member => member.role === 'Author').length;
            const otherCount = data.filter(member => member.role !== 'Admin' && member.role !== 'Author').length;

            setStats({
                total: data.length,
                active: adminCount + authorCount, // Admin and Author are considered active
                inactive: otherCount // All other roles are considered inactive
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const isAdmin = localStorage.getItem('role') === 'Admin';
        if (!isAdmin) return;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
            cancelButtonColor: isDarkMode ? '#ff5252' : '#dc3545',
            confirmButtonText: 'Yes, delete it!',
            background: isDarkMode ? '#19234d' : '#fff',
            color: isDarkMode ? '#fff' : '#19234d'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Show success message
                    Swal.fire({
                        title: 'Deleted!',
                        text: data.message || 'User has been deleted.',
                        icon: 'success',
                        confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                        background: isDarkMode ? '#19234d' : '#fff',
                        color: isDarkMode ? '#fff' : '#19234d'
                    });

                    // Update the teams list and stats
                    setTeams(teams.filter(member => member._id !== userId));
                    setStats(prev => ({
                        total: prev.total - 1,
                        active: teams.find(member => member._id === userId)?.role === 'Author' 
                            ? prev.active - 1
                            : prev.active,
                        inactive: teams.find(member => member._id === userId)?.role !== 'Author' 
                            ? prev.inactive - 1
                            : prev.inactive
                    }));
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                toast.error('Failed to delete user');
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredTeams = teams.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
            zIndex: 1
        }}>
            <Grid container spacing={3}>
                {/* Header */}
                <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{
                        color: isDarkMode ? '#fff' : '#19234d',
                        fontWeight: 600
                    }}>
                        Team Management
                    </Typography>
                </Grid>

                {/* Metrics Section */}
                <Grid container spacing={3} sx={{ my: 2, px: 3 }}>
                    <Grid item xs={12} md={4}>
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <BackgroundGlow color={isDarkMode ? '#d9764a' : '#2b5a9e'} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ color: isDarkMode ? '#fff' : '#19234d', mb: 1 }}>
                                        <CountUp end={stats.total} duration={2} />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Total Users
                                    </Typography>
                                </Box>
                                <MetricIcon className="metric-icon" color={isDarkMode ? ['#d9764a', '#de7527'] : ['#2b5a9e', '#19234d']}>
                                    <GroupIcon />
                                </MetricIcon>
                            </Box>
                        </StyledMetricCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <BackgroundGlow color={isDarkMode ? '#4CAF50' : '#2E7D32'} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ color: isDarkMode ? '#fff' : '#19234d', mb: 1 }}>
                                        <CountUp end={stats.active} duration={2} />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Active Users (Admin & Author)
                                    </Typography>
                                </Box>
                                <MetricIcon className="metric-icon" color={['#4CAF50', '#2E7D32']}>
                                    <PersonAddIcon />
                                </MetricIcon>
                            </Box>
                        </StyledMetricCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StyledMetricCard isDarkMode={isDarkMode}>
                            <BackgroundGlow color={isDarkMode ? '#f44336' : '#d32f2f'} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ color: isDarkMode ? '#fff' : '#19234d', mb: 1 }}>
                                        <CountUp end={stats.inactive} duration={2} />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}>
                                        Other Users
                                    </Typography>
                                </Box>
                                <MetricIcon className="metric-icon" color={['#f44336', '#d32f2f']}>
                                    <PersonOffIcon />
                                </MetricIcon>
                            </Box>
                        </StyledMetricCard>
                    </Grid>
                </Grid>

                {/* Table Section */}
                <Grid item xs={12} sx={{ mt: 5 }}>
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
                    }}>
                        {loading && (
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

                        <Box sx={{ p: 2 }}>
                            <StyledTextField
                                fullWidth
                                placeholder="Search team members..."
                                value={searchTerm}
                                variant="outlined"
                                isDarkMode={isDarkMode}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon 
                                                className="search-icon"
                                                sx={{ 
                                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>S.No</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Member</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Email</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Role</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Joined Date</TableCell>
                                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTeams
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((member, index) => (
                                        <TableRow
                                            key={member._id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: isDarkMode
                                                        ? 'rgba(255,255,255,0.05)'
                                                        : 'rgba(0,0,0,0.02)',
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={member.profileImage || ''}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Typography sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                        {member.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {member.email}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={member.role}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                                {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                {localStorage.getItem('role') === 'Admin' && (
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            onClick={() => handleDeleteUser(member._id)}
                                                            sx={{
                                                                color: isDarkMode ? '#ff5252' : '#dc3545',
                                                                '&:hover': {
                                                                    backgroundColor: isDarkMode 
                                                                        ? 'rgba(255, 82, 82, 0.1)'
                                                                        : 'rgba(220, 53, 69, 0.1)',
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={filteredTeams.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                color: isDarkMode ? '#fff' : '#19234d',
                                '.MuiTablePagination-select': {
                                    color: isDarkMode ? '#fff' : '#19234d'
                                }
                            }}
                        />
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Teams;
