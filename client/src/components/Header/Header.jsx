import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authSlice.js";
import { Bell, Menu, X } from "lucide-react";
import { logoutUser } from "../../api/auth.Api.js";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      setMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Logout failed.";
      toast.error(errorMsg);
    }
  };

  return (
    <header className="header relative border-b border-white/10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 z-20">
        <div className="size-6 text-primary">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-tight">
          SlotSwapper
        </span>
      </Link>

      {/* Hamburger Icon for mobile */}
      <button
        className="md:hidden z-20"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        {isAuthenticated ? (
          <>
            <nav className="flex items-center gap-5 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors font-medium ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  `transition-colors font-medium ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) =>
                  `transition-colors font-medium ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Swap Requests
              </NavLink>
            </nav>

            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-card-hover transition-colors"
            >
              <Bell size={18} />
            </button>

            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-all">
              {user?.name?.[0]?.toUpperCase() || "⦿"}
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-primary text-sm px-4 py-2 cursor-pointer"
              title="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="btn btn-muted text-sm px-4 py-2 cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary text-sm px-4 py-2 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background-dark border-l border-white/10 shadow-lg transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-10`}
      >
        <div className="flex flex-col items-start p-6 space-y-6 mt-14">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/marketplace"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/requests"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg ${
                    isActive
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                Swap Requests
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-primary hover:bg-[color-mix(in_oklab,var(--color-primary)_90%,black)] text-center py-2 rounded-lg font-medium text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dim background overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-0"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
