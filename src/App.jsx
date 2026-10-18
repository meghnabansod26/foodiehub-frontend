import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import Menubar from "./components/Menubar/Menubar";
import Home from "./pages/Home/Home";
import ContactUs from "./pages/Contact Us/ContactUs";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyOrders from "./pages/MyOrders/MyOrders";

import { ToastContainer } from "react-toastify";
import { StoreContext } from "./context/StoreContext";

import FoodRecommendationAssistant from "./components/FoodRecommendationAssistant/FoodRecommendationAssistant";

const App = () => {
  const { token } = useContext(StoreContext);

  return (
    <div>
      <Menubar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/order"
          element={token ? <PlaceOrder /> : <Login />}
        />

        <Route
          path="/login"
          element={token ? <Home /> : <Login />}
        />

        <Route
          path="/register"
          element={token ? <Home /> : <Register />}
        />

        <Route
          path="/myorders"
          element={token ? <MyOrders /> : <Login />}
        />
      </Routes>

      {/* Floating AI assistant appears on every route */}
      <FoodRecommendationAssistant />
    </div>
  );
};

export default App;