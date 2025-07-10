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
import Form from "react-bootstrap/Form";
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
  
  // Track selected items - initialize all as selected
  const [selectedItems, setSelectedItems] = useState(
    cart.cartItems.map(item => item._id)
  );

  // Update selected items when cart changes
  useEffect(() => {
    setSelectedItems(cart.cartItems.map(item => item._id));
  }, [cart.cartItems]);

  // Handle item selection
  const handleItemSelect = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedItems(cart.cartItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  // Get only selected cart items
  const getSelectedCartItems = () => {
    return cart.cartItems.filter(item => selectedItems.includes(item._id));
  };

  const selectedCartItems = getSelectedCartItems();

  // Calculate prices ONLY for selected items
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    selectedCartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const discountPrice = round2(0.1 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice - discountPrice;

  // Clean orderItems before sending (remove any File objects) - ONLY selected items
  const cleanOrderItems = selectedCartItems.map((item) => {
    const cleanItem = { ...item };
    if (cleanItem.prescription && typeof cleanItem.prescription !== "string") {
      cleanItem.prescription = cleanItem.prescription.name || null;
    }
    return cleanItem;
  });

  const placeOrderHandler = async () => {
    if (selectedCartItems.length === 0) {
      toast.error("Please select at least one item to place order");
      return;
    }

    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cleanOrderItems, // Only selected items
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: itemsPrice, // Price of selected items only
          shippingPrice: shippingPrice,
          discountPrice: discountPrice,
          totalPrice: totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Remove ONLY selected items from cart
      const remainingItems = cart.cartItems.filter(item => !selectedItems.includes(item._id));
      
      // Update cart and localStorage with remaining items
      ctxDispatch({ type: "CART_CLEAR" });
      if (remainingItems.length > 0) {
        remainingItems.forEach(item => {
          ctxDispatch({ 
            type: "CART_ADD_ITEM", 
            payload: item 
          });
        });
        localStorage.setItem("cartItems", JSON.stringify(remainingItems));
      } else {
        localStorage.removeItem("cartItems");
      }

      dispatch({ type: "CREATE_SUCCESS" });
      setCreatedOrder(data.order);
      setShowModal(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const allSelected = selectedItems.length === cart.cartItems.length;
  const noneSelected = selectedItems.length === 0;

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

        {/* Items Selection and Order Summary */}
        <Row className="justify-content-center mb-5">
          {/* Cart Items Selection */}
          <Col md={6}>
            <Card
              style={{
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                borderRadius: "15px",
                marginBottom: "20px",
              }}
            >
              <Card.Header
                style={{
                  background: "#0072ff",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                Select Items ({selectedItems.length} of {cart.cartItems.length})
              </Card.Header>
              <Card.Body>
                <div style={{ marginBottom: "15px" }}>
                  <Form.Check
                    type="checkbox"
                    label="Select All Items"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ fontWeight: "bold" }}
                  />
                </div>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col xs={1}>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={(e) => handleItemSelect(item._id, e.target.checked)}
                          />
                        </Col>
                        <Col xs={2}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </Col>
                        <Col>
                          <div>
                            <strong>{item.name}</strong>
                            <br />
                            <span>Qty: {item.quantity} × ₹{item.price}</span>
                          </div>
                        </Col>
                        <Col xs={2} className="text-end">
                          <strong>₹{(item.quantity * item.price).toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
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
                      <Col>Items ({selectedCartItems.length})</Col>
                      <Col>₹{itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Delivery Charges</Col>
                      <Col>₹{shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Discount (10%)</Col>
                      <Col>-₹{discountPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total</strong>
                      </Col>
                      <Col>
                        <strong>₹{totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        variant="success"
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={noneSelected || loading}
                        style={{ padding: "14px", fontSize: "18px" }}
                      >
                        {loading ? "Placing..." : `Place Order (${selectedCartItems.length} items)`}
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
              <p><strong>Items Ordered:</strong> {createdOrder.orderItems.length}</p>

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

// Helper styles & hover functions
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