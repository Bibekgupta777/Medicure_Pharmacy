import React, { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, prescriptions: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function BandProductPrescriptionScreen() {
  const [{ loading, error, prescriptions }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    prescriptions: [],
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/prescriptions', {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // <-- important
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.response && err.response.data.message ? err.response.data.message : err.message });
      }
    };
    if (userInfo && userInfo.token) {
      fetchPrescriptions();
    }
  }, [userInfo]);

  if (!userInfo) {
    return <MessageBox variant="danger">You must be logged in to view this page.</MessageBox>;
  }

  return (
    <div className="container small-container">
      <h1>Band Product Prescriptions</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : prescriptions.length === 0 ? (
        <MessageBox>No prescriptions found.</MessageBox>
      ) : (
        <ul>
          {prescriptions.map((p) => (
            <li key={p._id}>
              <p><strong>Order ID:</strong> {p.orderId}</p>
              <p><strong>User:</strong> {p.userName}</p>
              <p><strong>Product:</strong> {p.productName}</p>
              <p><strong>Prescription:</strong> <a href={p.prescriptionUrl} target="_blank" rel="noreferrer">View</a></p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
