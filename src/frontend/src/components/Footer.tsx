import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "oklch(0.27 0.09 205)" }}
      className="text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/20">
              <Heart className="w-4 h-4" />
            </div>
            <span className="font-bold">MediConnect 2026</span>
          </div>
          <p className="text-white/60 text-sm">
            Your trusted healthcare partner. Find doctors, book appointments,
            and manage your health — all in one place.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>
              <Link to="/find-care" className="hover:text-white">
                Find a Doctor
              </Link>
            </li>
            <li>
              <Link to="/find-care" className="hover:text-white">
                Find a Hospital
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-white">
                Community Events
              </Link>
            </li>
            <li>
              <Link to="/patient-dashboard" className="hover:text-white">
                My Health Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>
              <Link to="/doctor-dashboard" className="hover:text-white">
                For Doctors
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard" className="hover:text-white">
                For Hospitals
              </Link>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">
                Privacy Policy
              </span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">
                Terms of Service
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-white/50 text-sm">
        © 2026 MediConnect. All rights reserved.
      </div>
    </footer>
  );
}
