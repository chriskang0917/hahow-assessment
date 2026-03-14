import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/supplier/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/supplier/home"!</div>;
}
