import React from "react";
import { Route, Routes } from "react-router-dom/dist";
import MainLayouts from "../layout/MainLayouts";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import Game from "../pages/Game";

function MainRoute() {
  return (
    <Routes>
      <Route element={<MainLayouts />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/shop" element={<ShopPage />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
