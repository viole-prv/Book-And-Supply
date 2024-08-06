import React, { FC } from "react";

import "./Skeleton.scss";

type Props = {
    children: React.ReactNode;
};

const Skeleton: FC<Props> = ({ children }) => {
    return <>{children}</>;
};

export default Skeleton;
