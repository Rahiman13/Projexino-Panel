import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
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
  Pagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Save as SaveIcon,
  BookmarkBorder as BookmarkIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  LocalOffer as TagIcon,
  Lightbulb as TipIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import baseUrl from '../api';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';

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
    color: isDarkMode ? '#fff' : '#19234d',
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

const StyledChip = styled(Chip)(({ theme, isDarkMode, category }) => ({
  borderRadius: '16px',
  padding: '0 12px',
  height: '28px',
  background: category ?
    (isDarkMode ? 'rgba(217, 118, 74, 0.15)' : 'rgba(43, 90, 158, 0.1)') :
    (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
  color: category ?
    (isDarkMode ? '#d9764a' : '#2b5a9e') :
    (isDarkMode ? '#fff' : '#19234d'),
  '&:hover': {
    background: category ?
      (isDarkMode ? 'rgba(217, 118, 74, 0.25)' : 'rgba(43, 90, 158, 0.2)') :
      (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
  }
}));

const StyledChipContainer = styled('div')(({ theme, isDarkMode }) => ({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  borderRadius: '12px',
  padding: '8px',
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const StyledTagChip = styled(Chip)(({ theme, isDarkMode, variant }) => ({
  borderRadius: '16px',
  height: variant === 'small' ? '24px' : '28px',
  padding: '0 12px',
  background: (() => {
    switch (variant) {
      case 'primary':
        return isDarkMode
          ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.15) 0%, rgba(222, 117, 39, 0.15) 100%)'
          : 'linear-gradient(135deg, rgba(43, 90, 158, 0.1) 0%, rgba(25, 35, 77, 0.1) 100%)';
      case 'secondary':
        return isDarkMode
          ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(123, 31, 162, 0.15) 100%)'
          : 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)';
      default:
        return isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)';
    }
  })(),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  color: (() => {
    switch (variant) {
      case 'primary':
        return isDarkMode ? '#d9764a' : '#2b5a9e';
      case 'secondary':
        return isDarkMode ? '#ce93d8' : '#7b1fa2';
      default:
        return isDarkMode ? '#fff' : '#19234d';
    }
  })(),
  fontWeight: 500,
  fontSize: variant === 'small' ? '0.75rem' : '0.875rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: isDarkMode
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    background: (() => {
      switch (variant) {
        case 'primary':
          return isDarkMode
            ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.25) 0%, rgba(222, 117, 39, 0.25) 100%)'
            : 'linear-gradient(135deg, rgba(43, 90, 158, 0.2) 0%, rgba(25, 35, 77, 0.2) 100%)';
        case 'secondary':
          return isDarkMode
            ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.25) 0%, rgba(123, 31, 162, 0.25) 100%)'
            : 'linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(123, 31, 162, 0.2) 100%)';
        default:
          return isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)';
      }
    })()
  },
  '& .MuiChip-deleteIcon': {
    color: 'inherit',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: isDarkMode ? '#fff' : '#000',
      transform: 'scale(1.1)',
    }
  },
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));

const TagsContainer = styled(Box)(({ theme, isDarkMode }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '12px',
  borderRadius: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%)',
  backdropFilter: 'blur(8px)',
  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: isDarkMode
      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledSearchBar = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    color: isDarkMode ? '#fff' : '#19234d',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.07) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.09) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
      boxShadow: isDarkMode
        ? '0 4px 20px rgba(0,0,0,0.2)'
        : '0 4px 20px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      boxShadow: isDarkMode
        ? '0 4px 20px rgba(217, 118, 74, 0.2)'
        : '0 4px 20px rgba(43, 90, 158, 0.2)',
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '15px 20px',
  },
  '& .MuiInputAdornment-root': {
    marginRight: '10px',
  }
}));

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

