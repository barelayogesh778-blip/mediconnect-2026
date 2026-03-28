import { Stethoscope } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const mockSchedule = [
  {
    id: 1,
    patient: "Alice M.",
    type: "Consultation",
    date: "2026-04-10T09:00:00",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Bob T.",
    type: "Diagnostic",
    date: "2026-04-11T11:00:00",
    status: "pending",
  },
  {
    id: 3,
    patient: "Clara K.",
    type: "Consultation",
    date: "2026-04-12T14:00:00",
    status: "pending",
  },
];

export default function DoctorDashboard() {
  const { identity, login } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Doctor Portal</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access your appointments and profile.
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Doctor Portal</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              3
            </div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              4.8
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.75 0.15 85)" }}
            >
              128
            </div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
      <div className="space-y-3">
        {mockSchedule.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">{s.patient}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.type} • {new Date(s.date).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={s.status === "confirmed" ? "default" : "secondary"}
                    style={
                      s.status === "confirmed"
                        ? { backgroundColor: "oklch(0.52 0.13 195)" }
                        : {}
                    }
                  >
                    {s.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
