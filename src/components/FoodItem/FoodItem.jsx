
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

const FoodItem = ({ name, description, id, imageUrl, price }) => {
  const { increaseQty, decreaseQty, quantities } =
    useContext(StoreContext);

  const quantity = quantities?.[id] || 0;

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength
      ? `${text.substring(0, maxLength).trim()}...`
      : text;
  };

  return (
    <article className="food-card">
      <Link
        to={`/food/${id}`}
        className="food-card-image-link"
        aria-label={`View ${name}`}
      >
        <div className="food-card-image-wrapper">
          <img
            src={imageUrl}
            alt={name}
            className="food-card-image"
            loading="lazy"
          />

          <span className="food-card-badge">
            <i className="bi bi-star-fill"></i> 4.5
          </span>
        </div>
      </Link>

      <div className="food-card-content">
        <div className="food-card-title-row">
          <h3 className="food-card-title" title={name}>
            {name}
          </h3>
        </div>

        <p className="food-card-description">
          {truncateText(description, 85)}
        </p>

        <div className="food-card-rating">
          <span className="food-card-stars" aria-label="Rated 4.5 out of 5">
            ★★★★★
          </span>
          <span className="food-card-rating-text">
            (4.5)
          </span>
          <span className="food-card-dot">·</span>
          <span>Fresh & delicious</span>
        </div>

        <div className="food-card-bottom">
          <div className="food-card-price">
            <span className="food-card-currency">₹</span>
            {price}
          </div>

          {quantity > 0 ? (
            <div className="food-quantity-control">
              <button
                type="button"
                className="food-quantity-button"
                onClick={() => decreaseQty(id)}
                aria-label={`Decrease ${name} quantity`}
              >
                <i className="bi bi-dash-lg"></i>
              </button>

              <span className="food-quantity-number">
                {quantity}
              </span>

              <button
                type="button"
                className="food-quantity-button"
                onClick={() => increaseQty(id)}
                aria-label={`Increase ${name} quantity`}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="food-add-button"
              onClick={() => increaseQty(id)}
              aria-label={`Add ${name} to cart`}
            >
              ADD <i className="bi bi-plus-lg"></i>
            </button>
          )}
        </div>

        <Link to={`/food/${id}`} className="food-card-details-link">
          View details <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default FoodItem;
