import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "280px",
  backgroundImage: "url('/images/terms.jpg')",
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

const sectionTitleStyle = {
  marginBottom: "16px",
  fontWeight: "700",
  fontSize: "1.5rem",
  color: "#007b4f",
};

export default function Terms() {
  return (
    <>
      <div style={bannerStyle}>Terms & Conditions</div>

      <main style={containerStyle}>
        <section>
          <h2 style={sectionTitleStyle}>Acceptance of Terms</h2>
          <p>
            By using Medicure Pharmacy's website and services, you agree to the terms and conditions outlined here. Please read them carefully.
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Policy Changes</h2>
          <p>
            We reserve the right to modify policies at any time without prior notice. Continued use of the site means acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Legal</h2>
          <p>
            For detailed legal information or inquiries, please contact our support team.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
