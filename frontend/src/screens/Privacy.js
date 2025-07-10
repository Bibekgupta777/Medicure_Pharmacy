import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "280px",
  backgroundImage: "url('/images/privacy.webp')",
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

const emphasisStyle = {
  fontWeight: "700",
  color: "#007b4f",
};

export default function Privacy() {
  return (
    <>
      <div style={bannerStyle}>Privacy Policy</div>

      <main style={containerStyle}>
        <p>
          Your privacy is important to us. We collect only necessary personal information for processing orders and improving our services.
        </p>
        <p>
          <span style={emphasisStyle}>We never share your data</span> with third parties except when required by law or for order fulfillment purposes.
        </p>
        <p>
          If you have questions about your privacy or data security, please contact our support team.
        </p>
      </main>

      <Footer />
    </>
  );
}
