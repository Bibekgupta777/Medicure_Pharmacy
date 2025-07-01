import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const savedPhoto = localStorage.getItem('profilePhoto') || '';
  const savedPhone = localStorage.getItem('profilePhone') || '';
  const savedAddress = localStorage.getItem('profileAddress') || '';

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(savedPhone);
  const [address, setAddress] = useState(savedAddress);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(savedPhoto);
  const [darkMode, setDarkMode] = useState(false);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // Save phone/address locally
  useEffect(() => {
    localStorage.setItem('profilePhone', phone);
  }, [phone]);
  useEffect(() => {
    localStorage.setItem('profileAddress', address);
  }, [address]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const photoUploadHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
      localStorage.setItem('profilePhoto', reader.result);
      toast.success('Profile photo updated locally!');
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password, phone, address },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>User Profile</title>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
        <header className="page-header">
          <h1>Your Profile</h1>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="dark-mode-toggle"
            title="Toggle Dark Mode"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <div className="profile-card" role="main" tabIndex={-1}>
          <form onSubmit={submitHandler} className="profile-form" noValidate>
            <div className="left-column">
              <Form.Group controlId="name" className="form-group">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="form-input"
                  aria-describedby="nameHelp"
                />
                <Form.Text id="nameHelp" muted>
                  Your display name on your profile.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="email" className="form-group">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                  aria-describedby="emailHelp"
                />
                <Form.Text id="emailHelp" muted>
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="phone" className="form-group">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="form-input"
                  aria-describedby="phoneHelp"
                />
                <Form.Text id="phoneHelp" muted>
                  For order updates and delivery.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="address" className="form-group">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="form-input"
                  aria-describedby="addressHelp"
                />
                <Form.Text id="addressHelp" muted>
                  Your default shipping address.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="password" className="form-group">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="form-input"
                  aria-describedby="passwordHelp"
                />
                <Form.Text id="passwordHelp" muted>
                  Use a strong password to keep your account secure.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="form-group">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="form-input"
                />
              </Form.Group>

              <Button
                type="submit"
                className="btn-submit"
                disabled={loadingUpdate}
                aria-busy={loadingUpdate}
              >
                {loadingUpdate ? 'Updating...' : 'Save Changes'}
                <span className="shine-effect" aria-hidden="true" />
              </Button>
            </div>

            <div className="right-column">
              <div
                className="photo-wrapper"
                title="Click to upload profile photo"
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    document.getElementById('photo-upload').click();
                  }
                }}
              >
                <img
                  src={profilePhoto || '/images/default-user.png'}
                  alt="Profile"
                  className="profile-photo"
                />
                <label htmlFor="photo-upload" className="upload-label" tabIndex={-1}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    id="photo-upload"
                    onChange={photoUploadHandler}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="info-summary" aria-live="polite" aria-atomic="true">
                <h3>Current Info</h3>
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Phone:</strong> {phone || 'Not set'}
                </p>
                <p>
                  <strong>Address:</strong> {address || 'Not set'}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx="true">{`
        /* Google Font already loaded in Helmet */

        .profile-page {
          min-height: 100vh;
          background: var(--bg-light);
          padding: 60px 15px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-dark);
          animation: fadeIn 0.8s ease forwards;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        :root {
          --blue-primary: #2563eb;
          --blue-dark: #1e40af;
          --bg-light: #f9fafb;
          --bg-dark: #121212;
          --text-dark: #222;
          --text-light: #ddd;
          --shadow: rgba(0, 0, 0, 0.12);
        }

        .dark {
          --bg-light: var(--bg-dark);
          --text-dark: var(--text-light);
          --shadow: rgba(255, 255, 255, 0.15);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header {
          width: 100%;
          max-width: 900px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          user-select: none;
        }
        .page-header h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
          letter-spacing: 1.3px;
        }

        .dark-mode-toggle {
          background: none;
          border: 2px solid var(--blue-primary);
          color: var(--blue-primary);
          font-weight: 700;
          font-size: 1.1rem;
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        .dark-mode-toggle:hover,
        .dark-mode-toggle:focus {
          background-color: var(--blue-primary);
          color: white;
          outline: none;
        }

        .profile-card {
          background: white;
          max-width: 900px;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 14px 35px var(--shadow);
          padding: 40px 50px;
          display: flex;
          gap: 40px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .dark .profile-card {
          background: #1e1e1e;
          box-shadow: 0 14px 35px var(--shadow);
        }

        form.profile-form {
          flex: 1;
          display: flex;
          gap: 40px;
        }

        .left-column {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .right-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          justify-content: flex-start;
          color: var(--text-dark);
        }
        .dark .right-column {
          color: var(--text-light);
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-dark);
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }
        .dark .form-group label {
          color: var(--text-light);
        }

        .form-input {
          padding: 14px 18px;
          font-size: 1rem;
          border-radius: 12px;
          border: 1.8px solid #cbd5e1;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          outline-offset: 2px;
          background-color: white;
          color: #222;
        }
        .dark .form-input {
          background-color: #2a2a2a;
          color: var(--text-light);
          border-color: #555;
        }
        .form-input:focus {
          border-color: var(--blue-primary);
          box-shadow: 0 0 10px var(--blue-primary);
          outline: none;
        }

        .btn-submit {
          margin-top: 10px;
          padding: 16px 0;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 1.3rem;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 100%;
          transition: box-shadow 0.3s ease;
          user-select: none;
        }
        .btn-submit:hover:not(:disabled),
        .btn-submit:focus:not(:disabled) {
          box-shadow: 0 0 25px #3b82f6;
          outline: none;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 2.5s infinite;
          pointer-events: none;
          border-radius: 14px;
        }

        @keyframes shine {
          0% {
            left: -75%;
          }
          100% {
            left: 125%;
          }
        }

        .photo-wrapper {
          position: relative;
          cursor: pointer;
          user-select: none;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          box-shadow: 0 15px 40px rgba(37, 99, 235, 0.3);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .photo-wrapper:hover,
        .photo-wrapper:focus-within {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(37, 99, 235, 0.6);
          outline: none;
        }

        .profile-photo {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          object-fit: cover;
          border: 6px solid var(--blue-primary);
          display: block;
          user-select: none;
        }

        .upload-label {
          margin-top: 14px;
          display: inline-block;
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--blue-primary);
          cursor: pointer;
          padding: 10px 22px;
          border-radius: 28px;
          border: 2px solid var(--blue-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        .upload-label:hover,
        .upload-label:focus {
          background-color: var(--blue-primary);
          color: white;
          outline: none;
        }

        .info-summary {
          background: #e0e7ff;
          border-radius: 14px;
          padding: 20px 28px;
          width: 100%;
          font-weight: 600;
          color: var(--blue-primary);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.15);
          user-select: none;
          text-align: left;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .dark .info-summary {
          background: #2c2c54;
          color: #8ab4f8;
          box-shadow: 0 6px 18px rgba(138, 180, 248, 0.3);
        }
        .info-summary h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.3rem;
        }
        .info-summary p {
          margin: 8px 0;
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .profile-card {
            flex-direction: column;
            padding: 35px 30px;
            gap: 35px;
          }
          form.profile-form {
            flex-direction: column;
            gap: 35px;
          }
          .right-column {
            width: 100%;
            align-items: center;
          }
          .photo-wrapper {
            width: 180px;
            height: 180px;
          }
          .profile-photo {
            width: 180px;
            height: 180px;
            border-width: 5px;
          }
        }

        @media (max-width: 400px) {
          .page-header h1 {
            font-size: 2.2rem;
          }
          .btn-submit {
            font-size: 1.1rem;
            padding: 14px 0;
          }
          .upload-label {
            font-size: 1rem;
            padding: 8px 18px;
          }
        }
      `}</style>
    </>
  );
};

export default ProfileScreen;
