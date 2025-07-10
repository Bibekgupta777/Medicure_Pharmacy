import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "280px",
  backgroundImage: "url('/images/return.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "3rem",
  fontWeight: "700",
  textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
};

const containerStyle = {
  maxWidth: "850px",
  margin: "40px auto 80px",
  backgroundColor: "#f9fefb",
  padding: "40px 30px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 66, 37, 0.15)",
  color: "#004225",
  fontSize: "1.15rem",
  lineHeight: 1.7,
};

const highlightStyle = {
  color: "#007b4f",
  fontWeight: "700",
};

const linkStyle = {
  color: "#007b4f",
  textDecoration: "none",
  transition: "color 0.3s",
};

export default function Returns() {
  return (
    <>
      <div style={bannerStyle}>Return Policy</div>

      <main style={containerStyle}>
        <p>
          We accept returns within <span style={highlightStyle}>7 days</span> of delivery, provided the product is unopened and in its original packaging.
        </p>
        <p>
          To initiate a return, please contact our customer support with your order number and reason for return. You can email us at{" "}
          <a href="mailto:support@medicure.com" style={linkStyle} onMouseEnter={e => (e.target.style.color = "#004225")} onMouseLeave={e => (e.target.style.color = "#007b4f")}>
            support@medicure.com
          </a>.
        </p>
        <p>
          Refunds will be processed within 5-7 business days after we receive the returned item. Shipping costs are non-refundable.
        </p>
      </main>

      <Footer />
    </>
  );
}
