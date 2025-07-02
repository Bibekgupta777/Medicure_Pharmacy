import React, { useContext, useState } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Footer from '../components/Footer';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import MessageBox from "../components/MessageBox";
import Form from "react-bootstrap/Form";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const [selectedItems, setSelectedItems] = useState(
    cartItems.map((item) => item._id) // default: all selected
  );

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
    setSelectedItems((prev) => prev.filter((id) => id !== item._id));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item._id)
  );

  const checkoutHandler = () => {
    if (selectedCartItems.length === 0) {
      window.alert("Please select at least one item to checkout.");
      return;
    }

    ctxDispatch({
      type: "CART_SET_SELECTED_ITEMS",
      payload: selectedCartItems,
    });

    navigate("/signin?redirect=/shipping");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1 }}>
        <Helmet>
          <title>Cart</title>
        </Helmet>

        {/* Banner Section */}
        <div
          className="cart-banner d-flex align-items-center justify-content-center"
          style={{
            backgroundImage: `url('/images/pharma.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "220px",
            color: "#fff",
            position: "relative",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6))",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "800px",
              padding: "0 20px",
            }}
          >
            <h1 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "10px" }}>
              Your Health, Our Priority
            </h1>
            <p style={{ fontSize: "1.25rem", fontWeight: "500", opacity: 0.9 }}>
              Quality medicines delivered safely to your doorstep. Shop with confidence.
            </p>
          </div>
        </div>

        <div className="container px-3 px-md-5">
          <h2 className="mb-4 d-flex align-items-center gap-3" style={{ fontWeight: "700" }}>
            <FontAwesomeIcon icon={faShoppingCart} size="lg" color="#f1c40f" />
            Your Cart
          </h2>

          <Row className="g-4">
            <Col md={8}>
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <MessageBox>
                    Your cart is empty.{" "}
                    <Link to="/" className="text-decoration-none text-warning fw-semibold">
                      Buy medicine
                    </Link>
                  </MessageBox>
                </div>
              ) : (
                <ListGroup>
                  {cartItems.map((item) => (
                    <ListGroup.Item
                      key={item._id}
                      className="mb-3 shadow-sm rounded p-3"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                          />
                        </Col>
                        <Col md={3}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: "100px", objectFit: "contain" }}
                          />
                        </Col>
                        <Col md={3}>
                          <Link
                            to={`/product/${item.slug}`}
                            className="fw-semibold text-dark text-decoration-none"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={2} className="d-flex align-items-center">
                          <Button
                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                            variant="outline-info"
                            disabled={item.quantity === 1}
                          >
                            −
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                            variant="outline-success"
                            disabled={item.quantity === item.countInStock}
                          >
                            +
                          </Button>
                        </Col>
                        <Col md={2}>
                          <strong>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </strong>
                        </Col>
                        <Col md={1}>
                          <Button
                            onClick={() => removeItemHandler(item)}
                            variant="outline-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>

            <Col md={4}>
              <Card className="shadow rounded p-4">
                <h3 className="mb-4 fw-bold text-center">
                  Subtotal ({selectedCartItems.reduce((a, c) => a + c.quantity, 0)} items)
                </h3>
                <h4 className="text-center text-success mb-4">
                  ₹{selectedCartItems
                    .reduce((a, c) => a + c.price * c.quantity, 0)
                    .toFixed(2)}
                </h4>
                <div className="d-grid">
                  <Button
                    type="button"
                    variant="warning"
                    size="lg"
                    onClick={checkoutHandler}
                    disabled={selectedCartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main>

      <Footer />

      <style>{`
        .btn:focus {
          outline: none;
          box-shadow: 0 0 0 0.3rem rgba(241, 196, 15, 0.5);
        }
        a:hover {
          color: #d4ac0d !important;
        }
      `}</style>
    </div>
  );
}
