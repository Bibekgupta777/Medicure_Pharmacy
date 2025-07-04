import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Removed useNavigate since no redirect needed
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function Product({ product, imgClassName, addToCartHandler }) {
  // Use addToCartHandler from props if passed (from HomeScreen), else fallback to internal handler
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const internalAddToCartHandler = async () => {
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
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToCart = addToCartHandler || internalAddToCartHandler;

  const formatPrice = (price) =>
    price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .product-card {
          max-width: 320px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 1rem auto;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #d1d5db;
        }

        .product-image-container {
          position: relative;
          overflow: hidden;
          background: #f8fafc;
          aspect-ratio: 1;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .stock-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          backdrop-filter: blur(4px);
        }

        .stock-badge.in-stock {
          background: rgba(16, 185, 129, 0.9);
        }

        .stock-badge.out-of-stock {
          background: rgba(239, 68, 68, 0.9);
        }

        .product-content {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .product-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
          line-height: 1.4;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8rem;
          transition: color 0.2s ease;
        }

        .product-title:hover,
        .product-title:focus {
          color: #3b82f6;
          text-decoration: none;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #059669;
          margin: 12px 0 20px 0;
          letter-spacing: -0.025em;
        }

        .add-to-cart-btn {
          background: #3b82f6;
          border: 1px solid #3b82f6;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 12px 20px;
          border-radius: 8px;
          transition: all 0.2s ease;
          margin-top: auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background: #2563eb;
          border-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          color: white;
        }

        .add-to-cart-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .add-to-cart-btn:disabled {
          background: #f3f4f6;
          border-color: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .cart-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .availability-text {
          font-weight: 500;
        }

        .availability-text.in-stock {
          color: #059669;
        }

        .availability-text.low-stock {
          color: #d97706;
        }

        .availability-text.out-of-stock {
          color: #dc2626;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }

        .product-link:hover {
          text-decoration: none;
          color: inherit;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .product-card {
            max-width: 280px;
          }
          
          .product-content {
            padding: 16px;
          }
          
          .product-title {
            font-size: 1rem;
          }
          
          .product-price {
            font-size: 1.25rem;
          }
        }

        /* Focus states for accessibility */
        .product-card:focus-within {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .add-to-cart-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      <Card className="product-card" role="group" aria-label={`Product: ${product.name}`}>
        <div className="product-image-container">
          <Link to={`/product/${product.slug}`} className="product-link" tabIndex={-1}>
            <Card.Img
              variant="top"
              src={product.image}
              alt={product.name}
              className={`product-image ${imgClassName || ''}`}
            />
          </Link>
          <div className={`stock-badge ${product.countInStock === 0 ? 'out-of-stock' : 'in-stock'}`}>
            {product.countInStock === 0 ? 'Out of Stock' : 'In Stock'}
          </div>
        </div>

        <div className="product-content">
          <div className="product-meta">
            <span className={`availability-text ${
              product.countInStock === 0 ? 'out-of-stock' : 
              product.countInStock <= 5 ? 'low-stock' : 'in-stock'
            }`}>
              {product.countInStock === 0 ? 'Unavailable' : 
               product.countInStock <= 5 ? `Only ${product.countInStock} left` : 'Available'}
            </span>
          </div>

          <Link to={`/product/${product.slug}`} className="product-title">
            {product.name}
          </Link>

          <div className="product-price">
            {formatPrice(product.price)}
          </div>

          {product.countInStock === 0 ? (
            <Button variant="secondary" disabled className="add-to-cart-btn">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Out of Stock
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddToCart} className="add-to-cart-btn">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12M12 12V16M12 12H8M12 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add to Cart
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
