import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CheckoutSteps from "../components/CheckoutSteps";
import Footer from '../components/Footer';
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "COD"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    if (paymentMethodName === "COD") {
      navigate("/placeorder");
    } else {
      navigate("/payment/stripe");
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>

      <div className="container small-container payment-container">
        <h1 className="text-center mb-4 fw-bold" style={{ color: "#2c3e50" }}>
          Select Payment Method
        </h1>
        <p className="text-center text-success mb-4" style={{ fontSize: "1.1rem" }}>
          Secure & Fast — Choose what works best for you!
        </p>

        <Form onSubmit={submitHandler} className="payment-form">
          <div className="mb-4">
            <Form.Check
              type="radio"
              id="online"
              label="Online Payment (Stripe)"
              value="Online"
              checked={paymentMethodName === "Online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-option"
            />
          </div>

          <div className="mb-4">
            <Form.Check
              type="radio"
              id="cod"
              label="Cash on Delivery"
              value="COD"
              checked={paymentMethodName === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-option"
            />
          </div>

          <div className="mb-3 d-grid">
            <Button variant="success" type="submit" size="lg">
              Continue
            </Button>
          </div>
        </Form>
      </div>

      <div className="payment-banner mt-5 mb-5 text-center p-4 rounded">
        <h2>Easy Payments, Happy Shopping!</h2>
        <p>Enjoy smooth checkout and secure transactions with Medico Pharma.</p>
      </div>

      <style>{`
        .payment-container {
          border: 2px solid #28a745;
          padding: 30px 30px;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 4px 20px rgba(40, 167, 69, 0.15);
          max-width: 600px;
          margin: 30px auto;
        }
        .payment-option {
          font-size: 1.1rem;
          font-weight: 500;
          padding: 10px;
          border: 1px solid #28a745;
          border-radius: 8px;
          background: #f9fff9;
          cursor: pointer;
        }
        .payment-option input {
          margin-right: 10px;
        }
        .payment-form button {
          background: #28a745;
          border: none;
        }
        .payment-banner {
          background: #28a745;
          color: #fff;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0 6px 15px rgba(40, 167, 69, 0.4);
        }
        .payment-banner h2 {
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .payment-banner p {
          font-size: 1.2rem;
          margin: 0;
        }
      `}</style>
      <Footer />
    </div>
  );
}
