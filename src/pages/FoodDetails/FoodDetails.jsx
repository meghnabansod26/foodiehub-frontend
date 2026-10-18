
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./FoodDetails.css";

const FoodDetails = () => {
  const { id } = useParams();
  const { increaseQty } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadFoodDetails = async () => {
      try {
        setLoading(true);
        const foodData = await fetchFoodDetails(id);

        if (isMounted) {
          setData(foodData);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Unable to load food details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFoodDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const addToCart = () => {
    if (!data?.id) {
      toast.error("Food details are unavailable.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      increaseQty(data.id);
    }

    toast.success(`${data.name} added to cart!`);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="food-details-loading">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Preparing something delicious...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="food-details-empty">
        <div className="food-empty-icon">
          <i className="bi bi-emoji-frown"></i>
        </div>
        <h2>Food not found</h2>
        <p>Sorry, we couldn't find this dish.</p>
        <Link to="/explore" className="food-primary-btn">
          Explore Menu <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    );
  }

  return (
    <main className="food-details-page">
      <div className="food-details-container">
        {/* Breadcrumb */}
        <nav className="food-breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right"></i>
          <Link to="/explore">Explore</Link>
          <i className="bi bi-chevron-right"></i>
          <span>{data.name}</span>
        </nav>

        {/* Product details */}
        <section className="food-details-card">
          <div className="food-details-image-panel">
            <div className="food-image-badge">
              <i className="bi bi-patch-check-fill"></i>
              Freshly prepared
            </div>

            <img
              src={data.imageUrl}
              alt={data.name}
              className="food-details-image"
            />

            <div className="food-image-caption">
              <i className="bi bi-heart"></i>
              Made with love, served with flavour
            </div>
          </div>

          <div className="food-details-content">
            <span className="food-details-eyebrow">
              <span></span> GOOD FOOD, GOOD MOOD
            </span>

            <div className="food-category-row">
              <span className="food-category-label">CATEGORY</span>
              <span className="food-category-badge">
                {data.category}
              </span>
            </div>

            <h1>{data.name}</h1>

            <div className="food-rating-row">
              <span className="food-rating-stars">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </span>
              <span>4.5</span>
              <span className="food-rating-divider">•</span>
              <span className="food-rating-text">Customer favourite</span>
            </div>

            <div className="food-details-price">
              <span className="food-price-symbol">₹</span>
              {Number(data.price).toFixed(2)}
            </div>

            <p className="food-details-description">
              {data.description ||
                "A delicious dish prepared with care using quality ingredients. Perfect for satisfying your cravings."}
            </p>

            <div className="food-details-highlights">
              <div className="food-highlight">
                <span className="food-highlight-icon">
                  <i className="bi bi-egg-fried"></i>
                </span>
                <div>
                  <strong>Quality food</strong>
                  <small>Made with care</small>
                </div>
              </div>

              <div className="food-highlight">
                <span className="food-highlight-icon">
                  <i className="bi bi-box-seam"></i>
                </span>
                <div>
                  <strong>Freshly packed</strong>
                  <small>Ready for your order</small>
                </div>
              </div>
            </div>

            <div className="food-details-divider"></div>

            <div className="food-order-row">
              <div>
                <span className="food-quantity-label">QUANTITY</span>
                <div className="food-quantity-control">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                  >
                    <i className="bi bi-dash"></i>
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((current) => current + 1)
                    }
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <div className="food-order-total">
                <span>Total price</span>
                <strong>
                  ₹{(Number(data.price) * quantity).toFixed(2)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="food-add-cart-btn"
              onClick={addToCart}
            >
              <span>
                <i className="bi bi-bag-plus"></i>
                Add to Cart
              </span>
              <span className="food-add-cart-price">
                ₹{(Number(data.price) * quantity).toFixed(2)}
                <i className="bi bi-arrow-right"></i>
              </span>
            </button>

            <Link to="/explore" className="food-back-link">
              <i className="bi bi-arrow-left"></i>
              Continue exploring the menu
            </Link>
          </div>
        </section>

        {/* Bottom features */}
        <section className="food-details-benefits">
          <div>
            <i className="bi bi-stars"></i>
            <span>
              <strong>Made for your cravings</strong>
              <small>Discover your next favourite dish</small>
            </span>
          </div>

          <div>
            <i className="bi bi-shield-check"></i>
            <span>
              <strong>Easy ordering</strong>
              <small>A simple and convenient experience</small>
            </span>
          </div>

          <div>
            <i className="bi bi-heart"></i>
            <span>
              <strong>Food you'll love</strong>
              <small>Something delicious for every mood</small>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FoodDetails;
