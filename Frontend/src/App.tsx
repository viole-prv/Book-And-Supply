import React, { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Bag from "./pages/Bag/Bag";
import Category from "./pages/Category/Category";
import Home from "./pages/Home/Home";
import Piece from "./pages/Piece/Piece";
import Profile from "./pages/Profile/Profile";
import Security from "./pages/Security/Security";
import { DefaultProvider } from "./providers/Default/Default";
import { Toaster, ToasterProvider } from "./providers/Toaster/Toaster";
import AuthorizationRoute from "./routes/Authentication/Route";
import AuthorizationWrapper from "./routes/Authentication/Wrapper";
import PublicRoute from "./routes/Public/Route";
import PublicWrapper from "./routes/Public/Wrapper";
import SecurityRoute from "./routes/Security/Route";
import SecurityWrapper from "./routes/Security/Wrapper";
import CategoryService from "./services/category.service";
import UserService from "./services/user.service";

import "./App.scss";

const App: FC = () => {
    const { isLoading: categoryLoading, error: categoryError } =
        CategoryService.Entry();

    const {
        isLoading: userLoading,
        data: user,
        error: userError,
    } = UserService.Entry();

    if (categoryLoading || userLoading) return null;

    if (categoryError || userError) return null;

    return (
        <ToasterProvider>
            <DefaultProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route element={<AuthorizationWrapper user={user} />}>
                            <Route
                                path="/bag"
                                element={<Bag />}
                            />
                            <Route
                                path="/profile"
                                element={<Profile />}
                            >
                                {AuthorizationRoute.map(({ path, element }) => (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={element}
                                    />
                                ))}
                            </Route>
                        </Route>

                        <Route element={<SecurityWrapper user={user} />}>
                            <Route
                                path="/security"
                                element={<Security />}
                            >
                                {SecurityRoute.map(({ path, element }) => (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={element}
                                    />
                                ))}
                            </Route>
                        </Route>

                        <Route element={<PublicWrapper user={user} />}>
                            {PublicRoute.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={element}
                                />
                            ))}
                        </Route>

                        <Route
                            path="/"
                            element={<Category />}
                        />

                        <Route
                            path="/:categoryValue"
                            element={<Home />}
                        />
                        <Route
                            path="/:categoryValue/:pieceValue/"
                            element={<Piece critique={false} />}
                        />
                        <Route
                            path="/:categoryValue/:pieceValue/critique"
                            element={<Piece critique={true} />}
                        />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </DefaultProvider>
            <Toaster />
        </ToasterProvider>
    );
};

export default App;
