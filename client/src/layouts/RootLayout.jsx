import { Outlet, useNavigate } from "react-router-dom";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";
import { useEffect } from "react";
import { logout, setAuthStatus, setCredentials } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../api/auth.Api";
import Spinner from "../components/Spinner";

const RootLayout = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    const hydrateUser = async () => {
      dispatch(setAuthStatus("loading"));
      try {
        const res = await fetchUser();
        dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
        dispatch(setAuthStatus("succeeded"));
      } catch (err) {
        dispatch(logout());
        console.log(err);
        dispatch(setAuthStatus("failed"));
        navigate("/login");
      }
    };

    if (status === "idle") {
      hydrateUser();
    }
  }, [dispatch, navigate, status]);

  // Loading screen
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 relative px-4 lg:px-6 xl:px-31 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default RootLayout;
