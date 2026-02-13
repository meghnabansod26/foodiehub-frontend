import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from "../../context/StoreContext";
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, searchText }) => {
  const { foodList } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (foodList && foodList.length > 0) {
      setLoading(false);
    }
  }, [foodList]);

  const filteredFoods = foodList.filter(food => (
    (category === 'All' || food.category === category) &&
    food.name.toLowerCase().includes(searchText.toLowerCase())
  ));

  return (
    <div className="container">
      <div className="row">

        {loading ? (
          <div className="text-center mt-5 w-100">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Starting server... Please wait</p>
          </div>
        ) : filteredFoods.length > 0 ? (
          filteredFoods.map((food, index) => (
            <FoodItem
              key={index}
              name={food.name}
              description={food.description}
              id={food.id}
              imageUrl={food.imageUrl}
              price={food.price}
            />
          ))
        ) : (
          <div className="text-center mt-4 w-100">
            <h4>No food items found</h4>
          </div>
        )}

      </div>
    </div>
  );
};

export default FoodDisplay;
