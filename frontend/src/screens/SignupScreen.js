import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Icon } from '@iconify/react';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: `url('/images/pharmacy.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Helmet>
        <title>Sign Up - Medicure</title>
      </Helmet>
      <Container
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '40px 30px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: '#000',
          border: '1px solid rgba(0, 0, 0, 0.15)',
          maxHeight: 'calc(100vh - 60px)',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: '700',
            fontSize: '2.5rem',
            letterSpacing: '1.5px',
            color: '#000',
          }}
        >
          Create Account
        </h2>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #ccc',
                color: '#000',
              }}
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #ccc',
                color: '#000',
              }}
            />
          </Form.Group>

          {/* Password Field */}
          <Form.Group controlId="password" className="mb-3" style={{ position: 'relative' }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #ccc',
                color: '#000',
                paddingRight: '40px',
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '40px',
                cursor: 'pointer',
              }}
            >
              <Icon
                icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                width="24"
                height="24"
                color="#666"
              />
            </span>
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group controlId="confirmPassword" className="mb-4" style={{ position: 'relative' }}>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #ccc',
                color: '#000',
                paddingRight: '40px',
              }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '40px',
                cursor: 'pointer',
              }}
            >
              <Icon
                icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'}
                width="24"
                height="24"
                color="#666"
              />
            </span>
          </Form.Group>

          <Button
            type="submit"
            style={{
              backgroundColor: '#28a745',
              border: 'none',
              width: '100%',
              fontWeight: '700',
              fontSize: '1.1rem',
              padding: '12px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: '15px',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#218838')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#28a745')
            }
          >
            Sign Up
          </Button>
        </Form>

        <div
          style={{
            fontSize: '1rem',
            color: '#333',
            textAlign: 'center',
          }}
        >
          Already have an account?{' '}
          <Link
            to={`/signin?redirect=${redirect}`}
            style={{ color: '#28a745', fontWeight: '600' }}
          >
            Sign In
          </Link>
        </div>
      </Container>
    </div>
  );
}
