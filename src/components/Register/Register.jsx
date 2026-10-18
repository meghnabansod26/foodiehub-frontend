
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (data.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(data);

      if (response.status === 201) {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-wrapper">
        <div className="register-brand-panel">
          <div className="register-brand-content">
            <span className="register-eyebrow">
              WELCOME TO FOODIEHUB
            </span>

            <h1>
              Good food.
              <br />
              Good mood.
              <br />
              <span>Great moments.</span>
            </h1>

            <p>
              Discover your favorite dishes, enjoy delicious meals,
              and get them delivered right to your doorstep.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <span className="benefit-icon">
                  <i className="bi bi-egg-fried"></i>
                </span>
                <div>
                  <h6>Fresh & Delicious</h6>
                  <p>Meals made for your cravings.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="benefit-icon">
                  <i className="bi bi-truck"></i>
                </span>
                <div>
                  <h6>Quick Delivery</h6>
                  <p>Your favorites, delivered with care.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="benefit-icon">
                  <i className="bi bi-heart"></i>
                </span>
                <div>
                  <h6>Made for Food Lovers</h6>
                  <p>A little happiness in every bite.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-brand-footer">
            <i className="bi bi-stars"></i>
            Good food brings people together.
          </div>
        </div>

        <div className="register-form-panel">
          <div className="register-form-header">
            <span className="register-form-tag">GET STARTED</span>

            <h2>Create your account</h2>

            <p>
              Join FoodieHub and make every meal special.
            </p>
          </div>

          <form onSubmit={onSubmitHandler}>
            <div className="register-field">
              <label htmlFor="registerName">Full name</label>

              <div className="register-input-wrapper">
                <i className="bi bi-person"></i>
                <input
                  id="registerName"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={data.name}
                  onChange={onChangeHandler}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="registerEmail">Email address</label>

              <div className="register-input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  id="registerEmail"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={onChangeHandler}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="registerPassword">Password</label>

              <div className="register-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  id="registerPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={data.password}
                  onChange={onChangeHandler}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>

              <small className="register-field-hint">
                Use at least 6 characters.
              </small>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}

              {!loading && (
                <i className="bi bi-arrow-right"></i>
              )}
            </button>

            <div className="register-login-prompt">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </div>
          </form>

          <div className="register-secure-note">
            <i className="bi bi-shield-check"></i>
            Your information is handled securely.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
