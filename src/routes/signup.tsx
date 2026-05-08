import { createFileRoute } from "@tanstack/react-router";
import Signup from "@/pages/public/Signup";

export const Route = createFileRoute("/signup")({ component: Signup });
