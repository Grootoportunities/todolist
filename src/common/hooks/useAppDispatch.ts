import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

// //TODO Так делать правильнее, потому что мы даём нашему appDispatch тип, которым правильно пользоваться?
// export const useAppDispatch: () => AppDispatch = useDispatch;
