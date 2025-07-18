import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Axios from 'axios';
import { Icon } from '@iconify/react';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post('/api/users/signin', {
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

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
      }}
    >
      <Container
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '40px 30px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: '#000000',
          border: '1px solid rgba(0, 0, 0, 0.15)',
          maxHeight: 'calc(100vh)',
          overflowY: 'auto',
        }}
      >
        <Helmet>
          <title>Sign In - Medicure</title>
        </Helmet>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: '700',
            fontSize: '2.5rem',
            letterSpacing: '1.5px',
            color: '#000000',
          }}
        >
          Sign In
        </h1>
        <Form onSubmit={submitHandler}>
          {/* Email Field */}
          <Form.Group controlId="email" className="mb-3">
            <Form.Label style={{ color: '#000' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
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

          {/* Password Field with Show/Hide */}
          <Form.Group controlId="password" className="mb-4" style={{ position: 'relative' }}>
            <Form.Label style={{ color: '#000' }}>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
            Sign In
          </Button>
        </Form>

        <div
          style={{
            fontSize: '1rem',
            color: '#333',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          New customer?{' '}
          <Link
            to={`/signup?redirect=${redirect}`}
            style={{ color: '#28a745', fontWeight: '600' }}
          >
            Create your account
          </Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/forget-password"
            style={{ color: '#28a745', fontWeight: '600' }}
          >
            Forgot Password? Reset Password
          </Link>
        </div>
      </Container>
    </div>
  );
}
