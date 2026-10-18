
import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/contants";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  deleteOrder,
  verifyPayment,
} from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const cartItems = foodList.filter(
    (food) => quantities[food.id] > 0
  );

  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const clearCart = async () => {
    try {
      await clearCartItems(token, setQuantities);
    } catch (error) {
      toast.error("Error while clearing the cart.");
    }
  };

  const deleteOrderHandler = async (orderId) => {
    if (!orderId) return;

    try {
      await deleteOrder(orderId, token);
    } catch (error) {
      toast.error("Something went wrong. Contact support.");
    }
  };

  const verifyPaymentHandler = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      const success = await verifyPayment(paymentData, token);

      if (success) {
        toast.success("Payment successful!");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment verification failed. Please contact support if money was deducted.");
      }
    } catch (error) {
      toast.error(
        "Unable to verify payment. Please check your order before retrying."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateRazorpayPayment = (order) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is unavailable. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Food Land",
      description: "Food order payment",
      order_id: order.razorpayOrderId,

      handler: verifyPaymentHandler,

      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },

      theme: {
        color: "#ff5a36",
      },

      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
          toast.info("Payment was cancelled.");
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        setIsSubmitting(false);
        toast.error("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Unable to open the payment window.");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please log in to place your order.");
      navigate("/");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,

      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),

      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await createOrder(orderData, token);

      if (response?.razorpayOrderId) {
        initiateRazorpayPayment(response);
      } else {
        toast.error("Unable to place order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Unable to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        {/* Page heading */}
        <div className="checkout-heading">
          <div className="checkout-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <i className="bi bi-chevron-right"></i>
            <span onClick={() => navigate("/cart")}>Cart</span>
            <i className="bi bi-chevron-right"></i>
            <strong>Checkout</strong>
          </div>

          <span className="checkout-eyebrow">
            <i className="bi bi-bag-heart-fill"></i>
            JUST ONE STEP AWAY
          </span>

          <h1>Complete your order<span>.</span></h1>

          <p>
            Fresh food, made with care, delivered to your doorstep.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              <i className="bi bi-bag-x"></i>
            </div>

            <h2>Your cart is waiting for something delicious</h2>

            <p>Add your favourite dishes to get started.</p>

            <button
              type="button"
              className="checkout-primary-btn"
              onClick={() => navigate("/explore")}
            >
              Explore Menu
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        ) : (
          <div className="checkout-layout">

            {/* Billing details */}
            <section className="checkout-form-card">
              <div className="checkout-section-heading">
                <div className="checkout-step">01</div>

                <div>
                  <h2>Delivery details</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <form onSubmit={onSubmitHandler}>
                <div className="checkout-form-grid">

                  <div className="checkout-field">
                    <label htmlFor="firstName">First name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={onChangeHandler}
                      autoComplete="given-name"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={onChangeHandler}
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label htmlFor="email">Email address</label>

                    <div className="checkout-input-icon">
                      <i className="bi bi-envelope"></i>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={onChangeHandler}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label htmlFor="phoneNumber">Phone number</label>

                    <div className="checkout-input-icon">
                      <i className="bi bi-telephone"></i>

                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your 10-digit mobile number"
                        value={data.phoneNumber}
                        onChange={onChangeHandler}
                        autoComplete="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label htmlFor="address">Street address</label>

                    <div className="checkout-input-icon">
                      <i className="bi bi-geo-alt"></i>

                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="House number, street, area"
                        value={data.address}
                        onChange={onChangeHandler}
                        autoComplete="street-address"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="state">State</label>

                    <select
                      id="state"
                      name="state"
                      value={data.state}
                      onChange={onChangeHandler}
                      required
                    >
                      <option value="">Select state</option>
                      <option value="Maharashtra">Maharashtra</option>
                    </select>
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">City</label>

                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      value={data.city}
                      onChange={onChangeHandler}
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label htmlFor="zip">PIN code</label>

                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      placeholder="6-digit PIN code"
                      value={data.zip}
                      onChange={onChangeHandler}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                </div>

                <div className="checkout-secure-note">
                  <i className="bi bi-shield-check"></i>
                  <span>
                    Your delivery details are used to process your order.
                  </span>
                </div>

                <button
                  className="checkout-primary-btn checkout-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="checkout-spinner"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{total.toFixed(2)}
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="checkout-back-btn"
                  onClick={() => navigate("/cart")}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-left"></i>
                  Return to cart
                </button>
              </form>
            </section>

            {/* Order summary */}
            <aside className="checkout-summary-card">
              <div className="checkout-summary-top">
                <div>
                  <span className="checkout-eyebrow">YOUR SELECTION</span>
                  <h2>Order summary</h2>
                </div>

                <span className="checkout-item-count">
                  {cartItems.reduce(
                    (count, item) => count + quantities[item.id],
                    0
                  )}{" "}
                  items
                </span>
              </div>

              <div className="checkout-product-list">
                {cartItems.map((item) => (
                  <div className="checkout-product" key={item.id}>
                    <div className="checkout-product-image">
                      <img src={item.imageUrl} alt={item.name} />
                      <span>{quantities[item.id]}</span>
                    </div>

                    <div className="checkout-product-info">
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                      <span>
                        ₹{Number(item.price).toFixed(2)} ×{" "}
                        {quantities[item.id]}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price) * quantities[item.id]
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-divider"></div>

              <div className="checkout-price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout-price-row">
                <span>Delivery fee</span>
                <span>
                  {subtotal === 0
                    ? "₹0.00"
                    : `₹${Number(shipping).toFixed(2)}`}
                </span>
              </div>

              <div className="checkout-price-row">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="checkout-summary-divider"></div>

              <div className="checkout-total-row">
                <div>
                  <strong>Total amount</strong>
                  <small>Inclusive of applicable charges</small>
                </div>

                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <div className="checkout-payment-note">
                <div className="checkout-payment-icon">
                  <i className="bi bi-credit-card-2-front"></i>
                </div>

                <div>
                  <strong>Secure online payment</strong>
                  <p>Payments are processed through Razorpay.</p>
                </div>
              </div>

              <div className="checkout-delivery-note">
                <i className="bi bi-heart-fill"></i>
                <span>Prepared fresh. Delivered with care.</span>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
};

export default PlaceOrder;
