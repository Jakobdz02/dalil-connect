import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import SeekerBookings from "@/pages/seeker/Bookings";

export const Route = createFileRoute("/bookings")({
  component: () => (
    <RoleGuard allow={["seeker"]}>
      <SeekerBookings />
    </RoleGuard>
  ),
});
