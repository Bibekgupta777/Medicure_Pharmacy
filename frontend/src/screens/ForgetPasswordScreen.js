import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Store } from '../Store';

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post('/api/users/forgot-password', { email });
      toast.success(data.message);
      setEmail('');
      setSubmitted(true); // Mark that user submitted the form
    } catch (err) {
      toast.error(err.response ? err.response.data.message : 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <Container
      className="small-container"
      style={{
        maxWidth: '450px',
        marginTop: '4rem',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <ToastContainer position="top-center" />
      <h1 className="mb-4 text-center" style={{ fontWeight: '700', color: '#333' }}>
        Forgot Password
      </h1>

      {!submitted ? (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label style={{ fontWeight: '600', fontSize: '1.1rem' }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ padding: '0.75rem', fontSize: '1rem' }}
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" disabled={loading} style={{ padding: '0.75rem', fontSize: '1.1rem' }}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem', color: '#555' }}>
          <p>
            We've sent a link to your email. Please check your inbox and click the link to be redirected to your profile page.
          </p>
        </div>
      )}
    </Container>
  );
}
