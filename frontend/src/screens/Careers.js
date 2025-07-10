import React from "react";
import Footer from "../components/Footer";

const bannerStyle = {
  width: "100%",
  height: "250px",
  backgroundImage: "url('/images/career.webp')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "2.5rem",
  fontWeight: "700",
  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
};

const containerStyle = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "0 20px",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const listItemStyle = {
  padding: "12px 20px",
  backgroundColor: "#f0f9f4",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "transform 0.3s ease, background-color 0.3s ease",
};

const linkStyle = {
  color: "#007b4f",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.3s ease",
};

const listItemHover = {
  backgroundColor: "#007b4f",
  color: "#fff",
  transform: "scale(1.03)",
};

export default function Careers() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const jobs = [
    "Pharmacist",
    "Customer Service Representative",
    "Warehouse Manager",
  ];

  return (
    <>
      <div style={bannerStyle}>Join Our Team</div>

      <main style={containerStyle}>
        <section>
          <h2 style={{ marginBottom: "16px", color: "#004225" }}>
            Current Job Openings
          </h2>
          <ul style={listStyle}>
            {jobs.map((job, index) => (
              <li
                key={index}
                style={
                  hoveredIndex === index
                    ? { ...listItemStyle, ...listItemHover }
                    : listItemStyle
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {job}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "24px", fontSize: "1.1rem" }}>
            Interested? Send your resume and cover letter to{" "}
            <a href="mailto:careers@medicure.com" style={linkStyle}>
              careers@medicure.com
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
