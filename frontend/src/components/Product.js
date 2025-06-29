import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Removed useNavigate since no redirect needed
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function Product({ product, imgClassName }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      const { data } = await axios.get(`/api/products/${product._id}`);
      if (data.countInStock < quantity) {
        toast.error('Sorry. Product is out of stock');
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
      toast.success('Added to cart!');
      // Removed navigate('/cart'); to prevent navigation
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const formatPrice = (price) =>
    price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <>
      <style>{`
        .product-card {
          max-width: 460px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          background: #fff;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          margin: 1rem auto;
        }
        .product-card:hover {
          box-shadow: 0 12px 36px rgba(0,0,0,0.18);
          transform: translateY(-8px);
        }
        .product-image {
          height: 200px;
          width: 100%;
          object-fit: cover;
          background: #f0f0f0;
          border-bottom: 1px solid #eee;
          transition: transform 0.5s ease;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
        .product-card:hover .product-image {
          transform: scale(1.08);
        }
        .product-info {
          padding: 20px 22px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .product-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 12px 0;
          line-height: 1.3;
          text-align: center;
          min-height: 64px;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .product-title:hover,
        .product-title:focus {
          color: #007bff;
          text-decoration: underline;
          outline: none;
        }
        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #28a745;
          margin-bottom: 22px;
          text-align: center;
        }
        .btn-add {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          border: none;
          font-weight: 700;
          border-radius: 30px;
          padding: 14px 0;
          width: 100%;
          font-size: 1.15rem;
          color: white;
          box-shadow: 0 6px 12px rgba(39, 174, 96, 0.6);
          transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
        }
        .btn-add:hover {
          background: linear-gradient(135deg, #27ae60, #229954);
          box-shadow: 0 10px 20px rgba(39, 174, 96, 0.85);
          transform: scale(1.05);
        }
        .btn-add:active {
          transform: scale(0.95);
        }
        .btn-disabled {
          background-color: #b0b0b0 !important;
          cursor: not-allowed !important;
          opacity: 0.65 !important;
          box-shadow: none !important;
          color: #eee !important;
          font-weight: 700 !important;
          border-radius: 30px !important;
          padding: 14px 0 !important;
          width: 100% !important;
          font-size: 1.15rem !important;
        }
      `}</style>

      <Card className="product-card" role="group" aria-label={`Product: ${product.name}`}>
        <Link to={`/product/${product.slug}`} tabIndex={-1}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className={`product-image ${imgClassName || ''}`}
          />
        </Link>
        <Card.Body className="product-info">
          <Link to={`/product/${product.slug}`} className="product-title">
            {product.name}
          </Link>
          <div className="product-price">
            {formatPrice(product.price)}
          </div>
          {product.countInStock === 0 ? (
            <Button variant="secondary" disabled className="btn-disabled">
              Out of Stock
            </Button>
          ) : (
            <Button variant="success" onClick={addToCartHandler} className="btn-add">
              Add to Cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
