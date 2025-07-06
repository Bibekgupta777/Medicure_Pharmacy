import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate("/payment");
  };

  useEffect(() => {
    ctxDispatch({ type: "SET_FULLBOX_OFF" });
  }, [ctxDispatch, fullBox]);

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>

      <div className="container small-container mt-4 shipping-container">
        <h1 className="text-center mb-1 fw-bold" style={{ color: "#2c3e50" }}>
          Shipping Address
        </h1>
        <p className="text-center text-success mb-4" style={{ fontSize: "1.1rem" }}>
          Fast & Secure Delivery Right To Your Doorstep!
        </p>

        <Form onSubmit={submitHandler} className="shipping-form">
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Street address, P.O. box, company name, c/o"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Enter your city"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              placeholder="Postal / ZIP code"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="Country name"
            />
          </Form.Group>

          <div className="mb-3">
            <Button
              id="chooseOnMap"
              type="button"
              variant="outline-success"
              onClick={() => navigate("/map")}
            >
              Choose Location On Map
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <div className="mt-2" style={{ fontWeight: "bold" }}>
                LAT: {shippingAddress.location.lat} | LNG: {shippingAddress.location.lng}
              </div>
            ) : (
              <div className="mt-2 text-muted">No location selected</div>
            )}
          </div>

          <div className="mb-3 d-grid">
            <Button variant="success" type="submit" size="lg">
              Continue to Payment
            </Button>
          </div>
        </Form>
      </div>

      {/* Banner at the bottom */}
      <div className="banner-section mt-5 mb-5 text-center p-4 rounded">
        <h2>Quality Medicines, Trusted Care</h2>
        <p>Your health is our top priority. Shop confidently with Medico Pharma!</p>
      </div>

      {/* Inline styles */}
      <style>{`
        .shipping-container {
          border: 2px solid #28a745;
          padding: 30px 25px;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 4px 18px rgba(40, 167, 69, 0.15);
          max-width: 600px;
          margin: 30px auto 20px;
        }
        .shipping-container .form-label {
          font-weight: 600;
          color: #1b4332;
        }
        .shipping-container .form-control:focus {
          border-color: #28a745;
          box-shadow: 0 0 6px #90ee90;
        }
        .shipping-form button#chooseOnMap {
          margin-bottom: 15px;
        }
        .banner-section {
          background: #28a745;
          color: #fff;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0 6px 15px rgba(40, 167, 69, 0.4);
        }
        .banner-section h2 {
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .banner-section p {
          font-size: 1.2rem;
          margin: 0;
        }
      `}
      
      </style>
      <Footer />
    </div>
  );
}
