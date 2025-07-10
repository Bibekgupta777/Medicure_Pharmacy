import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "250px",
  backgroundImage: "url('/images/faq.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  fontSize: "2.5rem",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
};

const containerStyle = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "0 20px",
  color: "#004225",
};

const questionStyle = {
  fontWeight: "700",
  marginTop: "20px",
};

const answerStyle = {
  marginTop: "8px",
  lineHeight: "1.6",
};

export default function FAQ() {
  return (
    <>
      <div style={bannerStyle}>Frequently Asked Questions</div>

      <main style={containerStyle}>
        <section>
          <div style={questionStyle}>Q1: What are your delivery hours?</div>
          <div style={answerStyle}>
            We deliver medicines from 8 AM to 8 PM every day, including weekends.
          </div>

          <div style={questionStyle}>Q2: Can I return a product?</div>
          <div style={answerStyle}>
            Yes, returns are accepted within 7 days of delivery in original packaging.
          </div>

          <div style={questionStyle}>Q3: How do I track my order?</div>
          <div style={answerStyle}>
            Use the tracking link sent to your email or visit your order history page.
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
