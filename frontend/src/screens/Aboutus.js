import React from 'react';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';

const Aboutus = () => {
  return (
    <>
      {/* Banner Section with Background Image */}
      <div
        style={{
          backgroundImage: 'url("/images/about.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 0',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <h2 style={{ fontSize: '36px', fontWeight: '700',color:'black' }}>About MediCare Nepal</h2>
        <p style={{ fontSize: '18px', marginTop: '10px',color:'black' }}>
          Your trusted partner in healthcare, delivering quality medical and surgical supplies across Nepal.
        </p>
      </div>

      <Container style={{ maxWidth: '960px', margin: 'auto', padding: '40px 20px' }}>
        {/* Our Story */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a', marginBottom: '20px' }}>Our Story</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333' }}>
            Founded in 2010, MediCare Nepal began with a simple mission: to provide access to high-quality
            medical and surgical supplies to all Nepalese citizens, regardless of their location. Our founders,
            a team of healthcare professionals and business experts, recognized the challenges many faced in
            accessing essential healthcare products, especially in remote areas.
            <br /><br />
            What started as a small operation in Kathmandu has now grown into one of Nepal's leading medical
            supply companies, with a reputation for excellence and customer satisfaction. We’re proud to have built a
            team that is passionate, caring, and dedicated to reliable service.
            <br /><br />
            Today, we continue to expand our product range and delivery network. Always staying true to our
            core values and mission of improving healthcare accessibility across Nepal.
          </p>
        </section>

        {/* Core Values with Colored Hover Boxes */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a', marginBottom: '30px', textAlign: 'center' }}>Our Core Values</h3>
          <div className="row text-center">
            {[
              { title: 'Quality Assurance', desc: 'We never compromise on quality. All our products are sourced from reputable manufacturers and undergo strict quality checks.' },
              { title: 'Customer Care', desc: 'We place our customers at the heart of everything we do, offering personalized service and expert guidance.' },
              { title: 'Integrity', desc: 'We operate with honesty and transparency in all our dealings, earning the trust of our customers and partners.' },
              { title: 'Innovation', desc: 'We continuously seek better ways to serve our customers, embracing new technologies and healthcare solutions.' },
            ].map((val, i) => (
              <div className="col-md-3 col-sm-6 mb-4" key={i}>
                <div
                  className="core-value-box"
                  style={{
                    backgroundColor: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '10px',
                    minHeight: '220px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <h5 style={{ fontWeight: '700', color: '#0f5132' }}>{val.title}</h5>
                  <p style={{ fontSize: '15px', color: '#555' }}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Team with Photos */}
        <section style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a', marginBottom: '30px' }}>Our Leadership Team</h3>
          <div className="row justify-content-center">
            {[
              { name: 'Binod Khedka', role: 'Director', img: '/images/binod.png' },
              { name: 'Bibek Kumar', role: 'CEO', img: '/images/bibek.jpg' },
              { name: 'Rijan Prajapati', role: 'Developer', img: '/images/rijan.png' },
            ].map((member, i) => (
              <div className="col-sm-4 mb-4" key={i}>
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '10px',
                  }}
                />
                <h5 style={{ fontWeight: '600', color: '#000' }}>{member.name}</h5>
                <p style={{ color: '#555' }}>{member.role}</p>
              </div>
            ))}
          </div>
          <p style={{ maxWidth: '600px', margin: 'auto', color: '#555' }}>
            Our team combines expertise in healthcare, logistics, and customer service to ensure we deliver the best possible experience to our customers.
          </p>
        </section>

        {/* Certifications */}
        <section style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a', marginBottom: '30px' }}>Our Certifications</h3>
          <p style={{ color: '#555', marginBottom: '20px' }}>We adhere to the highest standards in the industry, with all necessary certifications and compliance measures in place.</p>
          <div className="d-flex justify-content-center flex-wrap gap-4">
            <img src="/images/banner1.png" alt="Cert 1" style={{ maxHeight: '120px' }} />
            <img src="/images/banner1.png" alt="Cert 2" style={{ maxHeight: '120px' }} />
            <img src="/images/banner1.png" alt="Cert 3" style={{ maxHeight: '120px' }} />
          </div>
        </section>
      </Container>

      <Footer />

      {/* Hover Effect CSS */}
      <style>{`
        .core-value-box:hover {
          background-color: #dbeafe;
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
};

export default Aboutus;