const StyledFeaturedSection = styled(Box)(({ theme, isDarkMode }) => ({
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '12px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.07) 100%)'
    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%)',
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const StyledFAQSection = styled(Box)(({ theme, isDarkMode }) => ({
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '12px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.01) 0%, rgba(0, 0, 0, 0.03) 100%)',
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const StyledPagination = styled(Pagination)(({ theme, isDarkMode }) => ({
  '& .MuiPaginationItem-root': {
    margin: '0 4px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    '&:hover': {
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(217, 118, 74, 0.15) 0%, rgba(222, 117, 39, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(43, 90, 158, 0.1) 0%, rgba(25, 35, 77, 0.1) 100%)',
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      background: isDarkMode
        ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
        : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
      color: '#fff',
      boxShadow: isDarkMode
        ? '0 4px 15px rgba(217, 118, 74, 0.3)'
        : '0 4px 15px rgba(43, 90, 158, 0.3)',
      '&:hover': {
        background: isDarkMode
          ? 'linear-gradient(135deg, #c56a43 0%, #cb6b24 100%)'
          : 'linear-gradient(135deg, #234b84 0%, #141b3d 100%)',
      }
    }
  },
  '& .MuiPaginationItem-ellipsis': {
    background: 'transparent',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  },
  '& .MuiPaginationItem-previousNext': {
    padding: '8px',
    background: isDarkMode
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)',
    '&:hover': {
      background: isDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.1)',
    }
  }
}));

const FeaturedSection = ({ section, index, onChange, onDelete, isDarkMode }) => {
  return (
    <StyledFeaturedSection isDarkMode={isDarkMode}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Heading"
            value={section.heading || ''}
            onChange={(e) => onChange(index, { ...section, heading: e.target.value })}
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={section.description || ''}
            onChange={(e) => onChange(index, { ...section, description: e.target.value })}
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ marginRight: 2 }}
          >
            Upload Image
            <VisuallyHiddenInput type="file" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                onChange(index, { ...section, image: file });
              }
            }} />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(index)}
            startIcon={<DeleteIcon />}
          >
            Remove Section
          </Button>
        </Grid>
      </Grid>
    </StyledFeaturedSection>
  );
};

const FAQSection = ({ faq, index, onChange, onDelete, isDarkMode }) => {
  return (
    <StyledFAQSection isDarkMode={isDarkMode}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Question"
            value={faq.question || ''}
            onChange={(e) => onChange(index, { ...faq, question: e.target.value })}
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            multiline
            rows={3}
            label="Answer"
            value={faq.answer || ''}
            onChange={(e) => onChange(index, { ...faq, answer: e.target.value })}
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(index)}
            startIcon={<DeleteIcon />}
          >
            Remove FAQ
          </Button>
        </Grid>
      </Grid>
    </StyledFAQSection>
  );
};

