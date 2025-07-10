import Axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Footer from "../components/Footer";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";
import {
  FaShippingFast,
  FaLock,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [createdOrder, setCreatedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Calculate prices
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.discountPrice = round2(0.1 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice - cart.discountPrice;

  // Clean orderItems before sending (remove any File objects)
  const cleanOrderItems = cart.cartItems.map((item) => {
    // Copy item but remove prescription file object if exists
    const cleanItem = { ...item };
    if (cleanItem.prescription && typeof cleanItem.prescription !== "string") {
      // If prescription is a File object or anything else, replace with just name or null
      cleanItem.prescription =
        cleanItem.prescription.name || null;
    }
    return cleanItem;
  });

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cleanOrderItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          discountPrice: cart.discountPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");

      setCreatedOrder(data.order);
      setShowModal(true); // show modal on success
      toast.success("Order placed successfully!");
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/"); // navigate to home on modal close
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1, padding: "20px" }}>
        <Helmet>
          <title>Preview Order</title>
        </Helmet>

        {/* Hero Banner */}
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0, 114, 255, 0.8), rgba(0, 198, 255, 0.8)), url('/images/hero2.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            padding: "60px 20px",
            borderRadius: "15px",
            textAlign: "center",
            marginBottom: "40px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.5rem" }}>Ready to Place Your Order?</h1>
          <p style={{ marginTop: "10px", fontSize: "1.2rem" }}>
            We guarantee fast, safe, and reliable delivery!
          </p>
        </div>

        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

        {/* Order Summary */}
        <Row className="justify-content-center mb-5">
          <Col md={6}>
            <Card
              style={{
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                borderRadius: "15px",
              }}
            >
              <Card.Header
                style={{
                  background: "#0072ff",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "24px",
                  textAlign: "center",
                }}
              >
                Order Summary
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>₹{cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Delivery Charges</Col>
                      <Col>₹{cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Discount (10%)</Col>
                      <Col>-₹{cart.discountPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total</strong>
                      </Col>
                      <Col>
                        <strong>₹{cart.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        variant="success"
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0 || loading}
                        style={{ padding: "14px", fontSize: "18px" }}
                      >
                        {loading ? "Placing..." : "Place Order Now"}
                      </Button>
                    </div>
                    {loading && <LoadingBox />}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feature Section with BG Images */}
        <section
          style={{
            marginTop: "60px",
            padding: "60px 20px",
            background: "#f8f9fa",
            borderRadius: "20px",
          }}
        >
          <h2 className="text-center mb-5" style={{ fontWeight: "bold", fontSize: "2rem" }}>
            Why Shop With Us?
          </h2>
          <Row className="text-center g-4">
            <Col md={3} sm={6}>
              <div
                style={featureCardImageStyle("/images/fast.jpg")}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <FaShippingFast size={40} style={{ marginBottom: "10px" }} />
                <h5>Fast Delivery</h5>
                <p>Within 24–48 hours</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div
                style={featureCardImageStyle("/images/secure.jpg")}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <FaLock size={40} style={{ marginBottom: "10px" }} />
                <h5>Secure Payment</h5>
                <p>100% safe checkout</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div
                style={featureCardImageStyle("/images/24.jpg")}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <FaHeadset size={40} style={{ marginBottom: "10px" }} />
                <h5>24/7 Support</h5>
                <p>Always ready to help</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div
                style={featureCardImageStyle("/images/quality.jpg")}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <FaCheckCircle size={40} style={{ marginBottom: "10px" }} />
                <h5>Quality Assurance</h5>
                <p>Only genuine products</p>
              </div>
            </Col>
          </Row>
        </section>
      </main>

      <Footer />

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createdOrder && (
            <>
              <p><strong>Order ID:</strong> {createdOrder._id}</p>
              <p><strong>Date:</strong> {createdOrder.createdAt.substring(0, 10)}</p>
              <p><strong>Total Price:</strong> ₹{createdOrder.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {createdOrder.paymentMethod}</p>

              <p>
                <strong>Shipping Address:</strong><br />
                {createdOrder.shippingAddress.fullName}, {createdOrder.shippingAddress.address},<br />
                {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.postalCode},<br />
                {createdOrder.shippingAddress.country}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// Helper styles & hover functions (unchanged)
const featureCardImageStyle = (imgPath) => ({
  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imgPath}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: "30px 20px",
  borderRadius: "15px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  textAlign: "center",
});

const handleHoverIn = (e) => {
  e.currentTarget.style.transform = "scale(1.05)";
  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
};

const handleHoverOut = (e) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
};
