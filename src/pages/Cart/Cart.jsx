
import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals } from "../../util/cartUtils";

const Cart = () => {
  const navigate = useNavigate();

  const {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
  } = useContext(StoreContext);

  const cartItems = foodList.filter(
    (food) => (quantities?.[food.id] || 0) > 0
  );

  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  const itemCount = cartItems.reduce(
    (count, food) => count + (quantities[food.id] || 0),
    0
  );

  return (
    <main className="cart-page">
      <div className="container cart-container">
        {/* Breadcrumb */}
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right"></i>
          <span>Shopping Cart</span>
        </div>

        {/* Page Heading */}
        <div className="cart-heading">
          <div className="cart-heading-icon">
            <i className="bi bi-bag-heart"></i>
          </div>

          <div>
            <span className="cart-eyebrow">YOUR FOOD, YOUR WAY</span>
            <h1>Your Shopping Cart</h1>
            <p>Review your favourites before placing your order.</p>
          </div>

          <div className="cart-count">
            <i className="bi bi-bag-check"></i>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <section className="empty-cart">
            <div className="empty-cart-icon">
              <i className="bi bi-basket2"></i>
            </div>

            <h2>Your cart is feeling lonely!</h2>
            <p>
              Looks like you haven't added anything delicious yet.
              Let's find something you'll love.
            </p>

            <Link to="/explore" className="cart-primary-btn">
              Explore Our Menu
              <i className="bi bi-arrow-right"></i>
            </Link>
          </section>
        ) : (
          <div className="row g-4 align-items-start">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="cart-section-heading">
                <div>
                  <h2>Your Items</h2>
                  <p>{itemCount} delicious items selected</p>
                </div>

                <Link to="/explore" className="cart-add-more">
                  <i className="bi bi-plus-circle"></i>
                  Add more
                </Link>
              </div>

              <div className="cart-items-list">
                {cartItems.map((food) => (
                  <article className="cart-product" key={food.id}>
                    <Link
                      to={`/food/${food.id}`}
                      className="cart-product-image"
                    >
                      <img src={food.imageUrl} alt={food.name} />
                    </Link>

                    <div className="cart-product-info">
                      <span className="cart-category">
                        {food.category}
                      </span>

                      <Link
                        to={`/food/${food.id}`}
                        className="cart-product-name"
                      >
                        {food.name}
                      </Link>

                      <p className="cart-unit-price">
                        ₹{Number(food.price).toFixed(2)} each
                      </p>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(food.id)}
                      >
                        <i className="bi bi-trash3"></i>
                        Remove
                      </button>
                    </div>

                    <div className="cart-product-actions">
                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          aria-label={`Decrease ${food.name} quantity`}
                          onClick={() => decreaseQty(food.id)}
                          disabled={!quantities[food.id] ||
                            quantities[food.id] <= 0}
                        >
                          <i className="bi bi-dash"></i>
                        </button>

                        <span>{quantities[food.id]}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${food.name} quantity`}
                          onClick={() => increaseQty(food.id)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      <strong className="cart-line-total">
                        ₹
                        {(
                          Number(food.price) * quantities[food.id]
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-bottom-note">
                <i className="bi bi-heart-fill"></i>
                Freshly prepared, packed with love.
              </div>

              <Link to="/explore" className="cart-continue-link">
                <i className="bi bi-arrow-left"></i>
                Continue shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <aside className="cart-summary-card">
                <div className="summary-heading">
                  <div>
                    <span>ALMOST THERE!</span>
                    <h2>Order Summary</h2>
                  </div>

                  <div className="summary-bag-icon">
                    <i className="bi bi-receipt"></i>
                  </div>
                </div>

                <div className="summary-delivery">
                  <div className="delivery-icon">
                    <i className="bi bi-truck"></i>
                  </div>

                  <div>
                    <strong>Delivery to your doorstep</strong>
                    <p>Fresh food, delivered with care.</p>
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery fee</span>
                  <span>
                    {subtotal === 0
                      ? "₹0.00"
                      : `₹${Number(shipping).toFixed(2)}`}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Taxes</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <div>
                    <strong>Total Amount</strong>
                    <small>Inclusive of applicable taxes</small>
                  </div>

                  <strong>
                    ₹{(subtotal === 0 ? 0 : total).toFixed(2)}
                  </strong>
                </div>

                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={() => navigate("/order")}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                  <i className="bi bi-arrow-right"></i>
                </button>

                <div className="cart-secure-note">
                  <i className="bi bi-shield-check"></i>
                  Safe and secure checkout
                </div>

                <div className="cart-payment-note">
                  <i className="bi bi-credit-card"></i>
                  <span>Easy and convenient ordering</span>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
