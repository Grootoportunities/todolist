import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { appActions } from "../../app/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export function ErrorSnackbar() {
  const dispatch = useAppDispatch();

  const error = useAppSelector((state) => state.app.error);

  const isOpen = !!error;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(appActions.setAppError({ error: null }));
  };
  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error} 😠
      </Alert>
    </Snackbar>
  );
}

// export default function CustomizedSnackbars() {
//   const [open, setOpen] = React.useState(false);
//
//   const handleClick = () => {
//     setOpen(true);
//   };
//
//   const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//
//     setOpen(false);
//   };
//
//   return (
//       <div>
//         <Button onClick={handleClick}>Open Snackbar</Button>
//         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//           <Alert
//               onClose={handleClose}
//               severity="success"
//               variant="filled"
//               sx={{ width: '100%' }}
//           >
//             This is a success Alert inside a Snackbar!
//           </Alert>
//         </Snackbar>
//       </div>
//   );
// }
