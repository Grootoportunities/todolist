import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/ui/App";
import {Provider} from "react-redux";
import {store} from "app/store";
import {createHashRouter, RouterProvider} from "react-router-dom";
import {Login} from "features/auth/ui/Login";

const PATH = {
    APP: "/",
    LOGIN: "/login",
};

const router = createHashRouter([
    {
        path: PATH.APP,
        element: <App/>,
    },
    {
        path: PATH.LOGIN,
        element: <Login/>,
    },
]);

const rerenderEntireTree = () => {
    const root = ReactDOM.createRoot(
        document.getElementById("root") as HTMLElement,
    );
    root.render(
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>,
    );
}

rerenderEntireTree()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// @ts-ignore
if (process.env.NODE_ENV === "development" && module.hot) {
    // @ts-ignore
    module.hot.accept("./app/ui/App", () => {
        rerenderEntireTree()
    })
    // @ts-ignore
    module.hot.accept("features/auth/ui/Login", () => {
        rerenderEntireTree()
    })
}