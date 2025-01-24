import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

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

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    },
    '& fieldset': {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
  },
  '& input, & textarea': {
    color: isDarkMode ? '#fff' : '#19234d',
  }
}));

const Blogs = () => {
  const { isDarkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    authorName: '',
    authorImage: '',
    category: '',
    excerpt: '',
    tags: [],
    status: 'Draft',
    visibility: 'Public',
    featuredImage: null,
    seoMetadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const getAuthToken = () => localStorage.getItem('token');

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/blogs`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const data = await response.json();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenDialog(true);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      slug: '',
      content: '',
      authorName: '',
      authorImage: '',
      category: '',
      excerpt: '',
      tags: [],
      status: 'Draft',
      visibility: 'Public',
      featuredImage: null,
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setOpenDialog(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, featuredImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      // First, validate that all required fields are present
      if (!formData.title || !formData.content || !formData.authorName || !formData.category || !formData.authorImage) {
        throw new Error('Please fill in all required fields');
      }

      // Create the blog data object
      const blogData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: formData.content,
        authorName: formData.authorName,
        authorImage: formData.authorImage,
        category: formData.category,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        tags: formData.tags || [],
        status: 'Draft',
        visibility: 'Public',
        isFeatured: false,
        seoMetadata: {
          metaTitle: formData.title,
          metaDescription: formData.excerpt || formData.content.substring(0, 150),
          keywords: formData.tags || []
        }
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      // If there's a featured image, use FormData
      if (formData.featuredImage) {
        requestBody = new FormData();
        // Append the blog data as a JSON string
        requestBody.append('blog', JSON.stringify(blogData));
        // Append the image file
        requestBody.append('featuredImage', formData.featuredImage);
      } else {
        // If no image, send JSON directly
        requestBody = JSON.stringify(blogData);
        headers['Content-Type'] = 'application/json';
      }

      // Log the data being sent
      console.log('Sending data:', {
        url: `${baseUrl}/api/blogs`,
        method: 'POST',
        headers,
        blogData,
        hasImage: !!formData.featuredImage
      });

      const response = await fetch(`${baseUrl}/api/blogs`, {
        method: 'POST',
        headers,
        body: requestBody
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response:', responseData);
        throw new Error(responseData.message || responseData.error || 'Failed to create blog');
      }

      console.log('Blog created successfully:', responseData);

      // Reset form and close dialog
      setFormData({
        title: '',
        slug: '',
        content: '',
        authorName: '',
        authorImage: '',
        category: '',
        excerpt: '',
        tags: [],
        status: 'Draft',
        visibility: 'Public',
        featuredImage: null,
        seoMetadata: {
          metaTitle: '',
          metaDescription: '',
          keywords: []
        }
      });
      setImagePreview('');
      setOpenDialog(false);
      fetchBlogs(); // Refresh the blogs list

    } catch (error) {
      console.error('Error details:', error);
      alert(`Error saving blog: ${error.message}`);
    }
  };

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
      <Grid container spacing={3} sx={{ width: '100%', m: 0 }} xs={12} sm={12} md={12} lg={12}>

        {/* Search and Add Section */}
        <Paper sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          background: isDarkMode
            ? 'rgba(25, 35, 77, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
          boxSizing: 'border-box',
          mx: 'auto'
        }}>
          <TextField
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: 500 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                color: isDarkMode ? '#fff' : '#19234d',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#d9764a' : '#2b5a9e',
                  }
                }
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? '#fff' : '#19234d',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 'auto' },
              '&:hover': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, #de7527 0%, #d9764a 100%)'
                  : 'linear-gradient(135deg, #19234d 0%, #2b5a9e 100%)',
              }
            }}
          >
            Create Blog
          </Button>
        </Paper>

        {/* Blogs Grid */}
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {filteredBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  background: isDarkMode
                    ? 'rgba(25, 35, 77, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(12px)',
                  transition: 'transform 0.3s ease',
                  width: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.featuredImage}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: isDarkMode ? '#fff' : '#19234d',
                      fontWeight: 600
                    }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" sx={{
                      mb: 2,
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                    }}>
                      {blog.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {blog.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: isDarkMode ? 'rgba(217, 118, 74, 0.15)' : 'rgba(43, 90, 158, 0.08)',
                            color: isDarkMode ? '#d9764a' : '#2b5a9e',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="caption" sx={{ color: isDarkMode ? '#A0AEC0' : '#718096' }}>
                      By {blog.authorName}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit" TransitionComponent={Zoom}>
                        <IconButton onClick={() => handleEdit(blog)} size="small">
                          <EditIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" TransitionComponent={Zoom}>
                        <IconButton onClick={() => handleDelete(blog._id)} size="small">
                          <DeleteIcon sx={{ color: isDarkMode ? '#ff5252' : '#dc3545' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        isDarkMode={isDarkMode}
      >
        <DialogTitle sx={{
          color: isDarkMode ? '#fff' : '#19234d',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          p: 3,
        }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {isCreating ? 'Create New Blog' : 'Edit Blog'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!formData.title}
                helperText={!formData.title ? 'Title is required' : ''}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="Content"
                multiline
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                error={!formData.content}
                helperText={!formData.content ? 'Content is required' : ''}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                required
                label="Author Name"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                error={!formData.authorName}
                helperText={!formData.authorName ? 'Author name is required' : ''}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                required
                label="Author Image URL"
                value={formData.authorImage}
                onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                error={!formData.authorImage}
                helperText={!formData.authorImage ? 'Author image URL is required' : ''}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                error={!formData.category}
                helperText={!formData.category ? 'Category is required' : ''}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Excerpt"
                multiline
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                isDarkMode={isDarkMode}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                    : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
                  borderRadius: '12px',
                  p: '12px 24px',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isDarkMode
                      ? '0 8px 16px rgba(217, 118, 74, 0.3)'
                      : '0 8px 16px rgba(43, 90, 158, 0.3)',
                  }
                }}
              >
                Upload Featured Image
                <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
              </Button>
              {imagePreview && (
                <Box sx={{
                  mt: 2,
                  position: 'relative',
                  width: 'fit-content',
                  '&:hover .preview-overlay': {
                    opacity: 1,
                  }
                }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '12px',
                      border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  />
                  <Box
                    className="preview-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, featuredImage: null });
                      }}
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>SEO Metadata</Typography>
              <StyledTextField
                fullWidth
                label="Meta Title"
                value={formData.seoMetadata.metaTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: { ...formData.seoMetadata, metaTitle: e.target.value }
                })}
                isDarkMode={isDarkMode}
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                label="Meta Description"
                multiline
                rows={2}
                value={formData.seoMetadata.metaDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: { ...formData.seoMetadata, metaDescription: e.target.value }
                })}
                isDarkMode={isDarkMode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isCreating ? 'Create Blog' : 'Save Changes'}
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default Blogs;
