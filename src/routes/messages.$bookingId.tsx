import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/guards/AuthGuard";
import Conversation from "@/pages/messaging/Conversation";

export const Route = createFileRoute("/messages/$bookingId")({
  component: () => {
    const { bookingId } = Route.useParams();
    return (
      <AuthGuard>
        <Conversation bookingId={bookingId} />
      </AuthGuard>
    );
  },
});
