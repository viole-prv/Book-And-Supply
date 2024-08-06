import React, { FC } from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Look from "../Look/Look";

import "./Header.scss";

const Header: FC = () => {
    return (
        <header>
            <div className="header">
                <Link
                    to="/"
                    className="header__picture"
                >
                    Book & Supply
                </Link>
                <Look placeholder="Поиск" />
                <div className="header__nav-bar">
                    <NavBar />
                </div>
            </div>
        </header>
    );
};

export default Header;
