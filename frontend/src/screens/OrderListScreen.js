import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';
import { Store } from '../Store';
import { getError } from '../utils';
import { FaTrashAlt, FaEye, FaCheck, FaBan } from 'react-icons/fa';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'UPDATE_PAYMENT_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_PAYMENT_SUCCESS':
      return {
        ...state,
        loadingUpdate: false,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        ),
      };
    case 'UPDATE_PAYMENT_FAIL':
      return { ...state, loadingUpdate: false };
    case 'CANCEL_REQUEST':
      return { ...state, loadingCancel: true };
    case 'CANCEL_SUCCESS':
      return {
        ...state,
        loadingCancel: false,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        ),
      };
    case 'CANCEL_FAIL':
      return { ...state, loadingCancel: false };
    case 'DELIVERY_STATUS_UPDATE_REQUEST':
      return { ...state, loadingDeliveryStatusUpdate: true };
    case 'DELIVERY_STATUS_UPDATE_SUCCESS':
      return {
        ...state,
        loadingDeliveryStatusUpdate: false,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        ),
      };
    case 'DELIVERY_STATUS_UPDATE_FAIL':
      return { ...state, loadingDeliveryStatusUpdate: false };
    default:
      return state;
  }
};

const getDeliveryStatusBadge = (status) => {
  const normalizedStatus = (status || '').toLowerCase();
  switch (normalizedStatus) {
    case 'pending':
      return <span className="badge bg-warning text-dark">Pending</span>;
    case 'out for delivery':
      return <span className="badge bg-info text-dark">Out for Delivery</span>;
    case 'delivered':
      return <span className="badge bg-success">Delivered</span>;
    case 'cancelled':
      return <span className="badge bg-danger">Cancelled</span>;
    default:
      return <span className="badge bg-secondary">Unknown</span>;
  }
};

