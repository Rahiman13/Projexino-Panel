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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
}));

const Blogs = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    authorName: '',
    authorImage: null,
    tags: [],
    category: '',
    featuredImage: null,
    status: 'Draft',
    publishedDate: null,
    excerpt: '',
    seoMetadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    visibility: 'Public',
    isFeatured: false,
    readingTime: 0
  });
  const [authorImagePreview, setAuthorImagePreview] = useState('');
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const uniqueCategories = [...new Set(blogs.map(blog => blog.category))];
      setCategories(uniqueCategories);
    }
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/blogs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch blogs');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
        const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Blog has been deleted.',
            icon: 'success',
            confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
            background: isDarkMode ? '#19234d' : '#fff',
            color: isDarkMode ? '#fff' : '#19234d'
          });
          fetchBlogs();
        } else {
          throw new Error('Failed to delete blog');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete blog',
          icon: 'error',
          confirmButtonColor: isDarkMode ? '#d9764a' : '#2b5a9e',
          background: isDarkMode ? '#19234d' : '#fff',
          color: isDarkMode ? '#fff' : '#19234d'
        });
      }
    }
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setFormData({
      ...blog,
      tags: blog.tags || [],
      seoMetadata: blog.seoMetadata || {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setAuthorImagePreview(blog.authorImage || '');
    setFeaturedImagePreview(blog.featuredImage || '');
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      slug: '',
      content: '',
      authorName: '',
      authorImage: null,
      tags: [],
      category: '',
      featuredImage: null,
      status: 'Draft',
      excerpt: '',
      visibility: 'Public',
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setAuthorImagePreview('');
    setFeaturedImagePreview('');
    setOpenDialog(true);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const previewUrl = URL.createObjectURL(file);
      if (type === 'authorImage') {
        setAuthorImagePreview(previewUrl);
      } else {
        setFeaturedImagePreview(previewUrl);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'content', 'authorName', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      if (!formData.authorImage && !isEditing) {
        toast.error('Author image is required');
        return;
      }

      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');

      const formDataToSend = new FormData();
      
      // Append all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', slug);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('visibility', formData.visibility);
      formDataToSend.append('excerpt', formData.excerpt || '');
      formDataToSend.append('isFeatured', formData.isFeatured);
      formDataToSend.append('readingTime', formData.readingTime);
      
      if (formData.publishedDate) {
        formDataToSend.append('publishedDate', formData.publishedDate);
      }

      // Append files if they exist
      if (formData.authorImage instanceof File) {
        formDataToSend.append('authorImage', formData.authorImage);
      }
      if (formData.featuredImage instanceof File) {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }

      // Handle arrays and objects
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('seoMetadata', JSON.stringify(formData.seoMetadata));

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${baseUrl}/api/blogs/${formData._id}`
        : `${baseUrl}/api/blogs`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog');
      }

      toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully`);
      setOpenDialog(false);
      fetchBlogs();
      
      setAuthorImagePreview('');
      setFeaturedImagePreview('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Loading...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

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
      <Grid container spacing={3} md={12} xs={12} sm={12} lg={12}>
        <Grid item md={12} xs={12} sm={12} lg={12}>


          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
              Blogs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                background: isDarkMode ? '#d9764a' : '#2b5a9e',
                '&:hover': {
                  background: isDarkMode ? '#c56a43' : '#234b84',
                }
              }}
            >
              Create New Blog
            </Button>
          </Box>
        </Grid>

        <Grid item md={12} xs={12} sm={12} lg={12}>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
              },
              '& input': {
                color: isDarkMode ? '#fff' : '#19234d',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDarkMode ? '#fff' : '#19234d' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('all')}
              sx={{
                borderRadius: '20px',
                background: selectedCategory === 'all' 
                  ? (isDarkMode ? '#d9764a' : '#2b5a9e')
                  : 'transparent',
                '&:hover': {
                  background: selectedCategory === 'all'
                    ? (isDarkMode ? '#c56a43' : '#234b84')
                    : 'rgba(255,255,255,0.1)'
                }
              }}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: '20px',
                  background: selectedCategory === category 
                    ? (isDarkMode ? '#d9764a' : '#2b5a9e')
                    : 'transparent',
                  '&:hover': {
                    background: selectedCategory === category
                      ? (isDarkMode ? '#c56a43' : '#234b84')
                      : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Grid>
        <Grid item md={12} xs={12} sm={12} lg={12}>

          <Grid container spacing={3}>
            {filteredBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: isDarkMode ? 'rgba(25, 35, 77, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(217, 118, 74, 0.2)'
                      : '0 8px 32px rgba(43, 90, 158, 0.2)',
                  }
                }}>
                  {blog.featuredImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.featuredImage}
                      alt={blog.title}
                      sx={{ 
                        objectFit: 'cover',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` 
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: isDarkMode ? '#fff' : '#19234d',
                      fontWeight: 600 
                    }}>
                      {blog.title}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {blog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            background: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)',
                            color: isDarkMode ? '#d9764a' : '#2b5a9e',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#666', mb: 2 }}>
                      {blog.excerpt || blog.content.substring(0, 150)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={blog.authorImage}
                          alt={blog.authorName}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: isDarkMode ? '#888' : '#666' }}>
                          {blog.authorName}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: isDarkMode ? '#888' : '#666' }}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Chip
                        label={`${blog.views} views`}
                        size="small"
                        sx={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                      />
                      <Chip
                        label={`${blog.likes} likes`}
                        size="small"
                        sx={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                      />
                      <Chip
                        label={blog.status}
                        size="small"
                        color={blog.status === 'Published' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(blog)} sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(blog._id)} sx={{ color: isDarkMode ? '#ff5252' : '#dc3545' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <StyledDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        isDarkMode={isDarkMode}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#fff' : '#19234d' }}>
          {isEditing ? 'Edit Blog' : 'Create New Blog'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="Leave empty to generate from title"
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Content *"
                multiline
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Author Name *"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                required
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Category *"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                isDarkMode={isDarkMode}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
              </StyledTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                select
                fullWidth
                label="Visibility"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                isDarkMode={isDarkMode}
              >
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </StyledTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                }
                label="Featured Post"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="number"
                label="Reading Time (minutes)"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 0 })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()) 
                })}
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

            <Grid item xs={12} sm={6}>
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Author Image *
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'authorImage')}
                  />
                </Button>
                {authorImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img 
                      src={authorImagePreview} 
                      alt="Author preview" 
                      style={{ maxWidth: '100%', maxHeight: '100px' }} 
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Featured Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'featuredImage')}
                  />
                </Button>
                {featuredImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img 
                      src={featuredImagePreview} 
                      alt="Featured preview" 
                      style={{ maxWidth: '100%', maxHeight: '100px' }} 
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? '#fff' : '#19234d' }}>
                SEO Metadata
              </Typography>
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
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                label="Keywords (comma-separated)"
                value={formData.seoMetadata.keywords.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: {
                    ...formData.seoMetadata,
                    keywords: e.target.value.split(',').map(keyword => keyword.trim())
                  }
                })}
                isDarkMode={isDarkMode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: isDarkMode ? '#d9764a' : '#2b5a9e',
              '&:hover': {
                background: isDarkMode ? '#c56a43' : '#234b84',
              }
            }}
          >
            {isEditing ? 'Save Changes' : 'Create Blog'}
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
    
  );
};

export default Blogs;
