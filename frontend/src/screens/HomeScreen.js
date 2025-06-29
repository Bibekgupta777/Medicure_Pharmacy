import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Product from '../components/Product';
import { Store } from '../Store';

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
    '/images/herobanner.png',
    '/images/banner1.png',
    '/images/banner2.png',
    '/images/banner3.png',
    '/images/hero5.jpg',
  ];

  const bannerData = [
    { id: 1, title: 'MEGA SALE', subtitle: 'Up to 50% OFF', image: '/images/hero.jpeg', bgColor: '#ff4757', textColor: 'white' },
    { id: 2, title: 'Categories', subtitle: 'Browse All', image: '/images/cat.jpg', bgColor: '#3742fa', textColor: 'white' },
    { id: 3, title: 'Skin Care', subtitle: 'Premium Products', image: '/images/skin.jpg', bgColor: '#2ed573', textColor: 'white' },
    { id: 4, title: 'Vitamins', subtitle: 'Health Boost', image: '/images/vita.jpg', bgColor: '#ffa502', textColor: 'white' },
    { id: 5, title: 'Baby Care', subtitle: 'Gentle & Safe', image: '/images/baby.jpg', bgColor: '#ff6b9d', textColor: 'white' },
    { id: 6, title: 'Wellness', subtitle: 'Stay Healthy', image: '/images/wel.jpg', bgColor: '#7bed9f', textColor: 'white' },
  ];

  return (
    <>
      <Helmet>
        <title>Home - LifeCare Pharmacy</title>
      </Helmet>

      <style>{`
        .hover-banner {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .hover-banner:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>

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
                maxHeight: '50vh',
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
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div
        style={{
          padding: '40px 0',
          backgroundColor: '#ffffff',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '0 30px',
            maxWidth: '1800px',
            margin: '0 auto',
          }}
        >
          {bannerData.map((banner) => (
            <div key={banner.id} style={{ flex: '1 0 140px', maxWidth: '180px', margin: '10px' }}>
              <div
                className="hover-banner"
                style={{
                  backgroundColor: banner.bgColor,
                  borderRadius: '15px',
                  padding: '25px 15px',
                  textAlign: 'center',
                  color: banner.textColor,
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundImage: banner.image ? `url(${banner.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '15px',
                    zIndex: 1,
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h5 style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1rem' }}>{banner.title}</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{banner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '60px 0',
          backgroundColor: '#f8f9fa',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        <Container>
          <h2 className="text-center fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#333' }}>
            Our Products
          </h2>
          <p className="text-center text-muted mb-5" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Discover our wide range of quality tablets and medications, carefully selected for your health needs.
          </p>

          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row className="justify-content-center">
              {products.map((product) => (
                <Col key={product.slug} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4 d-flex justify-content-center">
                  <Product product={product} addToCartHandler={() => addToCartHandler(product)} />
                </Col>
              ))}
            </Row>
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
          <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Why Choose LifeCare?</h2>
          <p className="mb-5" style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            We provide the highest quality healthcare products at affordable prices. Licensed pharmacists ensure strict quality checks.
          </p>
          <Row>
            <Col md={4}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏥</div>
              <h4>Quality Assured</h4>
              <p>All products are sourced from certified manufacturers</p>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚚</div>
              <h4>Fast Delivery</h4>
              <p>Quick and reliable delivery to your doorstep</p>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💊</div>
              <h4>Expert Care</h4>
              <p>Professional guidance from licensed pharmacists</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default HomeScreen;
