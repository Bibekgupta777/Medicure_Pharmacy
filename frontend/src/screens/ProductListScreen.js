import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaEye, FaPlus } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const ProductListScreen = () => {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Added limit=15 here
        const { data } = await axios.get(
          `/api/products/admin?page=${page}&limit=15`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        toast.success('Fill the details');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        toast.success('Product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #007bff, #00c6ff)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: '700',
          boxShadow: '0 6px 25px rgba(0,123,255,0.4)',
          userSelect: 'none',
        }}
      >
        Product Management Dashboard
      </div>

      <Row className="align-items-center mb-3">
        <Col>
          <h2 style={{ fontWeight: '700', color: '#004085' }}>Products</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={createHandler}
            disabled={loadingCreate}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaPlus />
            Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox />}
      {loadingDelete && <LoadingBox />}

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger" style={{ fontWeight: '600' }}>
          {error}
        </MessageBox>
      ) : (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '10px',
              boxShadow: '0 0 12px rgba(0,0,0,0.05)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                }}
              >
                {['ID', 'NAME', 'PRICE', 'CATEGORY', 'VARIETY', 'ACTIONS'].map((header) => (
                  <th
                    key={header}
                    style={{
                      borderBottom: '2px solid #2980b9',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr
                  key={product._id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white',
                    transition: 'background-color 0.3s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaf6ff')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#f9f9f9' : 'white')
                  }
                >
                  <td style={{ padding: '12px 15px', fontSize: '0.85rem' }}>{product._id}</td>
                  <td style={{ padding: '12px 15px', fontSize: '0.95rem', fontWeight: '600', color: '#007bff' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '12px 15px' }}>Rs{product.price.toFixed(2)}</td>
                  <td style={{ padding: '12px 15px' }}>{product.category}</td>
                  <td style={{ padding: '12px 15px' }}>{product.brand}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      style={{ marginRight: '6px' }}
                      title="Edit Product"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={() => deleteHandler(product)}
                      style={{ marginRight: '6px' }}
                      title="Delete Product"
                    >
                      <FaTrashAlt />
                    </Button>
                    <Button
                      type="button"
                      variant="outline-info"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      title="View Product"
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {[...Array(pages).keys()].map((x) => (
              <Link
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #3498db',
                  backgroundColor: Number(page) === x + 1 ? '#3498db' : 'white',
                  color: Number(page) === x + 1 ? 'white' : '#3498db',
                  fontWeight: '600',
                  textDecoration: 'none',
                  userSelect: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                aria-current={Number(page) === x + 1 ? 'page' : undefined}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
