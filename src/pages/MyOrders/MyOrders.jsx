
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { fetchUserOrders } from "../../service/orderService";
import { toast } from "react-toastify";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetchUserOrders(token);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error("Unable to fetch your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();

    if (value.includes("deliver")) return "status-delivered";
    if (value.includes("cancel")) return "status-cancelled";
    if (value.includes("process")) return "status-processing";
    if (value.includes("out")) return "status-out";
    if (value.includes("pending")) return "status-pending";

    return "status-default";
  };

  return (
    <main className="orders-page">
      <div className="orders-container">

        <div className="orders-breadcrumb">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right" />
          <span>My Orders</span>
        </div>

        <section className="orders-heading">
          <div>
            <span className="orders-eyebrow">
              YOUR FOOD JOURNEY
            </span>
            <h1>
              My Orders<span>.</span>
            </h1>
            <p>
              Track your orders and revisit your favourite meals.
            </p>
          </div>

          <button
            className="orders-refresh"
            onClick={fetchOrders}
            disabled={loading}
          >
            <i
              className={`bi bi-arrow-clockwise ${
                loading ? "spin" : ""
              }`}
            />
            {loading ? "Refreshing..." : "Refresh Orders"}
          </button>
        </section>

        <div className="orders-count">
          <div className="orders-count-icon">
            <i className="bi bi-receipt-cutoff" />
          </div>

          <div>
            <strong>{data.length}</strong>
            <span>
              {data.length === 1 ? "Total Order" : "Total Orders"}
            </span>
          </div>
        </div>

        {loading && data.length === 0 ? (
          <div className="orders-message">
            <div
              className="spinner-border text-warning"
              role="status"
            />
            <p>Loading your delicious orders...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <i className="bi bi-bag-heart" />
            </div>

            <h2>No orders yet!</h2>
            <p>
              Your next delicious meal is just a few clicks away.
            </p>

            <Link to="/explore" className="orders-shop-button">
              Explore Menu
              <i className="bi bi-arrow-right" />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {data.map((order, index) => {
              const items = order.orderedItems || [];
              const status = order.orderStatus || "Pending";

              return (
                <article
                  className="order-card"
                  key={order.id || index}
                >
                  <div className="order-card-top">
                    <div className="order-icon">
                      <img
                        src={assets.delivery}
                        alt="Delivery"
                        width="42"
                        height="42"
                      />
                    </div>

                    <div className="order-title">
                      <span>
                        ORDER #
                        {String(order.id || index + 1).slice(-8)}
                      </span>
                      <h3>
                        {items.length}{" "}
                        {items.length === 1 ? "item" : "items"}
                      </h3>
                    </div>

                    <span
                      className={`order-status ${getStatusClass(
                        status
                      )}`}
                    >
                      <span className="status-dot" />
                      {status}
                    </span>
                  </div>

                  <div className="order-items">
                    {items.map((item, itemIndex) => (
                      <div
                        className="order-item"
                        key={
                          item.id ||
                          `${item.name}-${itemIndex}`
                        }
                      >
                        <div className="order-item-icon">
                          <i className="bi bi-egg-fried" />
                        </div>

                        <div className="order-item-details">
                          <strong>{item.name}</strong>
                          <span>
                            Quantity: {item.quantity}
                          </span>
                        </div>

                        <span className="order-item-quantity">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-bottom">
                    <div className="order-total">
                      <span>Order Total</span>
                      <strong>
                        ₹{Number(order.amount || 0).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      className="order-track-button"
                      onClick={fetchOrders}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise" />
                      Update Status
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="orders-help">
          <i className="bi bi-headset" />

          <div>
            <strong>Need help with your order?</strong>
            <p>
              We're here to make your FoodieHub experience better.
            </p>
          </div>

          <Link to="/contact">
            Contact Us
            <i className="bi bi-arrow-up-right" />
          </Link>
        </div>

      </div>
    </main>
  );
};

export default MyOrders;
