import React, { FC } from "react";

import OrderService from "../../../services/order.service";

import Card from "./Card";

import "./OrderContainer.scss";

const OrderContainer: FC = () => {
    const { isLoading, data: orderList } = OrderService.Entry(60 * 1000);

    if (isLoading) return null;

    return (
        <div className="profile__order-container">
            <div className="order-container">
                {orderList?.map((order) => (
                    <Card
                        key={order.tag}
                        order={order}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderContainer;
