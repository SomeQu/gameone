import React from "react";
import { Route, Routes } from "react-router-dom/dist";
import MainLayouts from "../layout/MainLayouts";
import HomePage from "../pages/HomePage";
import Game from "../pages/Game";
import { Shop } from "../pages/Shop/shop";
import { Registration } from "../pages/Registration/registr";
import { Login } from "../pages/Login/log";
import ChooseHero from "../pages/ChooseHero";

function MainRoute() {
  return (
    <Routes>
      <Route element={<MainLayouts />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/reg" element={<Registration />} />
        <Route path="/log" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/shop" element={<Shop />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
