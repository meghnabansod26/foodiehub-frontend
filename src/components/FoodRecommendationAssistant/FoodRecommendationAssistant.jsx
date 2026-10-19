
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { StoreContext } from "../../context/StoreContext";
import "./FoodRecommendationAssistant.css";

const API_URL = import.meta.env.VITE_API_URL;

const QUICK_PROMPTS = [
  {
    icon: "🥗",
    label: "Vegetarian",
    text: "Suggest vegetarian food under ₹200",
  },
  {
    icon: "🌶️",
    label: "Spicy cravings",
    text: "Recommend something spicy",
  },
  {
    icon: "💰",
    label: "Budget meals",
    text: "What can I eat on a budget?",
  },
];


function normalize(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findRecommendedFoods(response, foodList) {
  const responseText = normalize(response);

  return (foodList || []).filter((food) => {
    if (!food.name) return false;

    const normalizedName = normalize(food.name);

    return (
      normalizedName.length > 2 &&
      responseText.includes(normalizedName)
    );
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

export default function FoodRecommendationAssistant() {
  const { foodList = [] } = useContext(StoreContext);

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to FoodieHub! Tell me what you're craving, your budget, or your food preferences. Let's find your next favourite meal.",
    },
  ]);

  async function sendMessage(text = message) {
    const userMessage = text.trim();

    if (!userMessage || loading || userMessage.length > 500) {
      return;
    }

    setMessage("");
    setHasStarted(true);

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userMessage },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Request failed (${response.status}). Check your backend configuration.`
        );
      }

      if (!data.recommendation) {
        throw new Error(
          "The AI returned an empty recommendation. Please try again."
        );
      }

      const recommendedFoods = findRecommendedFoods(
        data.recommendation,
        foodList
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.recommendation,
          foods: recommendedFoods,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            error.message ||
            "Something went wrong. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  function resetChat() {
    if (loading) return;

    setHasStarted(false);
    setMessage("");

    setMessages([
      {
        role: "assistant",
        text: "Welcome to FoodieHub! Tell me what you're craving, your budget, or your food preferences. Let's find your next favourite meal.",
      },
    ]);
  }

  return (
    <div className="food-ai-widget">
      {isOpen && (
        <section
          className="food-ai-panel"
          aria-label="FoodieHub AI assistant"
        >
          {/* Fixed header */}
          <header className="food-ai-header">
            <div className="food-ai-header-icon">🍽️</div>

            <div className="food-ai-header-info">
              <h3>FoodieHub AI</h3>
              <p>
                <span className="food-ai-online-dot" />
                Your personal food assistant
              </p>
            </div>

            <span className="food-ai-powered">AI POWERED</span>

            <button
              type="button"
              className="food-ai-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          {/* Single scrollable content area */}
          <div className="food-ai-scroll-content">
            {/* Welcome screen */}
            {!hasStarted && (
              <div className="food-ai-welcome">
                <span className="food-ai-eyebrow">
                  YOUR PERSONAL FOOD GUIDE
                </span>

                <h2>What are you craving today?</h2>

                <p>
                  Discover delicious options from our menu that fit
                  your mood and budget.
                </p>

                <div
                  className="food-ai-welcome-art"
                  aria-hidden="true"
                >
                  <span>🥗</span>
                  <span>🍕</span>
                  <span>🍰</span>
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div className="food-ai-chat-body" aria-live="polite">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`food-ai-message ${
                    item.role === "user"
                      ? "food-ai-user-message"
                      : "food-ai-assistant-message"
                  }`}
                >
                  {item.role === "assistant" && (
                    <div className="food-ai-avatar">✦</div>
                  )}

                  <div className="food-ai-message-content">
                    {item.foods?.length > 0 && !item.isError ? (
                      <>
                        <div className="food-ai-result-heading">
                          <span>🍴</span>
                          <div>
                            <strong>Your menu matches</strong>
                            <p>
                              {item.foods.length}{" "}
                              {item.foods.length === 1
                                ? "dish"
                                : "dishes"}{" "}
                              to explore
                            </p>
                          </div>
                        </div>

                        <div className="food-ai-food-list">
                          {item.foods.map((food) => (
                            <article
                              className="food-ai-food-card"
                              key={food.id}
                            >
                              <Link
                                to={`/food/${food.id}`}
                                className="food-ai-food-image-link"
                                onClick={() => setIsOpen(false)}
                                aria-label={`View ${food.name}`}
                              >
                                {food.imageUrl ? (
                                  <img
                                    src={food.imageUrl}
                                    alt={food.name}
                                    className="food-ai-food-image"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="food-ai-food-placeholder">
                                    🍽️
                                  </div>
                                )}
                              </Link>

                              <div className="food-ai-food-info">
                                <h4>{food.name}</h4>
                                <p>
                                  {food.description ||
                                    "Discover this item from our menu."}
                                </p>

                                <div className="food-ai-food-bottom">
                                  <strong>
                                    {formatPrice(food.price)}
                                  </strong>

                                  <Link
                                    to={`/food/${food.id}`}
                                    className="food-ai-view-button"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    View Food <span>→</span>
                                  </Link>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>

                        <p className="food-ai-result-note">
                          Selected from the available FoodieHub menu.
                        </p>

                        <div className="food-ai-bubble food-ai-text-response">
                          <ReactMarkdown>{item.text}</ReactMarkdown>
                        </div>
                      </>
                    ) : (
                      <div
                        className={`food-ai-bubble ${
                          item.isError ? "food-ai-error" : ""
                        }`}
                      >
                        {item.role === "assistant" ? (
                          <ReactMarkdown>{item.text}</ReactMarkdown>
                        ) : (
                          item.text
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="food-ai-message food-ai-assistant-message">
                  <div className="food-ai-avatar">✦</div>
                  <div className="food-ai-bubble food-ai-loading">
                    <span className="food-ai-spinner" />
                    Finding your perfect meal...
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts inside the scrollable area */}
            {!hasStarted && (
              <div className="food-ai-discover">
                <span className="food-ai-discover-title">
                  EXPLORE YOUR CRAVINGS
                </span>

                <div className="food-ai-quick-prompts">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      disabled={loading}
                      onClick={() => sendMessage(prompt.text)}
                    >
                      <span className="food-ai-prompt-icon">
                        {prompt.icon}
                      </span>
                      <span>{prompt.label}</span>
                      <span className="food-ai-prompt-arrow">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed input */}
          <form className="food-ai-form" onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell us what you'd love to eat..."
              maxLength={500}
              rows={2}
              aria-label="Enter your food preferences"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Get food recommendations"
            >
              {loading ? "…" : "➤"}
            </button>
          </form>

          {/* Fixed footer */}
          <div className="food-ai-footer">
            <p>
              AI suggestions may not reflect every ingredient.
              Confirm allergy information before ordering.
            </p>

            {hasStarted && (
              <button
                type="button"
                className="food-ai-reset"
                onClick={resetChat}
                disabled={loading}
              >
                New chat
              </button>
            )}
          </div>
        </section>
      )}

      {/* Floating launcher */}
      <button
        type="button"
        className={`food-ai-launcher ${
          isOpen ? "food-ai-launcher-open" : ""
        }`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          isOpen ? "Close FoodieHub AI" : "Ask FoodieHub AI"
        }
        aria-expanded={isOpen}
      >
        <span>{isOpen ? "×" : "✦"}</span>
        {!isOpen && <span>Ask AI</span>}
      </button>
    </div>
  );
}
