import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "280px",
  backgroundImage: "url('/images/shipping.webp')",
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

const listStyle = {
  marginLeft: "20px",
  marginTop: "12px",
};

const listItemStyle = {
  marginBottom: "8px",
};

export default function ShippingInfo() {
  return (
    <>
      <div style={bannerStyle}>Shipping Information</div>

      <main style={containerStyle}>
        <p>
          We offer fast and reliable shipping across Nepal. Orders placed before <strong>2 PM</strong> are shipped the same day.
        </p>
        <p>Shipping details include:</p>
        <ul style={listStyle}>
          <li style={listItemStyle}>Shipping costs depend on your location and order size.</li>
          <li style={listItemStyle}>Tracking information will be emailed once your order is dispatched.</li>
          <li style={listItemStyle}>Delivery times typically range from 1-3 business days depending on your location.</li>
        </ul>
        <p>
          If you have any questions about shipping, feel free to contact our support team.
        </p>
      </main>

      <Footer />
    </>
  );
}
