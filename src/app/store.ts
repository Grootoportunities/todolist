import {configureStore} from "@reduxjs/toolkit";
import {reducer} from "./reducers";

export const store = configureStore({
    reducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;

// @ts-ignore
if (process.env.NODE_ENV === "development" && module.hot) {
    // @ts-ignore
    module.hot.accept("./reducers", () => {
        store.replaceReducer(reducer)
    })
}