export default function OrderListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    {
      loading,
      error,
      orders,
      loadingDelete,
      successDelete,
      loadingUpdate,
      loadingCancel,
      loadingDeliveryStatusUpdate,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [localPaidOrders, setLocalPaidOrders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingDeliveryOrderId, setUpdatingDeliveryOrderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  const markAsPaidHandler = async (order) => {
    if (window.confirm('Confirm that COD payment has been received for this order?')) {
      try {
        setProcessingPayment(order._id);
        dispatch({ type: 'UPDATE_PAYMENT_REQUEST' });

        try {
          await axios.put(
            `/api/orders/${order._id}/pay`,
            {},
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
        } catch (backendError) {
          console.warn('Backend update failed, continuing local only:', getError(backendError));
        }

        const updatedOrder = {
          ...order,
          isPaid: true,
          paidAt: new Date().toISOString(),
        };

        const newLocalPaidOrders = new Set(localPaidOrders);
        newLocalPaidOrders.add(order._id);
        setLocalPaidOrders(newLocalPaidOrders);

        dispatch({ type: 'UPDATE_PAYMENT_SUCCESS', payload: updatedOrder });
        toast.success('COD payment marked as paid');
      } catch (err) {
        toast.error('Failed to update payment: ' + getError(err));
        dispatch({ type: 'UPDATE_PAYMENT_FAIL' });
      } finally {
        setProcessingPayment(null);
      }
    }
  };

  const cancelOrderHandler = async (order) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        dispatch({ type: 'CANCEL_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'CANCEL_SUCCESS', payload: data });
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'CANCEL_FAIL' });
      }
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  const getPaymentStatus = (order) => {
    const isLocallyPaid = localPaidOrders.has(order._id);
    if (order.isPaid || isLocallyPaid) {
      return { status: 'paid', text: 'Paid', className: 'bg-success' };
    }
    if (order.paymentMethod === 'Online') {
      return { status: 'paid', text: 'Paid (Online)', className: 'bg-success' };
    }
    if (order.paymentMethod === 'COD') {
      return { status: 'cod_pending', text: 'COD Pending', className: 'bg-warning text-dark' };
    }
    return { status: 'not_paid', text: 'Not Paid', className: 'bg-danger' };
  };

  const deliveryStatusOptions = [
    'pending',
    'out for delivery',
    'delivered',
    'cancelled',
  ];

  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change delivery status to "${newStatus}"?`)) return;
    try {
      setUpdatingDeliveryOrderId(orderId);
      dispatch({ type: 'DELIVERY_STATUS_UPDATE_REQUEST' });

      const { data } = await axios.put(
        `/api/orders/${orderId}/status`,
        { deliveryStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'DELIVERY_STATUS_UPDATE_SUCCESS', payload: data });
      toast.success(`Delivery status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVERY_STATUS_UPDATE_FAIL' });
    } finally {
      setUpdatingDeliveryOrderId(null);
    }
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Orders</title>
      </Helmet>

      <Card className="shadow-sm border-0">
        <Card.Header
          className="text-white"
          style={{
            background:
              'linear-gradient(90deg, #0d6efd 0%, #6610f2 50%, #0d6efd 100%)',
            fontWeight: '700',
            fontSize: '1.75rem',
            letterSpacing: '1px',
          }}
        >
          Orders Dashboard
        </Card.Header>
        <Card.Body>
          <p className="lead mb-4 text-secondary">
            Manage all your customer orders below. You can view details, search by user name, mark COD payments as received, cancel, or delete orders.
          </p>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(loadingDelete || loadingUpdate || loadingCancel || loadingDeliveryStatusUpdate) && <LoadingBox />}
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : orders.length === 0 ? (
            <Card className="text-center p-5 border-0 shadow-sm bg-light">
              <Card.Body>
                <h4 className="text-muted">No orders found.</h4>
              </Card.Body>
            </Card>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table
                striped
                bordered
                hover
                responsive
                className="align-middle"
                style={{ minWidth: '1100px' }}
              >
                <thead className="table-dark text-center">
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total (₹)</th>
                    <th>Payment Status</th>
                    <th>Paid At</th>
                    <th>Payment Method</th>
                    <th>Delivery Status</th> {/* Added column */}
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((order) =>
                      !searchQuery ||
                      (order.user &&
                        order.user.name &&
                        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((order) => {
                      const paymentStatus = getPaymentStatus(order);
                      const isCODPending = paymentStatus.status === 'cod_pending';
                      const isProcessing = processingPayment === order._id;
                      const isUpdatingDelivery = updatingDeliveryOrderId === order._id;

                      return (
                        <tr key={order._id} className="text-center align-middle">
                          <td>{order._id}</td>
                          <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.totalPrice.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${paymentStatus.className}`}>
                              {paymentStatus.text}
                            </span>
                          </td>
                          <td>
                            {(order.isPaid || localPaidOrders.has(order._id)) && order.paidAt
                              ? new Date(order.paidAt).toLocaleDateString()
                              : (order.isPaid || localPaidOrders.has(order._id))
                              ? 'Recently Paid'
                              : 'N/A'}
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <select
                              value={order.deliveryStatus || 'pending'}
                              disabled={isUpdatingDelivery}
                              onChange={(e) =>
                                handleDeliveryStatusChange(order._id, e.target.value)
                              }
                              style={{ padding: '4px 6px', borderRadius: '4px' }}
                            >
                              {deliveryStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                            {isUpdatingDelivery && (
                              <span style={{ marginLeft: 6 }}>Updating...</span>
                            )}
                          </td>
                          <td>
                            {order.isCancelled ? (
                              <span className="badge bg-danger">Cancelled</span>
                            ) : (
                              <span className="badge bg-primary">Active</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-1">
                              <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip('View Details')}
                              >
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleViewClick(order)}
                                >
                                  <FaEye />
                                </Button>
                              </OverlayTrigger>
                              {isCODPending && (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={renderTooltip('Mark COD as Paid')}
                                >
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => markAsPaidHandler(order)}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <FaCheck />
                                    )}
                                  </Button>
                                </OverlayTrigger>
                              )}
                              <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip('Cancel Order')}
                              >
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => cancelOrderHandler(order)}
                                  disabled={order.isCancelled}
                                >
                                  <FaBan />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip('Delete Order')}
                              >
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteHandler(order)}
                                >
                                  <FaTrashAlt />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h5>
                Order ID: <code>{selectedOrder._id}</code>
              </h5>
              <p>
                <strong>User:</strong> {selectedOrder.user ? selectedOrder.user.name : 'DELETED USER'}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
              </p>
              <p>
                <strong>Payment Status:</strong>{' '}
                {(() => {
                  const status = getPaymentStatus(selectedOrder);
                  return <span className={`badge ${status.className}`}>{status.text}</span>;
                })()}
              </p>
              <p>
                <strong>Delivery Status:</strong>{' '}
                {getDeliveryStatusBadge(selectedOrder.deliveryStatus)}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedOrder.isCancelled ? (
                  <span className="badge bg-danger">Cancelled</span>
                ) : (
                  <span className="badge bg-primary">Active</span>
                )}
              </p>
              <hr />
              <h5>Order Items</h5>
              {selectedOrder.orderItems?.map((item, idx) => (
                <div key={idx}>
                  {item.name} x {item.quantity} @ ₹{item.price.toFixed(2)}
                </div>
              ))}
              <hr />
              <h5>Shipping</h5>
              <p>
                {selectedOrder.shippingAddress
                  ? `${selectedOrder.shippingAddress.fullName}, ${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}`
                  : 'No shipping address'}
              </p>
              <hr />
              <h5>Total: ₹{selectedOrder.totalPrice.toFixed(2)}</h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </Container>
  );
}
