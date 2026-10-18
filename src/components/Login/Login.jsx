
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { login } from '../../service/authService';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!data.email.trim() || !data.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await login(data);

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;

        localStorage.setItem('token', token);
        setToken(token);

        navigate('/');
        toast.success('Welcome back!');

        try {
          await loadCartData(token);
        } catch (cartError) {
          console.error('Unable to load cart:', cartError);
        }
      } else {
        toast.error('Unable to login. Please try again.');
      }
    } catch (error) {
      console.error('Unable to login:', error);

      toast.error(
        error.response?.data?.message ||
        'Unable to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      email: '',
      password: ''
    });
    setShowPassword(false);
  };

  return (
    <main className="login-page">
      <div className="login-overlay"></div>

      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-brand">
            <span className="login-brand-icon">
              <i className="bi bi-egg-fried"></i>
            </span>

            <span>
              Foodie<span className="brand-highlight">Hub</span>
            </span>
          </div>

          <div className="login-welcome">
            <span className="login-eyebrow">
              YOUR NEXT FAVOURITE MEAL AWAITS
            </span>

            <h1>
              Good food.
              <br />
              <span>Good mood.</span>
            </h1>

            <p>
              Sign in to discover delicious dishes, manage your cart,
              and enjoy a delightful food ordering experience.
            </p>

            <div className="login-benefits">
              <div className="login-benefit">
                <i className="bi bi-check-circle-fill"></i>
                <span>Discover delicious dishes</span>
              </div>

              <div className="login-benefit">
                <i className="bi bi-check-circle-fill"></i>
                <span>Order your favourites easily</span>
              </div>

              <div className="login-benefit">
                <i className="bi bi-check-circle-fill"></i>
                <span>Track your orders</span>
              </div>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-form-heading">
              <span className="login-eyebrow form-eyebrow">
                WELCOME BACK
              </span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your details below to continue.
              </p>
            </div>

            <form onSubmit={onSubmitHandler}>
              <div className="login-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <i className="bi bi-envelope"></i>

                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={onChangeHandler}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="login-input-wrapper">
                  <i className="bi bi-lock"></i>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={onChangeHandler}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <i
                      className={`bi ${
                        showPassword ? 'bi-eye-slash' : 'bi-eye'
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="login-security-note">
                <i className="bi bi-shield-check"></i>
                Secure sign in to your account
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                <span>
                  {loading ? 'Signing in...' : 'Sign In'}
                </span>

                {!loading && (
                  <i className="bi bi-arrow-right"></i>
                )}
              </button>

              <button
                type="button"
                className="login-reset"
                onClick={resetForm}
                disabled={loading}
              >
                Clear fields
              </button>
            </form>

            <div className="login-signup">
              Don't have an account?
              <Link to="/register"> Create an account</Link>
            </div>

            <div className="login-footer">
              Made with <i className="bi bi-heart-fill"></i> for food lovers
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Login;