const ContentBlock = ({ block, index, onChange, onDelete, isDarkMode }) => {
  return (
    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StyledTextField
            select
            fullWidth
            label="Content Type"
            value={block.type || 'paragraph'}
            onChange={(e) => onChange(index, { ...block, type: e.target.value })}
            isDarkMode={isDarkMode}
          >
            <MenuItem value="heading">Heading</MenuItem>
            <MenuItem value="paragraph">Paragraph</MenuItem>
            <MenuItem value="code">Code Block</MenuItem>
            <MenuItem value="list">List</MenuItem>
            <MenuItem value="quote">Quote</MenuItem>
          </StyledTextField>
        </Grid>

        {block.type === 'heading' && (
          <Grid item xs={12} sm={4}>
            <StyledTextField
              select
              fullWidth
              label="Heading Level"
              value={block.level || 1}
              onChange={(e) => onChange(index, { ...block, level: Number(e.target.value) })}
              isDarkMode={isDarkMode}
            >
              {[1, 2, 3, 4, 5, 6].map(level => (
                <MenuItem key={level} value={level}>H{level}</MenuItem>
              ))}
            </StyledTextField>
          </Grid>
        )}

        <Grid item xs={12}>
          {block.type === 'list' ? (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              label="List Items (one per line)"
              value={Array.isArray(block.items) ? block.items.join('\n') : ''}
              onChange={(e) => onChange(index, {
                ...block,
                items: e.target.value.split('\n').filter(Boolean),
                text: e.target.value // Also store in text for validation
              })}
              isDarkMode={isDarkMode}
            />
          ) : (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={block.text || ''}
              onChange={(e) => onChange(index, { ...block, text: e.target.value })}
              isDarkMode={isDarkMode}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(index)}
            startIcon={<DeleteIcon />}
          >
            Remove Block
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const cleanTag = (tag) => {
  if (!tag) return '';
  return tag
    .replace(/[\[\]"'\\]/g, '') // Remove brackets, quotes, and backslashes
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

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
    content: [{ type: 'paragraph', text: '' }],
    authorName: '',
    authorImage: null,
    category: '',
    featuredImage: null,
    imageAltText: '',
    status: 'Draft',
    visibility: 'Public',
    excerpt: '',
    tags: [],
    currentTag: '', // Add this
    seoMetadata: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    currentKeyword: '', // Add this
    breadcrumb: [],
    livePageUrl: '',
    topViewed: false,
    recentlyPublished: false,
    tocBasedOn: 'heading',
    audio: '',
    featuredSections: [],
    faqs: [],
    readingTime: 0, // Add this
    isFeatured: false, // Add this
  });

  const [authorImagePreview, setAuthorImagePreview] = useState('');
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
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

    // Parse content if it's a string
    let parsedContent;
    try {
      parsedContent = Array.isArray(blog.content)
        ? blog.content
        : typeof blog.content === 'string'
          ? JSON.parse(blog.content)
          : [{ type: 'paragraph', text: blog.content || '' }];

      // Ensure proper structure for list items
      parsedContent = parsedContent.map(block => {
        if (block.type === 'list' && !Array.isArray(block.items)) {
          return {
            ...block,
            items: block.text ? block.text.split('\n').filter(Boolean) : []
          };
        }
        return block;
      });
    } catch (error) {
      console.error('Error parsing content:', error);
      parsedContent = [{ type: 'paragraph', text: blog.content || '' }];
    }

    // Set form data with all fields, including the new ones
    setFormData({
      ...blog,
      content: parsedContent,
      featuredSections: blog.featuredSections || [],
      faqs: blog.faqs || [],
      breadcrumb: blog.breadcrumb || [],
      seoMetadata: {
        metaTitle: blog.seoMetadata?.metaTitle || '',
        metaDescription: blog.seoMetadata?.metaDescription || '',
        keywords: blog.seoMetadata?.keywords || []
      },
      imageAltText: blog.imageAltText || '',
      livePageUrl: blog.livePageUrl || '',
      topViewed: blog.topViewed || false,
      recentlyPublished: blog.recentlyPublished || false,
      tocBasedOn: blog.tocBasedOn || 'heading',
      audio: blog.audio || '',
      tags: blog.tags || [],
      status: blog.status || 'Draft',
      visibility: blog.visibility || 'Public',
      excerpt: blog.excerpt || '',
      isFeatured: blog.isFeatured || false,
      publishedDate: blog.publishedDate || '',
      updatedDate: blog.updatedDate || '',
      readingTime: blog.readingTime || ''
    });

    // Set image previews if they exist
    if (blog.authorImage) {
      setAuthorImagePreview(blog.authorImage);
    }
    if (blog.featuredImage) {
      setFeaturedImagePreview(blog.featuredImage);
    }

    setOpenDialog(true);
  };

  const handleCreateBlog = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      slug: '',
      content: [{ type: 'paragraph', text: '' }],
      authorName: '',
      authorImage: null,
      category: '',
      featuredImage: null,
      imageAltText: '',
      status: 'Draft',
      visibility: 'Public',
      excerpt: '',
      tags: [],
      publishedDate: '',
      updatedDate: '',
      readingTime: 0,
      isFeatured: false,
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      },
      breadcrumb: [],
      livePageUrl: '',
      topViewed: false,
      recentlyPublished: false,
      tocBasedOn: 'heading',
      audio: '',
      featuredSections: [], // Initialize as empty array
      faqs: [], // Initialize as empty array
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

  const validateContent = (content) => {
    if (!Array.isArray(content) || content.length === 0) {
      return false;
    }

    return content.every(block => {
      if (!block.type) return false;

      switch (block.type) {
        case 'heading':
          return typeof block.text === 'string' &&
            (!block.level || (block.level >= 1 && block.level <= 6));
        case 'list':
          return block.items || (typeof block.text === 'string' && block.text.length > 0);
        case 'code':
          return typeof block.text === 'string';
        case 'quote':
        case 'paragraph':
          return typeof block.text === 'string';
        default:
          return false;
      }
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!validateContent(formData.content)) {
        toast.error('Please ensure all content blocks are properly formatted');
        return;
      }

      setIsSubmitting(true);
      if (!formData.title || !formData.authorName || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      const formDataToSend = new FormData();

      // Format content blocks
      const formattedContent = formData.content.map(block => {
        const baseBlock = { type: block.type };

        if (block.text) baseBlock.text = block.text;
        if (block.level) baseBlock.level = block.level;
        if (block.language) baseBlock.language = block.language;

        if (block.type === 'list') {
          baseBlock.items = Array.isArray(block.items)
            ? block.items
            : block.text?.split('\n').filter(Boolean) || [];
        }

        return baseBlock;
      });

      // Add all fields to formData
      const fields = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        content: JSON.stringify(formattedContent),
        authorName: formData.authorName,
        category: formData.category,
        status: formData.status,
        visibility: formData.visibility,
        excerpt: formData.excerpt,
        tags: formData.tags.join(','),
        imageAltText: formData.imageAltText,
        breadcrumb: formData.breadcrumb.join(','),
        livePageUrl: formData.livePageUrl,
        topViewed: formData.topViewed,
        recentlyPublished: formData.recentlyPublished,
        tocBasedOn: formData.tocBasedOn,
        audio: formData.audio,
        featuredSections: JSON.stringify(formData.featuredSections),
        faqs: JSON.stringify(formData.faqs),
        readingTime: formData.readingTime,
        isFeatured: formData.isFeatured,
        seoMetadata: JSON.stringify({
          metaTitle: formData.seoMetadata.metaTitle,
          metaDescription: formData.seoMetadata.metaDescription,
          keywords: formData.seoMetadata.keywords
        })
      };

      // Append all fields to FormData
      Object.entries(fields).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Handle file uploads
      if (formData.authorImage instanceof File) {
        formDataToSend.append('authorImage', formData.authorImage);
      }
      if (formData.featuredImage instanceof File) {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }

      const url = isEditing
        ? `${baseUrl}/api/blogs/${formData._id}`
        : `${baseUrl}/api/blogs`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog');
      }

      toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
      setOpenDialog(false);
      fetchBlogs();
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this helper function
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: [{ type: 'paragraph', text: '' }],
      authorName: '',
      authorImage: null,
      category: '',
      featuredImage: null,
      imageAltText: '',
      status: 'Draft',
      visibility: 'Public',
      excerpt: '',
      tags: [],
      currentTag: '',
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      currentKeyword: '',
      breadcrumb: [],
      livePageUrl: '',
      topViewed: false,
      recentlyPublished: false,
      tocBasedOn: 'heading',
      audio: '',
      featuredSections: [],
      faqs: [],
      readingTime: 0,
      isFeatured: false,
    });
    setAuthorImagePreview('');
    setFeaturedImagePreview('');
  };

  const filteredBlogs = blogs?.filter(blog => {
    if (!blog) return false;
    const matchesSearch =
      (blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;

    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const renderContentBlock = (block) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 1}`;
        return <HeadingTag>{block.text}</HeadingTag>;
      case 'paragraph':
        return <Typography>{block.text}</Typography>;
      case 'code':
        return (
          <Box sx={{
            backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace'
          }}>
            <pre style={{ margin: 0 }}>{block.text}</pre>
          </Box>
        );
      case 'list':
        return (
          <ul>
            {block.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case 'quote':
        return (
          <Box sx={{
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2,
            fontStyle: 'italic'
          }}>
            {block.text}
          </Box>
        );
      default:
        return null;
    }
  };

  const displayBlogs = filteredBlogs
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
      <Typography>{error}</Typography>
    </Box>
  );

  if (!blogs || blogs.length === 0) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography>No blogs found</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BookmarkIcon
                sx={{
                  fontSize: '2rem',
                  color: isDarkMode ? '#d9764a' : '#2b5a9e',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  }
                }}
              />
              <Typography variant="h4" sx={{
                color: isDarkMode ? '#fff' : '#19234d',
                fontWeight: 600,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 3,
                  background: isDarkMode ? '#d9764a' : '#2b5a9e',
                  borderRadius: 2
                }
              }}>
                Blogs
              </Typography>
            </Box>
            <CreateButton
              isDarkMode={isDarkMode}
              startIcon={<AddIcon />}
              onClick={handleCreateBlog}
              endIcon={<TipIcon sx={{ animation: 'pulse 2s infinite' }} />}
            >
              Create New Blog
            </CreateButton>
          </Box>
        </Grid>

        <Grid item md={12} xs={12} sm={12} lg={12}>
          <StyledSearchBar
            fullWidth
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            isDarkMode={isDarkMode}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{
                    color: isDarkMode ? '#d9764a' : '#2b5a9e',
                    fontSize: '1.5rem',
                    animation: 'bounce 1s infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-3px)' }
                    }
                  }} />
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
                startIcon={<CategoryIcon />}
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
            {(filteredBlogs || [])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((blog, index) => (
                <Grid item xs={12} sm={6} md={4} key={blog._id || index}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.9) 0%, rgba(21, 27, 59, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    border: isDarkMode
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDarkMode
                        ? '0 8px 32px rgba(217, 118, 74, 0.2)'
                        : '0 8px 32px rgba(43, 90, 158, 0.2)',
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      {blog.featuredImage && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={blog.featuredImage}
                          alt={blog.title}
                          sx={{
                            borderRadius: '20px 20px 0 0',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <StyledChip
                        label={blog.category}
                        category="true"
                        isDarkMode={isDarkMode}
                        sx={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={blog.authorImage}
                          alt={blog.authorName}
                          sx={{
                            width: 40,
                            height: 40,
                            border: isDarkMode
                              ? '2px solid rgba(217, 118, 74, 0.3)'
                              : '2px solid rgba(43, 90, 158, 0.3)'
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{
                            color: isDarkMode ? '#fff' : '#19234d',
                            fontWeight: 600
                          }}>
                            {blog.authorName}
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                          }}>
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" gutterBottom sx={{
                        color: isDarkMode ? '#fff' : '#19234d',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        lineHeight: 1.4
                      }}>
                        {blog.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#666', mb: 2 }}>
                        {blog.excerpt || (Array.isArray(blog.content) && blog.content.length > 0
                          ? blog.content.find(block => block.type === 'paragraph')?.text?.substring(0, 150) || ''
                          : '')}...
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{
                          color: isDarkMode ? '#fff' : '#19234d',
                          mb: 1,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Box component="span" sx={{
                            width: '4px',
                            height: '16px',
                            borderRadius: '2px',
                            background: isDarkMode ? '#d9764a' : '#2b5a9e'
                          }} />
                          Tags
                        </Typography>
                        <TagsContainer isDarkMode={isDarkMode}>
                          {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
                            blog.tags.map((tag, index) => (
                              <StyledTagChip
                                key={index}
                                label={cleanTag(tag)}
                                variant="primary"
                                size="small"
                                isDarkMode={isDarkMode}
                                icon={
                                  <Box
                                    component="span"
                                    sx={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: isDarkMode ? '#d9764a' : '#2b5a9e',
                                      marginLeft: '8px'
                                    }}
                                  />
                                }
                              />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{
                              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                              fontStyle: 'italic'
                            }}>
                              No tags available
                            </Typography>
                          )}
                        </TagsContainer>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <StyledChip
                          label={`${blog.views || 0} views`}
                          size="small"
                          isDarkMode={isDarkMode}
                          icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                        />
                        <StyledChip
                          label={`${blog.likes || 0} likes`}
                          size="small"
                          isDarkMode={isDarkMode}
                          icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                        />
                        <StyledChip
                          label={blog.status}
                          size="small"
                          isDarkMode={isDarkMode}
                          sx={{
                            background: blog.status === 'Published'
                              ? (isDarkMode ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.1)')
                              : (isDarkMode ? 'rgba(237, 108, 2, 0.2)' : 'rgba(237, 108, 2, 0.1)'),
                            color: blog.status === 'Published'
                              ? (isDarkMode ? '#66bb6a' : '#2e7d32')
                              : (isDarkMode ? '#ff9800' : '#ed6c02')
                          }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{
                      justifyContent: 'flex-end',
                      p: 2,
                      borderTop: isDarkMode
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(blog)}
                          sx={{
                            color: isDarkMode ? '#d9764a' : '#2b5a9e',
                            '&:hover': {
                              background: isDarkMode
                                ? 'rgba(217, 118, 74, 0.1)'
                                : 'rgba(43, 90, 158, 0.1)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(blog._id)}
                          sx={{
                            color: isDarkMode ? '#ff5252' : '#dc3545',
                            '&:hover': {
                              background: isDarkMode
                                ? 'rgba(255, 82, 82, 0.1)'
                                : 'rgba(220, 53, 69, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
          mb: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '500px',
            height: '1px',
            background: isDarkMode
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
            zIndex: 0
          }
        }}>
          <Box sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(25, 35, 77, 0.95) 0%, rgba(21, 27, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            zIndex: 1,
            position: 'relative'
          }}>
            <StyledPagination
              count={Math.ceil(filteredBlogs.length / rowsPerPage)}
              page={page + 1}
              onChange={(e, newPage) => setPage(newPage - 1)}
              variant="outlined"
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
              isDarkMode={isDarkMode}
              components={{
                previous: (props) => (
                  <IconButton {...props}>
                    <PrevIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                  </IconButton>
                ),
                next: (props) => (
                  <IconButton {...props}>
                    <NextIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                  </IconButton>
                ),
                first: (props) => (
                  <IconButton {...props}>
                    <FirstPageIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                  </IconButton>
                ),
                last: (props) => (
                  <IconButton {...props}>
                    <LastPageIcon sx={{ color: isDarkMode ? '#d9764a' : '#2b5a9e' }} />
                  </IconButton>
                ),
              }}
              sx={{ display: 'flex', alignItems: 'center' }}
            />
          </Box>
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

            {/* <Grid item xs={12}>
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
            </Grid> */}

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
                label="Image Alt Text"
                value={formData.imageAltText || ''}
                onChange={(e) => setFormData({ ...formData, imageAltText: e.target.value })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Live Page URL"
                value={formData.livePageUrl || ''}
                onChange={(e) => setFormData({ ...formData, livePageUrl: e.target.value })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Audio URL"
                value={formData.audio || ''}
                onChange={(e) => setFormData({ ...formData, audio: e.target.value })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.topViewed}
                    onChange={(e) => setFormData({ ...formData, topViewed: e.target.checked })}
                  />
                }
                label="Top Viewed"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.recentlyPublished}
                    onChange={(e) => setFormData({ ...formData, recentlyPublished: e.target.checked })}
                  />
                }
                label="Recently Published"
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                select
                fullWidth
                label="TOC Based On"
                value={formData.tocBasedOn}
                onChange={(e) => setFormData({ ...formData, tocBasedOn: e.target.value })}
                isDarkMode={isDarkMode}
              >
                <MenuItem value="heading">Heading</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </StyledTextField>
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Breadcrumb (comma-separated)"
                value={Array.isArray(formData.breadcrumb) ? formData.breadcrumb.join(', ') : ''}
                onChange={(e) => setFormData({
                  ...formData,
                  breadcrumb: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{
                mb: 1,
                color: isDarkMode ? '#fff' : '#19234d',
                fontWeight: 500
              }}>
                Bread Crumb
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Add bread crumb (press Enter or comma to add)"
                value={formData.currentBreadCrumb || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes(',')) {
                    const newBreadCrumbs = value.split(',')
                      .map(breadcrumb => cleanTag(breadcrumb))
                      .filter(breadcrumb => breadcrumb && !formData.breadcrumb.includes(breadcrumb));

                    setFormData({
                      ...formData,
                      currentBreadCrumb: '',
                      breadcrumb: [...formData.breadcrumb, ...newBreadCrumbs]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      currentBreadCrumb: value
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.currentBreadCrumb.trim()) {
                    e.preventDefault();
                    const newBreadCrumbs = formData.currentBreadCrumb.trim();
                    if (!formData.breadcrumb.includes(newBreadCrumbs)) {
                      setFormData({
                        ...formData,
                        currentBreadCrumb: '',
                        breadcrumb: [...formData.breadcrumb, newBreadCrumbs]
                      });
                    }
                  }
                }}
                isDarkMode={isDarkMode}
                sx={{ mb: 1 }}
              />
              <StyledChipContainer isDarkMode={isDarkMode}>
                {Array.isArray(formData.breadcrumb) && formData.breadcrumb.map((breadcrumb, index) => (
                  <StyledTagChip
                    key={index}
                    label={cleanTag(breadcrumb)}
                    variant="primary"
                    size="small"
                    isDarkMode={isDarkMode}
                    onDelete={() => {
                      setFormData({
                        ...formData,
                        breadcrumb: formData.breadcrumb.filter((_, i) => i !== index)
                      });
                    }}
                  />
                ))}
              </StyledChipContainer>
            </Grid>

            {/* <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Featured Sections
              </Typography>
              {(formData?.featuredSections || []).map((section, index) => (
                <FeaturedSection
                  key={index}
                  section={section}
                  index={index}
                  onChange={(idx, newSection) => {
                    const newSections = [...(formData.featuredSections || [])];
                    newSections[idx] = newSection;
                    setFormData({ ...formData, featuredSections: newSections });
                  }}
                  onDelete={(idx) => {
                    setFormData({
                      ...formData,
                      featuredSections: (formData.featuredSections || []).filter((_, i) => i !== idx)
                    });
                  }}
                  isDarkMode={isDarkMode}
                />
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setFormData({
                  ...formData,
                  featuredSections: [...(formData.featuredSections || []), { heading: '', description: '', image: null }]
                })}
              >
                Add Featured Section
              </Button>
            </Grid> */}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                FAQs
              </Typography>
              {(formData?.faqs || []).map((faq, index) => (
                <FAQSection
                  key={index}
                  faq={faq}
                  index={index}
                  onChange={(idx, newFAQ) => {
                    const newFAQs = [...(formData.faqs || [])];
                    newFAQs[idx] = newFAQ;
                    setFormData({ ...formData, faqs: newFAQs });
                  }}
                  onDelete={(idx) => {
                    setFormData({
                      ...formData,
                      faqs: (formData.faqs || []).filter((_, i) => i !== idx)
                    });
                  }}
                  isDarkMode={isDarkMode}
                />
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setFormData({
                  ...formData,
                  faqs: [...(formData.faqs || []), { question: '', answer: '' }]
                })}
              >
                Add FAQ
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{
                mb: 1,
                color: isDarkMode ? '#fff' : '#19234d',
                fontWeight: 500
              }}>
                Tags
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Add tags (press Enter or comma to add)"
                value={formData.currentTag || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes(',')) {
                    const newTags = value.split(',')
                      .map(tag => cleanTag(tag))
                      .filter(tag => tag && !formData.tags.includes(tag));

                    setFormData({
                      ...formData,
                      currentTag: '',
                      tags: [...formData.tags, ...newTags]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      currentTag: value
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.currentTag.trim()) {
                    e.preventDefault();
                    const newTag = formData.currentTag.trim();
                    if (!formData.tags.includes(newTag)) {
                      setFormData({
                        ...formData,
                        currentTag: '',
                        tags: [...formData.tags, newTag]
                      });
                    }
                  }
                }}
                isDarkMode={isDarkMode}
                sx={{ mb: 1 }}
              />
              <StyledChipContainer isDarkMode={isDarkMode}>
                {Array.isArray(formData.tags) && formData.tags.map((tag, index) => (
                  <StyledTagChip
                    key={index}
                    label={cleanTag(tag)}
                    variant="primary"
                    size="small"
                    isDarkMode={isDarkMode}
                    onDelete={() => {
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index)
                      });
                    }}
                  />
                ))}
              </StyledChipContainer>
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
              <Typography variant="h6" gutterBottom>
                Content Blocks
              </Typography>
              <Box sx={{ mb: 2 }}>
                {formData.content.map((block, index) => (
                  <ContentBlock
                    key={index}
                    block={block}
                    index={index}
                    onChange={(index, newBlock) => {
                      const newContent = [...formData.content];
                      newContent[index] = newBlock;
                      setFormData({ ...formData, content: newContent });
                    }}
                    onDelete={(index) => {
                      const newContent = formData.content.filter((_, i) => i !== index);
                      setFormData({ ...formData, content: newContent });
                    }}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setFormData({
                    ...formData,
                    content: [...formData.content, { type: 'paragraph', text: '' }]
                  });
                }}
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Add Content Block
              </Button>

              <Typography variant="subtitle1" gutterBottom>
                Content Preview
              </Typography>
              <Box sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                minHeight: '200px',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {formData.content.map((block, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {renderContentBlock(block)}
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                SEO Metadata
              </Typography>
              <StyledTextField
                fullWidth
                label="Meta Title"
                value={formData.seoMetadata?.metaTitle || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: {
                    ...formData.seoMetadata,
                    metaTitle: e.target.value
                  }
                })}
                isDarkMode={isDarkMode}
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                label="Meta Description"
                multiline
                rows={2}
                value={formData.seoMetadata?.metaDescription || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: {
                    ...formData.seoMetadata,
                    metaDescription: e.target.value
                  }
                })}
                isDarkMode={isDarkMode}
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                label="Keywords (comma-separated)"
                value={(formData.seoMetadata?.keywords || []).join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  seoMetadata: {
                    ...formData.seoMetadata,
                    keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(Boolean)
                  }
                })}
                isDarkMode={isDarkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{
                mb: 1,
                color: isDarkMode ? '#fff' : '#19234d',
                fontWeight: 500
              }}>
                SEO Keywords
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Add keywords (press Enter or comma to add)"
                value={formData.currentKeyword || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes(',')) {
                    const newKeywords = value.split(',')
                      .map(keyword => keyword.trim())
                      .filter(keyword => keyword && !formData.seoMetadata.keywords.includes(keyword));

                    setFormData({
                      ...formData,
                      currentKeyword: '',
                      seoMetadata: {
                        ...formData.seoMetadata,
                        keywords: [...formData.seoMetadata.keywords, ...newKeywords]
                      }
                    });
                  } else {
                    setFormData({
                      ...formData,
                      currentKeyword: value
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.currentKeyword.trim()) {
                    e.preventDefault();
                    const newKeyword = formData.currentKeyword.trim();
                    if (!formData.seoMetadata.keywords.includes(newKeyword)) {
                      setFormData({
                        ...formData,
                        currentKeyword: '',
                        seoMetadata: {
                          ...formData.seoMetadata,
                          keywords: [...formData.seoMetadata.keywords, newKeyword]
                        }
                      });
                    }
                  }
                }}
                isDarkMode={isDarkMode}
                sx={{ mb: 1 }}
              />
              <TagsContainer isDarkMode={isDarkMode}>
                {formData.seoMetadata.keywords.map((keyword, index) => (
                  <StyledTagChip
                    key={index}
                    label={cleanTag(keyword)}
                    variant="secondary"
                    onDelete={() => {
                      setFormData({
                        ...formData,
                        seoMetadata: {
                          ...formData.seoMetadata,
                          keywords: formData.seoMetadata.keywords.filter((_, i) => i !== index)
                        }
                      });
                    }}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </TagsContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isSubmitting}
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            onClick={handleSubmit}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #d9764a 0%, #de7527 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #19234d 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 6px 20px rgba(217, 118, 74, 0.4)'
                  : '0 6px 20px rgba(43, 90, 158, 0.4)',
              }
            }}
          >
            {isEditing ? 'Save Changes' : 'Create Blog'}
          </LoadingButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default Blogs;
