
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './Home.css';

const Home = () => {
  const [category, setCategory] = useState('All');

  return (
    <main className="home-page">
      <div className="home-container">
        <Header />

        <section className="home-menu-section">
          <ExploreMenu
            category={category}
            setCategory={setCategory}
          />
        </section>

        <section className="home-food-section">
          <FoodDisplay
            category={category}
            searchText=""
          />
        </section>
      </div>
    </main>
  );
};

export default Home;
