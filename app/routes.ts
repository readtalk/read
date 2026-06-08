import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("welcome/welcome.tsx"), // Ganti home.tsx langsung ke welcome
  route("profile", "routes/profile.tsx"),
  route("chat/:id", "routes/chat.tsx"), // <-- Aktifin ini
] satisfies RouteConfig;
