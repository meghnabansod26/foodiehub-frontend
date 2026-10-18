
import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './ExploreFood.css';

const ExploreFood = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const categories = [
    'All',
    'Biryani',
    'Burger',
    'Cake',
    'Ice cream',
    'Pizza',
    'Rolls',
    'Salad',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="explore-food-page">
      <div className="explore-food-container">
        <section className="explore-food-intro">
          <span className="explore-food-eyebrow">
            FIND YOUR FAVOURITE
          </span>

          <h1>
            Explore Our <span>Food</span>
          </h1>

          <p>
            Discover delicious dishes made to satisfy every craving.
          </p>
        </section>

        <form
          className="explore-search-panel"
          onSubmit={handleSubmit}
        >
          <div className="explore-search-category">
            <i className="bi bi-grid" />

            <select
              aria-label="Filter by food category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'Cake'
                    ? 'Cakes'
                    : item === 'Ice cream'
                    ? 'Ice Cream'
                    : item}
                </option>
              ))}
            </select>
          </div>

          <div className="explore-search-input">
            <i className="bi bi-search" />

            <input
              type="search"
              placeholder="Search your favourite dish..."
              aria-label="Search food"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText && (
              <button
                type="button"
                className="explore-clear-button"
                onClick={() => setSearchText('')}
                aria-label="Clear search"
              >
                <i className="bi bi-x-circle" />
              </button>
            )}
          </div>

          <button className="explore-search-button" type="submit">
            <i className="bi bi-search" />
            <span>Search</span>
          </button>
        </form>

        <FoodDisplay
          category={category}
          searchText={searchText}
        />
      </div>
    </main>
  );
};

export default ExploreFood;
