import React from "react";
import { useOutlet } from "react-router-dom";

import Position from "../../components/Position/Position";

import "./Profile.scss";

const Profile = () => {
    const T = useOutlet();

    return (
        <Position
            path={[
                {
                    header: "Покупки",
                    value: [
                        {
                            to: "favorite",
                            key: "Избранное",
                            header: false,
                        },
                        { to: "order", key: "Заказы", header: true },
                    ],
                },
                {
                    header: "Профиль",
                    value: [{ to: "edit", key: "Настройки", header: true }],
                },
            ]}
        >
            {T}
        </Position>
    );
};

export default Profile;
