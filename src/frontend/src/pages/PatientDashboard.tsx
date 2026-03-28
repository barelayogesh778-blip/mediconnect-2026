import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    date: "2026-04-10T09:00:00",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    doctor: "Dr. James Okafor",
    specialty: "Pediatrician",
    date: "2026-04-20T14:00:00",
    type: "Consultation",
    status: "pending",
  },
  {
    id: 3,
    doctor: "Dr. Michael Torres",
    specialty: "Orthopedist",
    date: "2026-03-15T11:00:00",
    type: "Diagnostic",
    status: "completed",
  },
];

const statusColors: Record<string, string> = {
  confirmed: "oklch(0.52 0.13 195)",
  pending: "oklch(0.65 0.18 85)",
  completed: "oklch(0.5 0.15 150)",
  cancelled: "oklch(0.55 0.2 25)",
};

export default function PatientDashboard() {
  const { identity, login } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Patient Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to view your appointments and health records.
        </p>
        <Button
          onClick={login}
          style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
        >
          Log in with Internet Identity
        </Button>
      </div>
    );
  }

  const upcoming = mockAppointments.filter((a) => a.status !== "completed");
  const past = mockAppointments.filter((a) => a.status === "completed");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Health Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              {upcoming.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Upcoming Appointments
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              {past.length}
            </div>
            <div className="text-sm text-muted-foreground">Past Visits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.75 0.15 85)" }}
            >
              3
            </div>
            <div className="text-sm text-muted-foreground">Reviews Given</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-3 mb-8">
        {upcoming.map((apt) => (
          <Card key={apt.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">{apt.doctor}</div>
                  <div className="text-sm text-muted-foreground">
                    {apt.specialty} • {apt.type}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(apt.date).toLocaleString()}
                  </div>
                </div>
                <Badge
                  style={{
                    backgroundColor: statusColors[apt.status],
                    color: "white",
                  }}
                >
                  {apt.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {upcoming.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No upcoming appointments.
          </p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Past Visits</h2>
      <div className="space-y-3 mb-8">
        {past.map((apt) => (
          <Card key={apt.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">{apt.doctor}</div>
                  <div className="text-sm text-muted-foreground">
                    {apt.specialty} • {apt.type}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(apt.date).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">completed</Badge>
                  <Button size="sm" variant="outline">
                    Rebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/find-care">
          <Button style={{ backgroundColor: "oklch(0.52 0.13 195)" }}>
            Book New Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}
