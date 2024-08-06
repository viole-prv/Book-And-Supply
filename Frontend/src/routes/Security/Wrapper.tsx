import React, { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { IUser } from "../../services/user.service";

type Props = {
    user: IUser | undefined;
};

const Wrapper: FC<Props> = ({ user }) => {
    if (user === undefined) {
        return <Navigate to="/login" />;
    }

    if (user.login !== "Viole") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default Wrapper;
