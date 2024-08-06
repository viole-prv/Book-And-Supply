import React, { FC, useContext } from "react";
import { NavLink } from "react-router-dom";

import { Context as Default } from "../../providers/Default/Default";
import { CN } from "../../utils/Helper";

import "./Position.scss";

interface IValue {
    to: string;
    key: string;
    header: boolean;
}

export interface IPosition {
    header: string;
    value: Array<IValue>;
}

type Props = {
    path: Array<IPosition>;
    children: React.ReactElement | null;
};

const Position: FC<Props> = ({ path, children }) => {
    const { isDesktop } = useContext(Default);

    return (
        <main className="position-wrapper">
            <div className="position">
                {(!children || isDesktop) && (
                    <div className="position__group">
                        {path.map(({ header, value }) => (
                            <div
                                key={header}
                                className="group-wrapper"
                            >
                                <span className="group__header">{header}</span>
                                <div className="group-container">
                                    {value.map(({ to, key }) => (
                                        <NavLink
                                            end
                                            key={key}
                                            className={({ isActive }) =>
                                                CN(
                                                    "group",
                                                    isActive && "group-current",
                                                )
                                            }
                                            to={to}
                                        >
                                            {key}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {children && (
                    <div className="position__container">{children}</div>
                )}
            </div>
        </main>
    );
};

export default Position;
