import React, { FC } from "react";

import NavBar from "../../components/NavBar/NavBar";
import { IUser } from "../../services/user.service";

import "./Footer.scss";

type Props = {
    user?: IUser;
};

const Footer: FC<Props> = () => {
    return (
        <footer>
            <div className="footer">
                <div className="footer__nav-bar">
                    <NavBar />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
