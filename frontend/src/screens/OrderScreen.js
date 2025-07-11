import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Footer from "../components/Footer";
import {
  FaShippingFast,
  FaLock,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const fetchOrder = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrder();
  }, [orderId, userInfo, navigate]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div style={pageContainer}>
      <Helmet>
        <title>Order #{orderId}</title>
      </Helmet>

      {/* Header Hero */}
      <section style={heroSection}>
        <h1>Order Details: #{orderId}</h1>
        <p>Review your shipping details and items below</p>
      </section>

      <Row style={{ maxWidth: 1000, margin: "auto" }} className="g-4">
        {/* Shipping Info */}
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={cardHeaderStyle}>Shipping Information</Card.Header>
            <Card.Body style={{ fontSize: 16, lineHeight: 1.5, color: "#444" }}>
              <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.shippingAddress.location && order.shippingAddress.location.lat && (
                <a
                  href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={mapLinkStyle}
                >
                  View on Google Maps
                </a>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Ordered Items */}
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={cardHeaderStyle}>Ordered Items</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id} style={listGroupItemStyle}>
                    <Row className="align-items-center">
                      <Col xs={3} sm={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={productImageStyle}
                        />
                      </Col>
                      <Col xs={5} sm={6}>
                        <Link to={`/product/${item.slug}`} style={productLinkStyle}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col xs={2} sm={1} style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>{item.quantity}</span>
                      </Col>
                      <Col xs={2} sm={2} style={{ textAlign: "right", fontWeight: "700" }}>
                        Rs{new Intl.NumberFormat("en-IN").format(item.price)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <section style={featuresSection}>
        <h2 style={featuresHeader}>Why Customers Love Us</h2>
        <Row className="g-4" style={{ maxWidth: 900, margin: "auto" }}>
          {features.map(({ icon, title, desc, img }, idx) => (
            <Col md={3} sm={6} key={idx}>
              <div
                style={{ ...featureCard, backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${img})` }}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                <div style={{ fontSize: 48, color: "#fff", marginBottom: 10 }}>{icon}</div>
                <h5 style={{ color: "#fff", fontWeight: 700 }}>{title}</h5>
                <p style={{ color: "#ddd", fontWeight: 500 }}>{desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <Footer />
    </div>
  );
}

// Styling

const pageContainer = {
  backgroundColor: "#fefefe",
  minHeight: "100vh",
  padding: "20px 10px 50px 10px",
  fontFamily: "'Poppins', sans-serif",
  color: "#222",
};

const heroSection = {
  maxWidth: 800,
  margin: "30px auto 50px",
  padding: "40px 30px",
  background: "linear-gradient(135deg, #0052cc, #00bfff)",
  borderRadius: 18,
  color: "#fff",
  textAlign: "center",
  boxShadow: "0 10px 35px rgba(0, 123, 255, 0.3)",
  userSelect: "none",
  fontWeight: 600,
};

const cardStyle = {
  borderRadius: 15,
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  border: "none",
  minHeight: 220,
};

const cardHeaderStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  borderRadius: "15px 15px 0 0",
  fontWeight: 700,
  fontSize: 20,
  textAlign: "center",
  padding: "15px",
};

const mapLinkStyle = {
  color: "#007bff",
  fontWeight: 600,
  textDecoration: "underline",
  cursor: "pointer",
};

const productImageStyle = {
  width: "100%",
  maxWidth: 80,
  borderRadius: 10,
  objectFit: "contain",
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
};

const productLinkStyle = {
  color: "#007bff",
  fontWeight: 600,
  textDecoration: "none",
};

const listGroupItemStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #eee",
};

const featuresSection = {
  marginTop: 60,
  padding: "50px 15px",
  backgroundColor: "#f8f9fa",
  borderRadius: 20,
  maxWidth: 1000,
  marginLeft: "auto",
  marginRight: "auto",
  userSelect: "none",
};

const featuresHeader = {
  fontWeight: 700,
  fontSize: 28,
  marginBottom: 40,
  color: "#222",
  textAlign: "center",
};

const featureCard = {
  borderRadius: 20,
  padding: 28,
  cursor: "pointer",
  boxShadow: "0 6px 22px rgba(0,0,0,0.1)",
  textAlign: "center",
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const hoverIn = (e) => {
  e.currentTarget.style.transform = "scale(1.06)";
  e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.3)";
};
const hoverOut = (e) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,0,0,0.1)";
};

const features = [
  {
    icon: <FaShippingFast />,
    title: "Fast Shipping",
    desc: "Quick delivery for all orders.",
    img: "/images/fast.jpg",
  },
  {
    icon: <FaLock />,
    title: "Secure Payment",
    desc: "Safe & encrypted checkout.",
    img: "/images/secure.jpg",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Always ready to help.",
    img: "/images/24.jpg",
  },
  {
    icon: <FaCheckCircle />,
    title: "Verified Orders",
    desc: "Trusted & quality checked.",
    img: "/images/quality.jpg",
  },
];
