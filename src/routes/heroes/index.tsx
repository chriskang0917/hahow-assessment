import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/heroes/")({
  component: () => <div>Heroes</div>,
});
