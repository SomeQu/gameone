import React from "react";
import { Outlet } from "react-router-dom/dist";

function MainLayouts() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MainLayouts;
