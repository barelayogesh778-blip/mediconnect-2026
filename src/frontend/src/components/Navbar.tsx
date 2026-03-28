import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "./ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { identity, login, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const links = [
    { label: "Home", to: "/" },
    { label: "Find Care", to: "/find-care" },
    { label: "Events", to: "/events" },
    { label: "For Doctors", to: "/doctor-dashboard" },
    { label: "Admin", to: "/admin-dashboard" },
  ];

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg"
          style={{ color: "oklch(0.32 0.09 205)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
          >
            <Heart className="w-4 h-4 text-white" />
          </div>
          MediConnect 2026
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors pb-0.5 ${
                isActive(l.to)
                  ? "border-b-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                isActive(l.to)
                  ? {
                      borderColor: "oklch(0.52 0.13 195)",
                      color: "oklch(0.52 0.13 195)",
                    }
                  : {}
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link to="/patient-dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button size="sm" onClick={clear} variant="outline">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={login}>
                Log in
              </Button>
              <Button
                size="sm"
                onClick={login}
                style={{ backgroundColor: "oklch(0.32 0.09 205)" }}
              >
                Register
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={clear}>
              Log out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              style={{ backgroundColor: "oklch(0.32 0.09 205)" }}
            >
              Log in / Register
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
