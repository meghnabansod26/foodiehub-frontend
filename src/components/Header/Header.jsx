
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <section className="food-header">
      <div className="food-header-overlay">
        <div className="container food-header-content">
          <span className="food-header-tagline">
            FRESH FLAVOURS, HAPPY MOMENTS
          </span>

          <h1>
            Order Your
            <br />
            Favourite <span>Food</span> Here
          </h1>

          <p>
            Discover delicious food, explore new flavours, and get your
            favourite meals delivered right to your doorstep.
          </p>

          <div className="food-header-actions">
            <Link to="/explore" className="food-explore-btn">
              Explore Menu
              <i className="bi bi-arrow-right"></i>
            </Link>

            <span className="food-header-note">
              <i className="bi bi-geo-alt-fill"></i>
              Discover the best food in Pune
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
