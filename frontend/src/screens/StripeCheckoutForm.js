import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Footer from "../components/Footer";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#a0aec0",
      },
      padding: "12px 14px",
    },
    invalid: {
      color: "#e53e3e",
      iconColor: "#e53e3e",
    },
  },
  hidePostalCode: true,
};

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  // Get amount from location state, fallback to 1000 cents ($10)
  const amount = location.state?.amount || 1000;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardError, setCardError] = useState("");

  // Create PaymentIntent on component mount or amount change
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          "/api/payment/create-payment-intent",
          { amount, currency: "usd" },
          { withCredentials: true }
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        toast.error("Failed to initialize payment");
      }
    };
    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError("");

    if (!stripe || !elements) {
      return;
    }
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message);
        toast.error(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment succeeded!");
        // Redirect to placeorder screen or wherever you want
        navigate("/placeorder");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", justifyContent: "space-between" }}
    >
      <div
        className="container small-container mt-5 mb-5"
        style={{ maxWidth: "480px" }}
      >
        <CheckoutSteps step1 step2 step3 step4 />
        <h2
          className="text-center mb-4"
          style={{ fontWeight: "700", color: "#2c3e50" }}
        >
          Secure Payment
        </h2>
        <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="fw-semibold">Name on Card</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="fw-semibold">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group controlId="cardElement" className="mb-3">
            <Form.Label className="fw-semibold">Credit or Debit Card</Form.Label>
            <div
              style={{
                border: "1px solid #ced4da",
                borderRadius: "6px",
                padding: "10px 14px",
                backgroundColor: "#fafafa",
              }}
            >
              <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
            </div>
            {cardError && <div className="text-danger mt-2">{cardError}</div>}
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2"
            disabled={!stripe || loading}
            style={{ fontWeight: "600", fontSize: "1.1rem" }}
          >
            {loading ? "Processing..." : `Pay $${(amount / 1).toFixed(2)}`}
          </Button>
        </Form>
      </div>

      <footer style={{ marginTop: "auto" }}>
        <Footer />
      </footer>
    </div>
  );
}
