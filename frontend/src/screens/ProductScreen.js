import axios from "axios";
import Footer from '../components/Footer';
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return (
    // Flex container filling full viewport height
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Content takes all space except footer */}
      <main
        style={{
          flex: 1,
          paddingTop: "2rem",
          paddingBottom: "2rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Helmet>
          <title>{product.name}</title>
        </Helmet>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row className="gy-4">
              {/* Left Column - Product Images */}
              <Col md={6}>
                <Card className="shadow-sm rounded overflow-hidden mb-3">
                  <Card.Img
                    src={selectedImage || product.image}
                    alt={product.name}
                    style={{ objectFit: "contain", maxHeight: "450px" }}
                    className="bg-light"
                  />
                </Card>
                <Row xs={4} md={5} className="g-3">
                  {[product.image, ...product.images].map((img, idx) => (
                    <Col key={idx}>
                      <Card
                        className={`thumbnail-card shadow-sm rounded ${
                          selectedImage === img
                            ? "border border-3 border-primary"
                            : ""
                        }`}
                        style={{ cursor: "pointer", transition: "transform 0.2s" }}
                        onClick={() => setSelectedImage(img)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <Card.Img
                          variant="top"
                          src={img}
                          alt={`thumbnail-${idx}`}
                          style={{ objectFit: "contain", maxHeight: "90px" }}
                          className="bg-white p-1"
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>

              {/* Right Column - Product Details */}
              <Col md={6}>
                <h2 className="fw-bold mb-3">{product.name}</h2>

                <Rating rating={product.rating} numReviews={product.numReviews} />

                <h3 className="text-success mt-3">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price)}
                </h3>

                <p className="mt-4 fs-5 text-secondary">{product.description}</p>

                <ListGroup variant="flush" className="mt-4 fs-5">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                    <span>Status:</span>
                    {product.countInStock > 0 ? (
                      <Badge bg="success" className="fs-6 py-2 px-3 rounded-pill">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="fs-6 py-2 px-3 rounded-pill">
                        Unavailable
                      </Badge>
                    )}
                  </ListGroup.Item>
                </ListGroup>

                {product.countInStock > 0 && (
                  <div className="d-grid mt-4">
                    <Button
                      onClick={addToCartHandler}
                      variant="success"
                      size="lg"
                      className="d-flex align-items-center justify-content-center gap-2"
                      style={{ fontWeight: "600" }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </Col>
            </Row>

            {/* Divider */}
            <hr className="my-5" />

            {/* Reviews Section */}
            <div>
              <h3 ref={reviewsRef} className="mb-4 fw-semibold">
                Customer Reviews
              </h3>
              {product.reviews.length === 0 && (
                <MessageBox className="mb-4">There are no reviews yet.</MessageBox>
              )}

              <ListGroup className="mb-5">
                {product.reviews.map((review) => (
                  <ListGroup.Item
                    key={review._id}
                    className="shadow-sm rounded mb-3"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{review.name}</strong>
                      <small className="text-muted">
                        {review.createdAt.substring(0, 10)}
                      </small>
                    </div>
                    <Rating rating={review.rating} caption=" " />
                    <p className="mt-3 mb-0">{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {userInfo ? (
                <Card className="p-4 shadow-sm rounded">
                  <h4 className="mb-3 fw-semibold">Write a Review</h4>
                  <Form onSubmit={submitHandler}>
                    <div className="mb-3 d-flex gap-3">
                      <Button
                        type="button"
                        variant={like ? "success" : "outline-success"}
                        disabled={buttonsDisabled || like}
                        onClick={() => {
                          setLike(true);
                          setButtonsDisabled(true);
                        }}
                        className="flex-grow-1"
                      >
                        <FaThumbsUp /> Like
                      </Button>
                      <Button
                        type="button"
                        variant={dislike ? "danger" : "outline-danger"}
                        disabled={buttonsDisabled || dislike}
                        onClick={() => {
                          setDislike(true);
                          setButtonsDisabled(true);
                        }}
                        className="flex-grow-1"
                      >
                        <FaThumbsDown /> Dislike
                      </Button>
                    </div>

                    <Form.Group className="mb-3" controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        aria-label="Rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                      >
                        <option value="">Select rating...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Select>
                    </Form.Group>

                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Comments"
                      className="mb-4"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ minHeight: "100px" }}
                        required
                      />
                    </FloatingLabel>

                    <div className="d-grid">
                      <Button
                        type="submit"
                        disabled={loadingCreateReview}
                        size="lg"
                        className="fw-semibold"
                      >
                        Submit Review
                      </Button>
                    </div>
                    {loadingCreateReview && <LoadingBox />}
                  </Form>
                </Card>
              ) : (
                <MessageBox>
                  Please{" "}
                  <Link to={`/signin?redirect=/product/${product.slug}`}>
                    Sign In
                  </Link>{" "}
                  to write a review
                </MessageBox>
              )}
            </div>

            {/* Banner Section */}
            <div
              className="mt-5 rounded shadow-lg text-center text-white p-5"
              style={{
                backgroundImage: "url('/images/hero4.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="mb-3 fw-bold text-shadow">Your Health, Our Priority</h2>
              <p className="fs-5 mb-4 text-shadow">
                Discover quality products and unbeatable offers today!
              </p>
              <Button
                variant="light"
                size="lg"
                href="/"
                className="fw-semibold px-4"
                style={{ boxShadow: "0 0 10px rgba(255,255,255,0.7)" }}
              >
                Shop Now
              </Button>
            </div>
          </>
        )}
      </main>

      <Footer />

      <style>
        {`
          .text-shadow {
            text-shadow: 2px 2px 6px rgba(0,0,0,0.75);
          }
          .thumbnail-card:hover {
            transform: scale(1.07);
            box-shadow: 0 0 8px rgba(0,0,0,0.15);
            transition: all 0.2s ease-in-out;
          }
          button:focus, .btn:focus {
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.5) !important;
            outline: none !important;
          }
          /* You can add bottom margin to banner so footer isn't too close */
          .mt-5.rounded.shadow-lg {
            margin-bottom: 60px;
          }
        `}
      </style>
    </div>
  );
}

export default ProductScreen;
