import React from "react";

import { Category, CategoryUpdate } from "../../pages/Security/Category";
import { Piece, PieceUpdate } from "../../pages/Security/Piece";
import { Promotion } from "../../pages/Security/Promotion";
import { User } from "../../pages/Security/User";

export default [
    {
        path: "category",
        element: (
            <Category
                id={0}
                tag=""
                name=""
                property={[]}
            />
        ),
    },
    {
        path: "category/:categoryValue",
        element: <CategoryUpdate />,
    },
    {
        path: "piece",
        element: (
            <Piece
                id={0}
                tag=""
                name=""
                picture={[]}
                price={0}
                property={[]}
                description=""
                count={0}
                category={null}
                promotion={null}
            />
        ),
    },
    {
        path: "piece/:pieceValue",
        element: <PieceUpdate />,
    },
    { path: "promotion", element: <Promotion /> },
    { path: "user", element: <User /> },
];
