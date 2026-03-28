import { Building2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { sampleHospitals } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const adminReviews = [
  {
    name: "Carlos R.",
    rating: 5,
    comment: "Fast ER service.",
    responded: false,
  },
  {
    name: "Susan K.",
    rating: 4,
    comment: "Clean facilities.",
    responded: true,
  },
];

export default function AdminDashboard() {
  const { identity, login } = useInternetIdentity();
  const [erWait, setErWait] = useState("12");
  const hospital = sampleHospitals[0];

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Hospital Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to manage your hospital profile.
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
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard — {hospital.name}
      </h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              24
            </div>
            <div className="text-sm text-muted-foreground">Bookings Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "oklch(0.52 0.13 195)" }}
            >
              4.9
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
              342
            </div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="er">ER Wait Time</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="hosp-name"
                  className="text-sm font-medium block mb-1"
                >
                  Hospital Name
                </label>
                <Input id="hosp-name" defaultValue={hospital.name} />
              </div>
              <div>
                <label
                  htmlFor="hosp-address"
                  className="text-sm font-medium block mb-1"
                >
                  Address
                </label>
                <Input id="hosp-address" defaultValue={hospital.address} />
              </div>
              <div>
                <label
                  htmlFor="hosp-desc"
                  className="text-sm font-medium block mb-1"
                >
                  Description
                </label>
                <textarea
                  id="hosp-desc"
                  defaultValue={hospital.description}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
              <Button style={{ backgroundColor: "oklch(0.52 0.13 195)" }}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="er">
          <Card>
            <CardHeader>
              <CardTitle>Update ER Wait Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="er-wait"
                  className="text-sm font-medium block mb-1"
                >
                  Current ER Wait (minutes)
                </label>
                <Input
                  id="er-wait"
                  type="number"
                  value={erWait}
                  onChange={(e) => setErWait(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <Button style={{ backgroundColor: "oklch(0.52 0.13 195)" }}>
                Update Wait Time
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-3">
            {adminReviews.map((r) => (
              <Card key={r.name}>
                <CardContent className="pt-4 pb-4">
                  <div className="font-medium text-sm mb-1">
                    {r.name} — ⭐ {r.rating}/5
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {r.comment}
                  </p>
                  {r.responded ? (
                    <Badge variant="secondary" className="text-xs">
                      Responded
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Reply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Manage Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {hospital.departments.map((d) => (
                  <Badge
                    key={d}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {d}{" "}
                    <button
                      type="button"
                      className="ml-1 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <label htmlFor="new-dept" className="sr-only">
                  New department name
                </label>
                <Input
                  id="new-dept"
                  placeholder="Add department…"
                  className="max-w-xs"
                />
                <Button variant="outline">Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
