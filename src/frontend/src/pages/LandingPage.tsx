import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Shield,
  Star,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import HospitalCard from "../components/HospitalCard";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  sampleDoctors,
  sampleEvents,
  sampleHospitals,
} from "../data/sampleData";

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "AI Symptom Checker",
    desc: "Describe symptoms in plain language and get matched to the right specialist instantly.",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Smart Discovery",
    desc: "Find the best hospitals by distance, ER wait time, and specialty success rates.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Insurance Filter",
    desc: "Filter doctors and hospitals that accept your specific insurance provider.",
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "Verified Doctors",
    desc: "All doctors are manually verified with their medical license and credentials.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Instant Booking",
    desc: "Book consultations or diagnostic tests with one tap, available 24/7.",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Telehealth",
    desc: "See a specialist from home — no two-hour drive needed.",
  },
];

const symptomSuggestions = [
  "Chest pain",
  "High fever",
  "Knee pain",
  "Skin rash",
  "Headache",
  "Back pain",
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate(`/find-care?q=${encodeURIComponent(query)}`);
    else navigate("/find-care");
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[480px] flex items-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.09 210) 0%, oklch(0.35 0.11 200) 60%, oklch(0.48 0.12 190) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="max-w-2xl">
            <Badge
              className="mb-4 text-xs"
              style={{
                backgroundColor: "oklch(0.52 0.13 195 / 0.3)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Healthcare Ecosystem 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Find the Right Care,
              <br />
              Right Now
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Your AI-powered health partner. Search symptoms, find verified
              doctors, and book appointments instantly.
            </p>

            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search symptoms, doctors, hospitals…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 bg-white h-12 rounded-full text-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-12 px-6 rounded-full"
                style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
              >
                Go
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {symptomSuggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    navigate(`/find-care?q=${encodeURIComponent(s)}`);
                  }}
                  className="text-xs text-white/90 border border-white/30 rounded-full px-3 py-1 hover:bg-white/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/patient-dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-white border-white/50 bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  Patient Access
                </Button>
              </Link>
              <Link to="/doctor-dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-white border-white/50 bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  Doctor Portal
                </Button>
              </Link>
              <Link to="/admin-dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-white border-white/50 bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find Fast, Reliable Care */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "oklch(0.97 0.008 200)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Find Fast, Reliable Care
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Top-rated doctors and hospitals, verified and ready to help
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleDoctors.slice(0, 3).map((d) => (
              <DoctorCard key={String(d.id)} doctor={d} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/find-care">
              <Button
                variant="outline"
                style={{
                  borderColor: "oklch(0.52 0.13 195)",
                  color: "oklch(0.52 0.13 195)",
                }}
              >
                View All Doctors & Hospitals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Hospitals */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Hospitals Near You
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Real-time ER wait times and department availability
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleHospitals.map((h) => (
              <HospitalCard key={String(h.id)} hospital={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "oklch(0.97 0.008 200)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            MediConnect 2026 Features
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Everything you need, in one platform
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{
                    backgroundColor: "oklch(0.92 0.04 195)",
                    color: "oklch(0.52 0.13 195)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">
            Trusted by Patients, Doctors & Facilities
          </h2>
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            {[
              "50,000+ Patients",
              "2,000+ Verified Doctors",
              "150+ Hospitals",
              "98% Satisfaction",
              "24/7 Support",
            ].map((t) => (
              <div key={t} className="flex items-center gap-1 font-semibold">
                <Star
                  className="w-4 h-4"
                  style={{ color: "oklch(0.75 0.15 85)" }}
                />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Events */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "oklch(0.97 0.008 200)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Community Events
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Free screenings, webinars, and nutrition tours near you
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleEvents.slice(0, 2).map((ev) => (
              <div
                key={String(ev.id)}
                className="bg-white rounded-xl p-5 shadow-sm border border-border"
              >
                <Badge variant="secondary" className="mb-2 text-xs">
                  {typeof ev.eventType === "object" &&
                  ev.eventType !== null &&
                  "webinar" in ev.eventType
                    ? "Webinar"
                    : typeof ev.eventType === "object" &&
                        ev.eventType !== null &&
                        "popupClinic" in ev.eventType
                      ? "Pop-Up Clinic"
                      : "Nutrition Tour"}
                </Badge>
                <h3 className="font-semibold mb-1">{ev.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {ev.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {ev.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ev.dateTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/events">
              <Button
                variant="outline"
                style={{
                  borderColor: "oklch(0.52 0.13 195)",
                  color: "oklch(0.52 0.13 195)",
                }}
              >
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Telehealth CTA */}
      <section
        className="py-16 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.32 0.09 205) 0%, oklch(0.45 0.12 195) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Can't make it in person?</h2>
          <p className="text-white/80 mb-6">
            See a specialist from the comfort of your home. No commute. No
            waiting rooms. Available now.
          </p>
          <Link to="/find-care">
            <Button
              className="bg-white font-semibold"
              style={{ color: "oklch(0.32 0.09 205)" }}
            >
              Start Telehealth Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
