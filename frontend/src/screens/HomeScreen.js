import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Pagination from 'react-bootstrap/Pagination';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Product from '../components/Product';
import { Store } from '../Store';
import { useLocation, useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const categoryFilter = params.get('category');
  const currentPage = parseInt(params.get('page')) || 1;
  const productsPerPage = 12; // changed to 12 products per page

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    toast.success('Added to cart');
  };

  const heroImages = [
    '/images/blue.png',
    '/images/green.png',
    '/images/whitw.png',
    
  ];

  const bannerData = [
    
  { id: 0, title: 'All Products', subtitle: 'See Everything', category: '', image: '/images/cat.jpg', bgColor: '#6c5ce7', textColor: 'white' },
  { id: 3, title: 'Skin Care', subtitle: 'Premium Products', category: 'Skin Care', image: '/images/skin.jpg', bgColor: '#2ed573', textColor: 'white' },
  { id: 4, title: 'Vitamins', subtitle: 'Health Boost', category: 'Vitamins', image: '/images/vita.jpg', bgColor: '#ffa502', textColor: 'white' },
  { id: 5, title: 'Baby Care', subtitle: 'Gentle & Safe', category: 'Baby Care', image: '/images/baby.jpg', bgColor: '#ff6b9d', textColor: 'white' },
  { id: 6, title: 'Wellness', subtitle: 'Stay Healthy', category: 'Wellness', image: '/images/wel.jpg', bgColor: '#7bed9f', textColor: 'white' },
  { id: 7, title: 'Band Product', subtitle: 'Quality Supports', category: 'Band Product', image: '/images/band.jpg', bgColor: '#ff4757', textColor: 'white' }
];


  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  // Pagination logic
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', pageNumber.toString());
    navigate(`?${newParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <>
      <Helmet>
        <title>Home - Medicure Pharmacy</title>
      </Helmet>

      <style>{`
        .hover-banner {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .hover-banner:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .hover-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .hover-banner:hover::before {
          left: 100%;
        }
        
        .products-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
        }
        .products-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #007bff, transparent);
        }
        
        .product-grid {
          padding: 0 20px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .product-card-wrapper {
          padding: 15px;
          transition: all 0.3s ease;
        }
        .product-card-wrapper:hover {
          transform: translateY(-2px);
        }
        
        .pagination-wrapper {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          margin-top: 40px;
        }
        
        .pagination .page-item .page-link {
          color: #495057;
          border: 2px solid #e9ecef;
          margin: 0 3px;
          border-radius: 8px;
          padding: 12px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          background: white;
        }
        .pagination .page-item.active .page-link {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border-color: #007bff;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }
        .pagination .page-item .page-link:hover {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border-color: #007bff;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
        }
        .pagination .page-item.disabled .page-link {
          background: #f8f9fa;
          border-color: #e9ecef;
          color: #6c757d;
        }
        
        .section-header {
          position: relative;
          margin-bottom: 50px;
        }
        .section-header::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #007bff, #28a745);
          border-radius: 2px;
        }
        
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: linear-gradient(180deg, transparent, rgba(248, 249, 250, 0.8));
        }
        
        .banner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 20px;
          padding: 0 30px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .banner-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 0 20px;
          }
          .pagination .page-item .page-link {
            padding: 10px 12px;
            margin: 0 1px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="hero-section">
        <Carousel
          slide
          controls={false}
          indicators
          interval={3000}
          pause={false}
          style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: '-1rem',
          }}
        >
          {heroImages.map((imgSrc, idx) => (
            <Carousel.Item key={idx}>
              <div
                style={{
                  position: 'relative',
                  maxHeight: '55vh',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <img
                  src={imgSrc}
                  alt={`slide-${idx}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(1.1) contrast(1.05)',
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div
        style={{
          padding: '50px 0',
          backgroundColor: '#ffffff',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="banner-grid">
          {bannerData.map((banner) => (
            <div
              key={banner.id}
              onClick={() =>
                navigate(banner.category ? `/?category=${encodeURIComponent(banner.category)}` : '/')
              }
            >
              <div
                className="hover-banner"
                style={{
                  backgroundColor: banner.bgColor,
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: banner.textColor,
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundImage: banner.image ? `url(${banner.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${banner.bgColor}cc, ${banner.bgColor}99)`,
                    borderRadius: '20px',
                    zIndex: 1,
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h5 style={{ 
                    fontWeight: '700', 
                    marginBottom: '8px', 
                    fontSize: '1.1rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    {banner.title}
                  </h5>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="products-section"
        style={{
          padding: '80px 0',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        <Container fluid className="product-grid">
          <div className="section-header text-center">
            <h2 className="fw-bold mb-3" style={{ 
              fontSize: '3rem', 
              color: '#2c3e50',
              background: 'linear-gradient(135deg, #2c3e50, #3498db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {categoryFilter ? categoryFilter : 'All Products'}
            </h2>
            <p className="text-muted mb-4" style={{ 
              fontSize: '1.3rem', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '300'
            }}>
              Discover our comprehensive collection of premium healthcare products, 
              meticulously curated for your wellness journey.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '100px 0' }}>
              <LoadingBox />
            </div>
          ) : error ? (
            <div style={{ padding: '50px 0' }}>
              <MessageBox variant="danger">{error}</MessageBox>
            </div>
          ) : (
            <>
              <Row className="justify-content-center g-4">
                {currentProducts.map((product) => (
                  <Col key={product.slug} xs={1} sm={1} md={2} lg={3} xl={3} className="product-card-wrapper">
                    <Product product={product} addToCartHandler={() => addToCartHandler(product)} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <div className="pagination-wrapper">
                    <Pagination size="lg" className="mb-0">
                      <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                      {renderPagination()}
                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </div>

      <div
        style={{
          backgroundImage: `url('/images/pharma.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <Container>
          <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Why Choose Medicure?</h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>
            Trusted pharmacy with premium quality products, excellent customer service, 
            and fast, reliable delivery across Nepal.
          </p>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default HomeScreen;
