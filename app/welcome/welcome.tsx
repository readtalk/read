import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "READTalk" },
    { name: "description", content: "Welcome to READTalk!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  // Ambil VALUE_FROM_CLOUDFLARE dari wrangler.jsonc
  const message = context.cloudflare.env.VALUE_FROM_CLOUDFLARE || "https://auth.readtalk.workers.dev";
  return { message };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
