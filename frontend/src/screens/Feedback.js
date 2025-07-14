import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
    setLoading(false);
  };

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'Once your order is dispatched, you will receive a tracking number via SMS and email to track delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 7 days if the product is unused and in original packaging.',
    },
    {
      question: 'Do you offer nationwide delivery?',
      answer: 'Yes, we provide fast and reliable delivery service across Nepal.',
    },
    {
      question: 'Can I talk to a pharmacist?',
      answer: 'Absolutely. Our licensed pharmacists are available during business hours to assist you.',
    },
  ];

  return (
    <section style={{ backgroundColor: '#f7fafc' }}>
      {/* Toast Notification */}
      <ToastContainer position="bottom-center" hideProgressBar={false} />

      {/* Banner */}
      <div style={{
        backgroundImage: 'url("/images/hero4.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 1rem',
        textAlign: 'center',
        color: '#1a202c'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Contact Us</h1>
        <p style={{ fontSize: '1.1rem' }}>We’re here to help. Reach out with any questions or feedback.</p>
      </div>

      {/* Contact Form & Info */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={styles.gridContainer}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.sectionTitle}>Send us a message</h2>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required style={styles.input} />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={styles.input} />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" style={styles.input} />
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" style={styles.input} />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="5" required style={styles.textarea}></textarea>
            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: loading ? '#63b3ed' : '#3182ce',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Info */}
          <div style={styles.contactInfo}>
            <h2 style={styles.sectionTitle}>Contact Details</h2>
            <div style={styles.infoRow}>
              <Icon icon="ic:baseline-phone" color="#3182ce" width="24" />
              <span>+977 9829229020</span>
            </div>
            <div style={styles.infoRow}>
              <Icon icon="mdi:email" color="#3182ce" width="24" />
              <span>info@medicure.com.np</span>
            </div>
            <div style={styles.infoRow}>
              <Icon icon="ion:location-sharp" color="#3182ce" width="24" />
              <span>Baneshwor, Kathmandu</span>
            </div>
            <h4 style={{ marginTop: '2rem', fontSize: '1.2rem' }}>Follow Us</h4>
            <div style={styles.socialIcons}>
              <a href="https://facebook.com/" target="_blank" rel="noreferrer"><Icon icon="logos:facebook" width="28" /></a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer"><Icon icon="mdi:twitter" width="28" /></a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer"><Icon icon="skill-icons:instagram" width="28" /></a>
              <a href="https://github.com/" target="_blank" rel="noreferrer"><Icon icon="mdi:github" width="28" /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer"><Icon icon="mdi:linkedin" width="28" /></a>
            </div>
          </div>
        </div>

        {/* MAP Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={styles.sectionTitle}>Our Location</h2>
          <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <iframe
              title="Our Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.335%2C27.687%2C85.345%2C27.697&layer=mapnik&marker=27.692%2C85.340"
              style={{ width: '100%', height: '400px', border: 'none' }}
              allowFullScreen
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              onMouseEnter={() => setOpenFAQ(index)}
              onMouseLeave={() => setOpenFAQ(null)}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '1rem',
                padding: '1rem',
                cursor: 'pointer',
                boxShadow: openFAQ === index ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                transition: 'box-shadow 0.3s',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>{faq.question}</h4>
              <div
                style={{
                  maxHeight: openFAQ === index ? '200px' : '0',
                  opacity: openFAQ === index ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease, opacity 0.4s ease',
                  color: '#4a5568',
                }}
              >
                <p style={{ margin: 0 }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

// Styles
const styles = {
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#2d3748',
  },
  form: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  contactInfo: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#fefefe',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#4a5568',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
};

export default ContactUs;
