// routes.ts //
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("components/MainLayout.tsx", [
    route("/profile", "routes/profile.tsx"),    
  ]),
] satisfies RouteConfig;
