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
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
    Avatar,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    RemoveRedEye as EyeIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Styled Components
const StyledMetricCard = styled(Paper)(({ theme, isDarkMode }) => ({
    padding: '24px',
    height: 'auto',
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

const Contacts = () => {
    const { isDarkMode } = useTheme();
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        seen: 0,
        unseen: 0
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/contacts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setContacts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to fetch contacts');
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/contacts/counts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching contact stats:', error);
            toast.error('Failed to fetch contact statistics');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    const handleMarkAsSeen = async (contactId) => {
        try {
            const response = await fetch(`${baseUrl}/api/contacts/${contactId}/seen`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const updatedContact = await response.json();

            // Update the contacts list with the updated contact
            setContacts(contacts.map(contact =>
                contact._id === contactId ? updatedContact : contact
            ));

            // Update stats
            setStats(prev => ({
                ...prev,
                seen: prev.seen + 1,
                unseen: prev.unseen - 1
            }));

            toast.success('Contact marked as seen');
        } catch (error) {
            console.error('Error marking contact as seen:', error);
            toast.error('Failed to mark contact as seen');
        }
    };

    return (
        <Box sx={{ p: 3, minHeight: '100vh' }}>
            <Grid container spacing={3}>
                {/* Metrics */}
                <Grid item xs={12} my={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <StyledMetricCard isDarkMode={isDarkMode}>
                                <BackgroundGlow color={isDarkMode ? '#2196f3' : '#1976d2'} />
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                                        <MetricIcon color={['#2196f3', '#1976d2']}>
                                            <EmailIcon />
                                        </MetricIcon>
                                        <Box sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                                                <CountUp end={stats.total} duration={2} />
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.7 }}>
                                                Total Contacts
                                            </Typography>
                                        </Box>

                                    </Box>
                                </Box>
                            </StyledMetricCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <StyledMetricCard isDarkMode={isDarkMode}>
                                <BackgroundGlow color={isDarkMode ? '#4caf50' : '#388e3c'} />
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                                        <MetricIcon color={['#4caf50', '#388e3c']}>
                                            <VisibilityIcon />
                                        </MetricIcon>
                                        <Box sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                                                <CountUp end={stats.seen} duration={2} />
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.7 }}>
                                                Seen Messages
                                            </Typography>
                                        </Box>

                                    </Box>
                                </Box>
                            </StyledMetricCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <StyledMetricCard isDarkMode={isDarkMode}>
                                <BackgroundGlow color={isDarkMode ? '#f44336' : '#d32f2f'} />
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                                        <MetricIcon color={['#f44336', '#d32f2f']}>
                                            <VisibilityOffIcon />
                                        </MetricIcon>
                                        <Box sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                                                <CountUp end={stats.unseen} duration={2} />
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.7 }}>
                                                Unseen Messages
                                            </Typography>
                                        </Box>

                                    </Box>
                                </Box>
                            </StyledMetricCard>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Contacts Table */}
                <Grid item xs={12} mb={3}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: '20px',
                            backgroundColor: isDarkMode ? '#151b3b' : '#fff',
                            '& .MuiTableCell-root': {
                                color: isDarkMode ? '#fff' : '#19234d',
                                borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                            },
                            '& .MuiTableHead-root .MuiTableCell-root': {
                                backgroundColor: isDarkMode ? '#19234d' : '#f5f7fa',
                                fontWeight: 600,
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Message</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Seen At</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {contacts
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((contact) => (
                                                <TableRow
                                                    key={contact._id}
                                                    sx={{
                                                        color: isDarkMode ? '#fff' : '#19234d',
                                                        '&:hover': {
                                                            backgroundColor: isDarkMode
                                                                ? 'rgba(217, 118, 74, 0.1)'
                                                                : 'rgba(43, 90, 158, 0.05)',
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{contact.name}</TableCell>
                                                    <TableCell>{contact.email}</TableCell>
                                                    <TableCell>{contact.message}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={contact.status === 'Seen' ? <CheckCircleIcon /> : <EyeIcon />}
                                                            label={contact.status}
                                                            color={contact.status === 'Seen' ? 'success' : 'warning'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: contact.status === 'Seen'
                                                                    ? isDarkMode ? 'rgba(76, 175, 80, 0.2)' : undefined
                                                                    : isDarkMode ? 'rgba(255, 152, 0, 0.2)' : undefined,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                                                    <TableCell>
                                                        {contact.seenAt ? formatDate(contact.seenAt) : 'Not seen yet'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {contact.status !== 'Seen' && (
                                                            <Tooltip title="Mark as Seen">
                                                                <IconButton
                                                                    onClick={() => handleMarkAsSeen(contact._id)}
                                                                    sx={{
                                                                        color: isDarkMode ? '#4caf50' : '#388e3c',
                                                                        '&:hover': {
                                                                            backgroundColor: isDarkMode
                                                                                ? 'rgba(76, 175, 80, 0.2)'
                                                                                : 'rgba(76, 175, 80, 0.1)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    sx={{
                                        color: isDarkMode ? '#fff' : '#19234d',
                                    }}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={contacts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )}
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Contacts;
