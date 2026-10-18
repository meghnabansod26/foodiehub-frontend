
import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const FoodDisplay = ({ category, searchText = '' }) => {
  const { foodList = [] } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (foodList.length > 0) {
      setLoading(false);
    }
  }, [foodList]);

  // Show the empty state if the server returns an empty list.
  useEffect(() => {
    if (Array.isArray(foodList)) {
      setLoading(false);
    }
  }, [foodList]);

  const filteredFoods = foodList.filter((food) => {
    const matchesCategory =
      category === 'All' || food.category === category;

    const matchesSearch = (food.name || '')
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="food-display">
      <div className="food-display-heading">
        <div>
          <span className="food-display-eyebrow">
            MADE FRESH FOR YOU
          </span>
          <h2>Popular Dishes<span>.</span></h2>
          <p>Explore delicious meals prepared to satisfy your cravings.</p>
        </div>

        {!loading && (
          <span className="food-count">
            {filteredFoods.length} items
          </span>
        )}
      </div>

      {loading ? (
        <div className="food-loading">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading delicious food...</p>
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="food-display-grid">
          {filteredFoods.map((food) => (
            <FoodItem
              key={food.id}
              name={food.name}
              description={food.description}
              id={food.id}
              imageUrl={food.imageUrl}
              price={food.price}
            />
          ))}
        </div>
      ) : (
        <div className="food-empty">
          <span className="empty-icon">🍽️</span>
          <h3>No dishes found</h3>
          <p>Try another category or search for a different dish.</p>
        </div>
      )}
    </section>
  );
};

export default FoodDisplay;
