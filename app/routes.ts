import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("components/MainLayout.tsx", [
    route("/profile", "routes/profile.tsx"),
    // route("/chat/:id", "routes/chat.tsx"), // ← DIKOMENTAR DULU
  ]),
] satisfies RouteConfig;
