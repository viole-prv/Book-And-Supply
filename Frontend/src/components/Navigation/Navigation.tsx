import React, { FC } from "react";
import { NavLink, useParams } from "react-router-dom";

import { queryClient } from "../../index";
import { ICategory } from "../../services/category.service";
import { IPiece } from "../../services/piece.service";
import { CN } from "../../utils/Helper";

import "./Navigation.scss";

const Navigation: FC = () => {
    const { categoryValue, pieceValue } = useParams<{
        categoryValue: string;
        pieceValue: string;
    }>();

    const category = queryClient.getQueryData<ICategory>([
        "category",
        { tag: categoryValue },
    ]);

    const piece = queryClient.getQueryData<IPiece>([
        "piece",
        { tag: pieceValue },
    ]);

    return (
        <div className="navigation-wrapper">
            <NavLink
                to="/"
                className="navigation"
            >
                Каталог
            </NavLink>
            {category && (
                <>
                    <NavLink
                        end
                        className={({ isActive }) =>
                            CN("navigation", isActive && "navigation-current")
                        }
                        to={`/${category.tag}`}
                    >
                        {category.name}
                    </NavLink>
                </>
            )}
            {piece && (
                <NavLink
                    end
                    className={({ isActive }) =>
                        CN("navigation", isActive && "navigation-current")
                    }
                    to={`/${category?.tag}/${piece.tag}`}
                >
                    {piece.name}
                </NavLink>
            )}
        </div>
    );
};

export default Navigation;
