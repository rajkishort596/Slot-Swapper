import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import Marketplace from "./pages/Marketplace";
import SwapRequests from "./pages/SwapRequests";

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/" element={<RootLayout />}>
          {/* Public routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Protected route */}
          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="marketplace"
            element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            }
          />
          <Route
            path="swaprequests"
            element={
              <PrivateRoute>
                <SwapRequests />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
