import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import GuideBookings from "@/pages/guide/Bookings";

export const Route = createFileRoute("/guide/bookings")({
  component: () => (
    <RoleGuard allow={["guide"]}>
      <GuideBookings />
    </RoleGuard>
  ),
});
