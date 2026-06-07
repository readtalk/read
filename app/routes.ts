import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("components/MainLayout.tsx", [
    route("/profile", "routes/profile.tsx"),
    // route("/chat", "routes/chat.tsx"),
    // route("/settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
