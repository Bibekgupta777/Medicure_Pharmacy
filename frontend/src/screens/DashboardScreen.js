import React, { useContext, useEffect, useReducer, useState } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaShippingFast, FaCheckCircle, FaHeadset, FaLock } from 'react-icons/fa';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    summary: {
      users: [],
      orders: [],
      dailyOrders: [],
      productCategories: [],
    },
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const cardBaseStyle = {
    borderRadius: '18px',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
    padding: '30px 25px',
    userSelect: 'none',
    cursor: 'default',
    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  };
  const cardHoverStyle = {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.15)',
  };

  const formatPrice = (price) =>
    price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#222',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
          color: 'white',
          padding: '28px',
          borderRadius: '20px',
          marginBottom: '50px',
          textAlign: 'center',
          fontSize: '1.9rem',
          fontWeight: '700',
          boxShadow: '0 8px 28px rgba(0, 123, 255, 0.45)',
          userSelect: 'none',
          letterSpacing: '1.1px',
        }}
      >
        Your Dashboard — Track Performance & Insights in Real Time
      </div>

      <h1
        style={{
          textAlign: 'center',
          fontWeight: '700',
          marginBottom: '10px',
          fontSize: '2.8rem',
          color: '#004085',
          textShadow: '1px 1px 3px rgba(0,0,0,0.12)',
          userSelect: 'none',
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '1.15rem',
          color: '#555',
          userSelect: 'none',
        }}
      >
        Welcome back, <strong>{userInfo.name || 'User'}</strong>! Here's a summary of your platform activity.
      </p>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
          {error}
        </MessageBox>
      ) : (
        <>
          {/* Stats Cards */}
          <Row
            className="mb-5"
            style={{
              gap: '1.8rem',
              justifyContent: 'center',
            }}
          >
            {[
              {
                label: 'Users',
                value: summary.users && summary.users[0] ? summary.users[0].numUsers : 0,
                color: '#17a2b8',
                icon: <FaHeadset size={36} color="#17a2b8" aria-label="Users Icon" />,
                tooltip: 'Total Registered Users',
              },
              {
                label: 'Orders',
                value: summary.orders && summary.orders[0] ? summary.orders[0].numOrders : 0,
                color: '#28a745',
                icon: <FaCheckCircle size={36} color="#28a745" aria-label="Orders Icon" />,
                tooltip: 'Total Orders Placed',
              },
              {
                label: 'Total Sales',
                value:
                  summary.orders && summary.orders[0]
                    ? formatPrice(summary.orders[0].totalSales)
                    : formatPrice(0),
                color: '#ffc107',
                icon: <FaShippingFast size={36} color="#ffc107" aria-label="Sales Icon" />,
                tooltip: 'Revenue Generated',
              },
            ].map((item, index) => (
              <Col
                key={item.label}
                md={3}
                style={{
                  ...cardBaseStyle,
                  ...(hoverIndex === index ? cardHoverStyle : {}),
                  cursor: 'default',
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                tabIndex={0}
                aria-label={`${item.label}: ${item.value}`}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-${item.label}`}>{item.tooltip}</Tooltip>}
                >
                  <div>{item.icon}</div>
                </OverlayTrigger>

                <div
                  style={{
                    fontSize: '3.3rem',
                    fontWeight: '700',
                    color: item.color,
                    margin: '18px 0 12px 0',
                    letterSpacing: '1.6px',
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#444',
                  }}
                >
                  {item.label}
                </div>
              </Col>
            ))}
          </Row>

          {/* Sales Over Time Chart */}
          <Card
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 14px 40px rgba(0,0,0,0.12)',
              marginBottom: '50px',
              userSelect: 'none',
            }}
          >
            <h2
              style={{
                marginBottom: '30px',
                fontWeight: '700',
                color: '#004085',
                borderBottom: '3px solid #007bff',
                paddingBottom: '10px',
                letterSpacing: '0.75px',
                userSelect: 'none',
              }}
            >
              Sales Over Time
            </h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sales Data Available</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
                options={{
                  curveType: 'function',
                  legend: { position: 'bottom', textStyle: { fontSize: 14 } },
                  hAxis: {
                    title: 'Date',
                    titleTextStyle: { color: '#333', fontSize: 16, bold: true },
                    textStyle: { color: '#555', fontSize: 13 },
                    gridlines: { color: '#f0f0f0' },
                    slantedText: true,
                    slantedTextAngle: 45,
                  },
                  vAxis: {
                    title: 'Sales (₹)',
                    titleTextStyle: { color: '#333', fontSize: 16, bold: true },
                    textStyle: { color: '#555', fontSize: 13 },
                    gridlines: { color: '#f0f0f0' },
                    minValue: 0,
                  },
                  chartArea: { width: '80%', height: '70%' },
                  colors: ['#007bff'],
                  backgroundColor: 'white',
                  pointSize: 6,
                  tooltip: { trigger: 'focus', isHtml: true },
                  animation: {
                    startup: true,
                    easing: 'easeOutQuart',
                    duration: 1500,
                  },
                }}
              />
            )}
          </Card>

          {/* Product Categories Pie Chart */}
          <Card
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 14px 40px rgba(0,0,0,0.12)',
              marginBottom: '60px',
              userSelect: 'none',
            }}
          >
            <h2
              style={{
                marginBottom: '30px',
                fontWeight: '700',
                color: '#28a745',
                borderBottom: '3px solid #e6ebe7',
                paddingBottom: '10px',
                letterSpacing: '0.75px',
                userSelect: 'none',
              }}
            >
              Product Categories
            </h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Categories Available</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
                options={{
                  pieHole: 0.45,
                  colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
                  backgroundColor: 'white',
                  chartArea: { width: '80%', height: '80%' },
                  legend: { position: 'right', alignment: 'center', textStyle: { fontSize: 14 } },
                  tooltip: { isHtml: true },
                  animation: {
                    startup: true,
                    easing: 'easeOutQuart',
                    duration: 1500,
                  },
                }}
              />
            )}
          </Card>

          {/* Feature Banners */}
          <Row
            className="mb-5"
            style={{
              gap: '1.5rem',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            {[
              {
                icon: <FaShippingFast size={38} color="white" />,
                title: 'Fast Delivery',
                text: 'Quick order processing and shipping within 24 hours.',
                bg: 'linear-gradient(135deg, #007bff, #00c6ff)',
              },
              {
                icon: <FaCheckCircle size={38} color="white" />,
                title: 'Quality Products',
                text: 'We source only the best products for you.',
                bg: 'linear-gradient(135deg, #28a745, #85d18d)',
              },
              {
                icon: <FaHeadset size={38} color="white" />,
                title: '24/7 Support',
                text: 'Always available to assist you with your needs.',
                bg: 'linear-gradient(135deg, #ffc107, #ffe066)',
              },
              {
                icon: <FaLock size={38} color="white" />,
                title: 'Secure Payments',
                text: 'Safe and encrypted payment gateways.',
                bg: 'linear-gradient(135deg, #dc3545, #ff6b6b)',
              },
            ].map((item, index) => (
              <Col
                md={3}
                key={index}
                tabIndex={0}
                aria-label={`${item.title}: ${item.text}`}
                style={{
                  borderRadius: '20px',
                  padding: '30px 25px',
                  background: item.bg,
                  color: 'white',
                  boxShadow: '0 14px 36px rgba(0,0,0,0.17)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 25px 65px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.17)';
                }}
              >
                <div style={{ marginBottom: '18px' }}>{item.icon}</div>
                <h3
                  style={{
                    fontWeight: '700',
                    fontSize: '1.6rem',
                    marginBottom: '14px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.92 }}>
                  {item.text}
                </p>
              </Col>
            ))}
          </Row>

      {/* Footer */}
      <footer
        style={{
          marginTop: '50px',
          padding: '20px 0',
          textAlign: 'center',
          color: '#555',
          fontSize: '0.9rem',
          userSelect: 'none',
          borderTop: '1px solid #ddd',
        }}
      >
        &copy; {new Date().getFullYear()} LifeCare Pharmacy. All rights reserved.
      </footer>
        </>
      )}
    </div>
  );
}
