import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Button,
    Paper,
    Link,
    Select,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon,
    MonetizationOn as SalaryIcon,
    Description as DescriptionIcon,
    Download as DownloadIcon,
    People as PeopleIcon,
    Mail as MailIcon,
    Phone as PhoneIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { format } from 'date-fns';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { toast } from 'react-hot-toast';
import { styled as muiStyled } from '@mui/material/styles';
import Swal from 'sweetalert2';

const MetricCard = ({ title, value, icon, color, isDarkMode }) => (
    <Paper
        sx={{
            p: 3,
            background: isDarkMode
                ? `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`
                : `linear-gradient(135deg, ${color}11 0%, ${color}22 100%)`,
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
                sx={{
                    p: 1,
                    borderRadius: '12px',
                    bgcolor: `${color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </Box>
        </Box>
        <Typography variant="h4" sx={{ color: isDarkMode ? '#fff' : '#19234d', mb: 1 }}>
            {value}
        </Typography>
        <Typography variant="body2" sx={{ color: isDarkMode ? '#A0AEC0' : '#4A5568' }}>
            {title}
        </Typography>
    </Paper>
);

const CareerChart = ({ data, isDarkMode, selectedYear, onYearChange, loading }) => (
    <Paper
        sx={{
            p: 3,
            background: isDarkMode
                ? 'rgba(25, 35, 77, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            boxShadow: isDarkMode
                ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            position: 'relative',
            minHeight: '400px'
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" color={isDarkMode ? '#fff' : '#19234d'}>
                Application Trends
            </Typography>
            <Select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
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
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: isDarkMode ? '#19234d' : '#fff',
                            '& .MuiMenuItem-root': {
                                color: isDarkMode ? '#fff' : '#19234d',
                            }
                        }
                    }
                }}
            >
                {[2025, 2024, 2023, 2022].map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </Box>

        {loading ? (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '350px'
            }}>
                <CircularProgress color={isDarkMode ? "secondary" : "primary"} />
            </Box>
        ) : (
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isDarkMode ? '#d9764a' : '#2b5a9e'} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={isDarkMode ? '#d9764a' : '#2b5a9e'} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    />
                    <XAxis
                        dataKey="name"
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
                    <Area
                        type="monotone"
                        dataKey="applications"
                        stroke={isDarkMode ? '#d9764a' : '#2b5a9e'}
                        fillOpacity={1}
                        fill="url(#applicationGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        )}
    </Paper>
);

const CreateButton = muiStyled(Button)(({ theme, isDarkMode }) => ({
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

const StyledDialog = muiStyled(Dialog)(({ theme, isDarkMode }) => ({
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

const textFieldStyle = (isDarkMode) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
    },
    '& label': {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    },
    '& .MuiOutlinedInput-input': {
        color: isDarkMode ? '#fff' : '#19234d',
    }
});

const Careers = () => {
    const { isDarkMode } = useTheme();
    const [careers, setCareers] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyData, setMonthlyData] = useState([]);
    const [graphLoading, setGraphLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: '',
        experience: { min: 0, max: 0 },
        salary: { min: 0, max: 0 },
        description: '',
        requirements: [''],
        responsibilities: [''],
        benefits: [''],
        status: 'Active',
        applicationDeadline: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCareerId, setSelectedCareerId] = useState(null);

    useEffect(() => {
        fetchCareers();
    }, []);

    useEffect(() => {
        fetchCareerStats();
    }, [selectedYear]);

    const fetchCareers = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/careers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCareers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching careers:', error);
            setLoading(false);
        }
    };

    const fetchCareerStats = async () => {
        try {
            setGraphLoading(true);
            const response = await fetch(`${baseUrl}/api/careers/counts/${selectedYear}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            const transformedData = data.map(item => ({
                name: new Date(selectedYear, item.month - 1).toLocaleString('default', { month: 'short' }),
                applications: item.count
            }));
            
            setMonthlyData(transformedData);
        } catch (error) {
            console.error('Error fetching career stats:', error);
        } finally {
            setGraphLoading(false);
        }
    };

    const handleExpandClick = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditCareer = (career) => {
        setIsEditing(true);
        setSelectedCareerId(career._id);
        setFormData({
            ...career,
            experience: {
                min: career.experience.min,
                max: career.experience.max
            },
            salary: {
                min: career.salary.min,
                max: career.salary.max
            }
        });
        setOpenDialog(true);
    };

    const handleDeleteCareer = async (careerId) => {
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
                const response = await fetch(`${baseUrl}/api/careers/${careerId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete career position');
                }

                const data = await response.json();
                
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: data.message || 'Career position has been deleted.',
                    icon: 'success',
                    confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                    background: isDarkMode ? '#19234d' : '#fff',
                    color: isDarkMode ? '#fff' : '#19234d'
                });

                fetchCareers(); // Refresh the list
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Failed to delete career position',
                    icon: 'error',
                    confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                    background: isDarkMode ? '#19234d' : '#fff',
                    color: isDarkMode ? '#fff' : '#19234d'
                });
            }
        }
    };

    const handleCreateCareer = async (values) => {
        try {
            // Validate required fields
            if (!values.title || !values.department || !values.location || !values.type) {
                toast.error('Please fill in all required fields');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await fetch(`${baseUrl}/api/careers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...values,
                    experience: {
                        min: parseInt(values.experience.min),
                        max: parseInt(values.experience.max)
                    },
                    salary: {
                        min: parseInt(values.salary.min),
                        max: parseInt(values.salary.max)
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create career position');
            }

            const data = await response.json();
            setCareers([...careers, data]);
            setOpenDialog(false);
            setFormData({
                title: '',
                department: '',
                location: '',
                type: '',
                experience: { min: 0, max: 0 },
                salary: { min: 0, max: 0 },
                description: '',
                requirements: [''],
                responsibilities: [''],
                benefits: [''],
                status: 'Active',
                applicationDeadline: ''
            });
            toast.success('Career position created successfully');
        } catch (error) {
            console.error('Error creating career:', error);
            toast.error(error.message || 'Failed to create career position');
        }
    };

    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.title || !formData.department || !formData.location || !formData.type) {
                toast.error('Please fill in all required fields');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const url = isEditing 
                ? `${baseUrl}/api/careers/${selectedCareerId}`
                : `${baseUrl}/api/careers`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    experience: {
                        min: parseInt(formData.experience.min),
                        max: parseInt(formData.experience.max)
                    },
                    salary: {
                        min: parseInt(formData.salary.min),
                        max: parseInt(formData.salary.max)
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} career position`);
            }

            const data = await response.json();
            toast.success(`Career position ${isEditing ? 'updated' : 'created'} successfully`);
            setOpenDialog(false);
            fetchCareers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedCareerId(null);
        setFormData({
            title: '',
            department: '',
            location: '',
            type: '',
            experience: { min: 0, max: 0 },
            salary: { min: 0, max: 0 },
            description: '',
            requirements: [''],
            responsibilities: [''],
            benefits: [''],
            status: 'Active',
            applicationDeadline: ''
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
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
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: isDarkMode ? '#fff' : '#19234d',
                        fontWeight: 600
                    }}
                >
                    Career Opportunities
                </Typography>
                <CreateButton
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    isDarkMode={isDarkMode}
                >
                    Create Career Position
                </CreateButton>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Active Positions"
                        value={careers.filter(c => c.status === 'Active').length}
                        icon={<WorkIcon sx={{ color: '#4C51BF' }} />}
                        color="#4C51BF"
                        isDarkMode={isDarkMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Applications"
                        value={careers.reduce((acc, curr) => acc + curr.applications.length, 0)}
                        icon={<PeopleIcon sx={{ color: '#38B2AC' }} />}
                        color="#38B2AC"
                        isDarkMode={isDarkMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Average Salary"
                        value={`₹${Math.round(careers.reduce((acc, curr) => acc + (curr.salary.min + curr.salary.max) / 2, 0) / careers.length / 1000)}K`}
                        icon={<SalaryIcon sx={{ color: '#D69E2E' }} />}
                        color="#D69E2E"
                        isDarkMode={isDarkMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Remote Positions"
                        value={careers.filter(c => c.location.toLowerCase().includes('remote')).length}
                        icon={<LocationIcon sx={{ color: '#E53E3E' }} />}
                        color="#E53E3E"
                        isDarkMode={isDarkMode}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mb: 4 }}>
                        <CareerChart
                            data={monthlyData}
                            isDarkMode={isDarkMode}
                            selectedYear={selectedYear}
                            onYearChange={(year) => setSelectedYear(year)}
                            loading={graphLoading}
                        />
                    </Box>
                </Grid>

                
                {careers.map((career) => (
                    <Grid item xs={12} md={6} lg={12} key={career._id}>
                        <Paper
                            sx={{
                                background: isDarkMode
                                    ? 'rgba(25, 35, 77, 0.8)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                boxShadow: isDarkMode
                                    ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 32px 0 rgba(255, 255, 255, 0.02)'
                                    : '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 32px 0 rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" color={isDarkMode ? '#fff' : '#19234d'}>
                                        {career.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip
                                            label={career.status}
                                            color={career.status === 'Active' ? 'success' : 'default'}
                                            sx={{
                                                color: isDarkMode ? '#fff' : '#19234d',
                                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <IconButton 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditCareer(career);
                                            }}
                                            sx={{ 
                                                color: isDarkMode ? '#d9764a' : '#2b5a9e',
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.1)'
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCareer(career._id);
                                            }}
                                            sx={{ 
                                                color: isDarkMode ? '#ff4d4d' : '#dc3545',
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(255, 77, 77, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                                                }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    <Chip 
                                        icon={<WorkIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />} 
                                        label={career.type}
                                        sx={{
                                            color: isDarkMode ? '#fff' : '#19234d',
                                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Chip 
                                        icon={<LocationIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />} 
                                        label={career.location}
                                        sx={{
                                            color: isDarkMode ? '#fff' : '#19234d',
                                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Chip
                                        icon={<SalaryIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />}
                                        label={`₹${career.salary.min / 1000}K - ₹${career.salary.max / 1000}K`}
                                        sx={{
                                            color: isDarkMode ? '#fff' : '#19234d',
                                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Chip
                                        icon={<TimeIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />}
                                        label={`${career.experience.min}-${career.experience.max} years`}
                                        sx={{
                                            color: isDarkMode ? '#fff' : '#19234d',
                                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </Box>

                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mb: 2,
                                        color: isDarkMode ? '#A0AEC0' : '#4A5568'
                                    }}
                                >
                                    {career.description}
                                </Typography>

                                <Button
                                    onClick={() => handleExpandClick(career._id)}
                                    sx={{ mt: 1 }}
                                    endIcon={
                                        <ExpandMoreIcon
                                            sx={{
                                                transform: expandedId === career._id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s'
                                            }}
                                        />
                                    }
                                >
                                    View Applications ({career.applications.length})
                                </Button>

                                <Collapse in={expandedId === career._id}>
                                    <List>
                                        {career.applications.map((application) => (
                                            <Paper
                                                key={application._id}
                                                elevation={0}
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    backgroundColor: isDarkMode
                                                        ? 'rgba(255,255,255,0.05)'
                                                        : 'rgba(0,0,0,0.02)',
                                                    border: `1px solid ${
                                                        isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                                    }`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(8px)',
                                                        backgroundColor: isDarkMode
                                                            ? 'rgba(217, 118, 74, 0.1)'
                                                            : 'rgba(43, 90, 158, 0.05)'
                                                    }
                                                }}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="h6" color={isDarkMode ? '#fff' : '#19234d'}>
                                                                {application.name || 'Anonymous Application'}
                                                            </Typography>
                                                            <Chip
                                                                label={format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)',
                                                                    color: isDarkMode ? '#d9764a' : '#2b5a9e'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                            <Chip
                                                                icon={<MailIcon sx={{ fontSize: '1rem' }} />}
                                                                label={application.email}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                                                }}
                                                            />
                                                            {application.phone && (
                                                                <Chip
                                                                    icon={<PhoneIcon sx={{ fontSize: '1rem' }} />}
                                                                    label={application.phone}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    {application.message && (
                                                        <Grid item xs={12}>
                                                            <Typography
                                                                variant="body2"
                                                                color={isDarkMode ? '#A0AEC0' : '#4A5568'}
                                                                sx={{
                                                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                                                    p: 2,
                                                                    borderRadius: '8px'
                                                                }}
                                                            >
                                                                {application.message}
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                    {application.resumeUrl && (
                                                        <Grid item xs={12}>
                                                            <Button
                                                                startIcon={<DownloadIcon />}
                                                                variant="outlined"
                                                                size="small"
                                                                href={application.resumeUrl}
                                                                target="_blank"
                                                                sx={{
                                                                    color: isDarkMode ? '#d9764a' : '#2b5a9e',
                                                                    borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                                                                    '&:hover': {
                                                                        borderColor: isDarkMode ? '#de7527' : '#19234d',
                                                                        backgroundColor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                Download Resume
                                                            </Button>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Paper>
                                        ))}
                                    </List>
                                </Collapse>
                            </CardContent>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <StyledDialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                isDarkMode={isDarkMode}
            >
                <DialogTitle sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
                    {isEditing ? 'Edit Career Position' : 'Create Career Position'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            fullWidth
                            sx={textFieldStyle(isDarkMode)}
                        />
                        <TextField
                            label="Department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            required
                            fullWidth
                            sx={textFieldStyle(isDarkMode)}
                        />
                        <TextField
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            fullWidth
                            sx={textFieldStyle(isDarkMode)}
                        />
                        <Select
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                            fullWidth
                            sx={{
                                ...textFieldStyle(isDarkMode),
                                '& .MuiSelect-select': {
                                    color: isDarkMode ? '#fff' : '#19234d',
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: isDarkMode ? '#19234d' : '#fff',
                                        '& .MuiMenuItem-root': {
                                            color: isDarkMode ? '#fff' : '#19234d',
                                        }
                                    }
                                }
                            }}
                        >
                            {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Min Experience (years)"
                                type="number"
                                value={formData.experience.min}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    experience: { ...formData.experience, min: e.target.value }
                                })}
                                fullWidth
                                sx={textFieldStyle(isDarkMode)}
                            />
                            <TextField
                                label="Max Experience (years)"
                                type="number"
                                value={formData.experience.max}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    experience: { ...formData.experience, max: e.target.value }
                                })}
                                fullWidth
                                sx={textFieldStyle(isDarkMode)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Min Salary"
                                type="number"
                                value={formData.salary.min}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    salary: { ...formData.salary, min: e.target.value }
                                })}
                                fullWidth
                                sx={textFieldStyle(isDarkMode)}
                            />
                            <TextField
                                label="Max Salary"
                                type="number"
                                value={formData.salary.max}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    salary: { ...formData.salary, max: e.target.value }
                                })}
                                fullWidth
                                sx={textFieldStyle(isDarkMode)}
                            />
                        </Box>
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            sx={textFieldStyle(isDarkMode)}
                        />
                        <TextField
                            label="Application Deadline"
                            type="datetime-local"
                            value={formData.applicationDeadline}
                            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                            fullWidth
                            sx={textFieldStyle(isDarkMode)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditing ? 'Update Position' : 'Create Position'}
                    </Button>
                </DialogActions>
            </StyledDialog>
        </Box >
    );
};

export default Careers;
