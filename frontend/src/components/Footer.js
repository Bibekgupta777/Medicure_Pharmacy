import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* Gradient blend from banner to footer */}
      <div
        style={{
          height: "80px",
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), #004225)",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      ></div>

      <footer
        style={{
          backgroundColor: "#004225",
          color: "#fff",
          paddingTop: "40px",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px 40px",
          }}
        >
          {/* Company */}
          <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
            <h3 style={headingStyle}>Company</h3>
            <ul style={listStyle}>
              <li><a href="/about" style={linkStyle}>About Us</a></li>
              <li><a href="/careers" style={linkStyle}>Careers</a></li>
              <li><a href="/terms" style={linkStyle}>Terms & Conditions</a></li>
              <li><a href="/privacy" style={linkStyle}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
            <h3 style={headingStyle}>Customer Support</h3>
            <ul style={listStyle}>
              <li><a href="/contact" style={linkStyle}>Contact Us</a></li>
              <li><a href="/faq" style={linkStyle}>FAQ</a></li>
              <li><a href="/returns" style={linkStyle}>Return Policy</a></li>
              <li><a href="/shipping" style={linkStyle}>Shipping Info</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
            <h3 style={headingStyle}>Contact Us</h3>
            <p style={textStyle}>
              Email: <a href="mailto:medicure@gmail.com" style={linkStyle}>medicure@gmail.com</a>
            </p>
            <p style={textStyle}>Phone: +977 9829229020</p>
            <p style={textStyle}>Birgunj, Nepal</p>
          </div>

          {/* Social Media */}
          <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
            <h3 style={headingStyle}>Follow Us</h3>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                <FaInstagram size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            padding: "15px 20px",
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          &copy; {new Date().getFullYear()} Medicure. All rights reserved.
        </div>
      </footer>
    </>
  );
};

// 🔧 Shared Styles
const headingStyle = {
  fontSize: "18px",
  marginBottom: "15px",
};

const linkStyle = {
  color: "#ccc",
  textDecoration: "none",
  transition: "color 0.3s",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  lineHeight: "28px",
};

const iconStyle = {
  color: "#fff",
  transition: "transform 0.3s, color 0.3s",
};

const textStyle = {
  margin: "8px 0",
};

export default Footer;
