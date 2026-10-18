
import React, { useRef } from 'react';
import { categories } from '../../assets/assets';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  const scrollMenu = (direction) => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: direction * 250,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setCategory((currentCategory) =>
      currentCategory === selectedCategory ? 'All' : selectedCategory
    );
  };

  return (
    <section className="explore-menu">
      <div className="explore-menu-heading">
        <div>
          <span className="explore-menu-eyebrow">
            DISCOVER YOUR FAVOURITES
          </span>

          <h2>
            Explore Our <span>Menu</span>
          </h2>

          <p>
            From delicious meals to sweet treats, find something you love.
          </p>
        </div>

        <div className="explore-menu-arrows">
          <button
            type="button"
            className="explore-scroll-button"
            onClick={() => scrollMenu(-1)}
            aria-label="Scroll categories left"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <button
            type="button"
            className="explore-scroll-button"
            onClick={() => scrollMenu(1)}
            aria-label="Scroll categories right"
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <div
        className="explore-menu-list"
        ref={menuRef}
        role="group"
        aria-label="Food categories"
      >
        {categories.map((item) => {
          const isActive = item.category === category;

          return (
            <button
              type="button"
              key={item.category}
              className={`explore-menu-list-item ${
                isActive ? 'category-active' : ''
              }`}
              onClick={() => handleCategoryClick(item.category)}
              aria-pressed={isActive}
            >
              <span className="explore-category-image">
                <img
                  src={item.icon}
                  alt={item.category}
                  loading="lazy"
                />
              </span>

              <span className="explore-category-name">
                {item.category}
              </span>

              <span className="explore-category-indicator" />
            </button>
          );
        })}
      </div>

      <div className="explore-menu-divider" />
    </section>
  );
};

export default ExploreMenu;
