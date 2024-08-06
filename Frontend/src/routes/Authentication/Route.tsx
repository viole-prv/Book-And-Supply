import React from "react";

import Edit from "../../pages/Profile/Edit";
import Favorite from "../../pages/Profile/Favorite";
import Order from "../../pages/Profile/Order/Order";
import OrderContainer from "../../pages/Profile/OrderContainer/OrderContainer";

export default [
    { path: "favorite", element: <Favorite /> },
    { path: "order", element: <OrderContainer /> },
    { path: "order/:orderValue", element: <Order /> },
    { path: "edit", element: <Edit /> },
];
