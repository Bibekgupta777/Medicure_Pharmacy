import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import StripeCheckoutForm from "./screens/StripeCheckoutForm";
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import Aboutus from './screens/Aboutus';
import Feedback from './screens/Feedback';
import MessageListScreen from './screens/AdminMessagesScreen';
import BandProductPrescriptionScreen from './screens/BandProductPrescriptionScreen'; // NEW SCREEN

// New professional pages imports
import Careers from './screens/Careers';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import FAQ from './screens/FAQ';
import Returns from './screens/Returns';
import ShippingInfo from './screens/ShippingInfo';

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51R3qvbJ8hHU1KUt5dEQTr5HLlPrd0wKpnDujH4XIy6kaU3LMkzTnOZbCF6rxWtATYQQ6F5e2oayDYsQSMTJWocj500Cvyp5WBn');

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    ctxDispatch({ type: 'CART_RESET' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          gap: "0"
        }}
        className={
          sidebarIsOpen
            ? 'site-container active-cont d-flex flex-column'
            : 'site-container d-flex flex-column m-0'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar
            className="fixed-top"
            style={{
              backgroundColor: 'lightblue',
              minHeight: '110px',
              zIndex: 1000,
              margin: "0",
              padding: "0"
            }}
            variant="light"
            expand="lg"
          >
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    src="/images/logo.png"
                    alt=""
                    style={{ width: '70px', height: 'auto' }}
                  />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <div className="d-flex flex-grow-1 justify-content-center">
                  <div style={{ width: '400px' }}>
                    <SearchBox />
                  </div>
                </div>

                {userInfo && userInfo.isAdmin ? (
                  <Nav
                    className="me-auto w-100 justify-content-end"
                    style={{ gap: '1rem' }}
                  >
                    <LinkContainer to="/">
                      <Nav.Link className="text-black">Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/admin/dashboard">
                      <Nav.Link className="text-black">Dashboard</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <Nav.Link className="text-black">Medicine</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <Nav.Link className="text-black">Orders</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <Nav.Link className="text-black">Users</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/admin/messages">
                      <Nav.Link className="text-black">Contact</Nav.Link>
                    </LinkContainer>

                    {/* NEW BAND PRODUCT LINK */}
                    <LinkContainer to="/admin/prescriptions">
                      <Nav.Link className="text-black">Band Product</Nav.Link>
                    </LinkContainer>

                    <NavDropdown
                      title={
                        <>
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{
                              marginRight: '5px',
                              color: '#000',
                              fontSize: '20px',
                            }}
                          />
                          {userInfo.name}
                        </>
                      }
                      id="admin-nav-dropdown"
                    >
                      <LinkContainer to="/">
                        <NavDropdown.Item className="text-black">
                          Home
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item className="text-black">
                          User Profile
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        onClick={signoutHandler}
                        style={{ color: '#e74c3c', fontWeight: 'bold' }}
                      >
                        Sign Out
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                ) : userInfo ? (
                  <Nav
                    className="mx-auto align-items-center"
                    style={{ gap: '1rem' }}
                  >
                    <LinkContainer to="/">
                      <Nav.Link className="text-black">Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/aboutus">
                      <Nav.Link className="text-black">About Us</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/feedback">
                      <Nav.Link className="text-black">Contact Us</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <Nav.Link className="text-black">Order History</Nav.Link>
                    </LinkContainer>
                    <Link
                      to="/cart"
                      className="nav-link text-black"
                      style={{ position: 'relative' }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                      {cart.cartItems.length > 0 && (
                        <Badge
                          pill
                          bg="danger"
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            fontSize: '0.7rem',
                          }}
                        >
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                      )}
                    </Link>
                    <NavDropdown
                      title={
                        <FontAwesomeIcon
                          icon={faUser}
                          size="lg"
                          style={{ color: '#000' }}
                        />
                      }
                      id="user-nav-dropdown"
                      align="end"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item className="text-black">
                          User Profile
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        onClick={signoutHandler}
                        style={{ color: '#e74c3c', fontWeight: 'bold' }}
                      >
                        Sign Out
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                ) : (
                  <Nav
                    className="mx-auto align-items-center"
                    style={{ gap: '0.5rem' }}
                  >
                    <LinkContainer to="/">
                      <Nav.Link className="text-black">Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/aboutus">
                      <Nav.Link className="text-black">About Us</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/feedback">
                      <Nav.Link className="text-black">Contact Us</Nav.Link>
                    </LinkContainer>
                    <Link className="nav-link text-black" to="/signin">
                      Sign In
                    </Link>
                  </Nav>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <main style={{ paddingTop: '111px' }}>
          <Container fluid className="p-0 m-0">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/forget-password" element={<ForgetPasswordScreen />} />
              <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/aboutus" element={<Aboutus />} />

              {/* Added new pages */}
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shippinginfo" element={<ShippingInfo />} />

              <Route
                path="/payment/stripe"
                element={
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm />
                  </Elements>
                }
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>}
              />
              <Route
                path="/map"
                element={<ProtectedRoute><MapScreen /></ProtectedRoute>}
              />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={<ProtectedRoute><OrderScreen /></ProtectedRoute>}
              />
              <Route
                path="/orderhistory"
                element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard"
                element={<AdminRoute><DashboardScreen /></AdminRoute>}
              />
              <Route
                path="/admin/orders"
                element={<AdminRoute><OrderListScreen /></AdminRoute>}
              />
              <Route
                path="/admin/users"
                element={<AdminRoute><UserListScreen /></AdminRoute>}
              />
              <Route
                path="/admin/products"
                element={<AdminRoute><ProductListScreen /></AdminRoute>}
              />
              <Route
                path="/admin/product/:id"
                element={<AdminRoute><ProductEditScreen /></AdminRoute>}
              />
              <Route
                path="/admin/user/:id"
                element={<AdminRoute><UserEditScreen /></AdminRoute>}
              />
              <Route
                path="/admin/messages"
                element={<AdminRoute><MessageListScreen /></AdminRoute>}
              />

              {/* New Band Product Prescriptions Route */}
              <Route
                path="/admin/prescriptions"
                element={<AdminRoute><BandProductPrescriptionScreen /></AdminRoute>}
              />
            </Routes>
          </Container>
        </main>
        <footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
