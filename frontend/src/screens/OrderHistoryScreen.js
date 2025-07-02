import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MdInfo, MdDownload, MdCancel } from 'react-icons/md';
import LoadingBox from '../components/LoadingBox';
import Footer from '../components/Footer';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);

  const cancelOrderHandler = async (orderId) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;
    try {
      await axios.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const { data } = await axios.get(`/api/orders/mine`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      alert(getError(error));
    }
  };

  const downloadReport = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}/report`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `OrderReport_${orderId}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <div style={contentStyle}>
        <div style={mainBannerStyle}>
          <h1 style={{ margin: 0, color: '#fff' }}>Your Order History</h1>
          <p style={{ margin: '10px 0 0', color: '#ecf0f1' }}>
            Track, manage and download your orders with ease!
          </p>
        </div>

        <div style={containerStyle}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : orders.length === 0 ? (
            <MessageBox>No orders found.</MessageBox>
          ) : (
            <div style={cardsWrapperStyle}>
              {orders.map((order) => (
                <div key={order._id} style={orderCardStyle}>
                  <div style={orderCardHeader}>
                    <h3 style={{ margin: 0 }}>Order #{order._id.substring(0, 8)}...</h3>
                    <span style={orderDateStyle}>{order.createdAt.substring(0, 10)}</span>
                  </div>

                  <div style={itemsContainerStyle}>
                    {order.orderItems.map((item) => (
                      <div key={item._id} style={itemCardStyle}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={itemImageStyle}
                          loading="lazy"
                        />
                        <div style={itemInfoStyle}>
                          <p style={itemNameStyle}>{item.name}</p>
                          <p style={itemQtyStyle}>Qty: {item.quantity}</p>
                          <p style={itemPriceStyle}>₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={orderSummaryStyle}>
                    <p>
                      <strong>Total Price: </strong>₹{order.totalPrice.toFixed(2)}
                    </p>
                    <p>
                      <strong>Payment Status: </strong>{' '}
                      <span
                        style={{
                          color:
                            order.paymentMethod === 'COD'
                              ? '#e67e22'
                              : order.isPaid
                              ? '#27ae60'
                              : '#e74c3c',
                          fontWeight: '600',
                        }}
                      >
                        {order.paymentMethod === 'COD'
                          ? 'COD'
                          : order.isPaid
                          ? 'Paid'
                          : 'Not Paid'}
                      </span>
                    </p>
                    <p>
                      <strong>Order Status: </strong>{' '}
                      {order.isCancelled ? (
                        <span style={{ color: '#e74c3c', fontWeight: '600' }}>Cancelled</span>
                      ) : order.isDelivered ? (
                        <span style={{ color: '#27ae60', fontWeight: '600' }}>Delivered</span>
                      ) : (
                        <span style={{ color: '#3498db', fontWeight: '600' }}>Processing</span>
                      )}
                    </p>
                    <p>
                      <strong>Delivery Status: </strong>{' '}
                      <span
                        style={{
                          color:
                            order.deliveryStatus === 'pending'
                              ? '#f39c12' // amber
                              : order.deliveryStatus === 'out for delivery'
                              ? '#2980b9' // blue
                              : order.deliveryStatus === 'delivered'
                              ? '#27ae60' // green
                              : order.deliveryStatus === 'cancelled'
                              ? '#e74c3c' // red
                              : '#000',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.deliveryStatus || 'pending'}
                      </span>
                    </p>
                    {order.isPaid && order.paidAt && (
                      <p>
                        <strong>Paid At: </strong>
                        {new Date(order.paidAt).toLocaleDateString()}
                      </p>
                    )}
                    <div style={buttonsRowStyle}>
                      <Link to={`/order/${order._id}`} style={detailsBtnStyle}>
                        <MdInfo size={20} /> Details
                      </Link>
                      <button
                        onClick={() => downloadReport(order._id)}
                        style={downloadBtnStyle}
                        aria-label="Download Order Report PDF"
                      >
                        <MdDownload size={20} /> Download
                      </button>
                      <button
                        onClick={() => cancelOrderHandler(order._id)}
                        style={cancelBtnStyle}
                        aria-label="Cancel Order"
                        disabled={order.isPaid || order.isCancelled}
                        title={
                          order.isPaid
                            ? 'Cannot cancel a paid order'
                            : order.isCancelled
                            ? 'Order already cancelled'
                            : ''
                        }
                      >
                        <MdCancel size={20} /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// (Your existing styles below unchanged)
const pageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const contentStyle = {
  flex: 1,
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
};

const mainBannerStyle = {
  backgroundColor: '#2d6cdf',
  padding: '40px 20px',
  borderRadius: '14px',
  textAlign: 'center',
  marginBottom: '40px',
  color: '#fff',
  boxShadow: '0 8px 20px rgb(45 108 223 / 0.5)',
};

const containerStyle = {
  width: '100%',
};

const cardsWrapperStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '30px',
};

const orderCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 8px 24px rgb(0 0 0 / 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.25s ease',
  cursor: 'default',
};

const orderCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '15px',
  alignItems: 'center',
};

const orderDateStyle = {
  fontSize: '0.9rem',
  color: '#666',
};

const itemsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '20px',
  maxHeight: '160px',
  overflowY: 'auto',
  paddingRight: '5px',
};

const itemCardStyle = {
  display: 'flex',
  width: '140px',
  backgroundColor: '#f5f6f8',
  borderRadius: '10px',
  padding: '10px',
  alignItems: 'center',
  boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
};

const itemImageStyle = {
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  borderRadius: '6px',
  marginRight: '10px',
};

const itemInfoStyle = {
  flex: '1',
  overflow: 'hidden',
};

const itemNameStyle = {
  margin: '0 0 4px 0',
  fontWeight: '600',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const itemQtyStyle = {
  margin: '0',
  fontSize: '0.8rem',
  color: '#777',
};

const itemPriceStyle = {
  margin: '0',
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#2d6cdf',
};

const orderSummaryStyle = {
  borderTop: '1px solid #e1e1e1',
  paddingTop: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const buttonsRowStyle = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap',
};

const detailsBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#2d6cdf',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
  boxShadow: '0 3px 10px rgba(45,108,223,0.4)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const downloadBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#27ae60',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '8px',
  fontWeight: '600',
  boxShadow: '0 3px 10px rgba(39,174,96,0.4)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const cancelBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#e74c3c',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '8px',
  fontWeight: '600',
  boxShadow: '0 3px 10px rgba(231,76,60,0.4)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  opacity: 1,
};
