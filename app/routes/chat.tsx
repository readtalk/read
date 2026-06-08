// app/routes/chat.tsx
import { useParams, useNavigate } from "react-router";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import ChatRoom from "~/components/ChatRoom";
import ResendList from "~/components/ResendList";
import { dummyChats } from "~/components/ResendList";

export default function ChatRoute() {
  const { id } = useParams(); // ambil :id dari URL
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const chatId = Number(id);
  
  // Validasi ID nggak ada
  const chatExists = dummyChats.some(c => c.id === chatId);
  if (!chatExists) {
    throw new Response("Chat Not Found", { status: 404 });
  }

  return (
    <div className="app-main">
      {/* Di desktop: sidebar tetap muncul */}
      {isDesktop && (
        <aside className="app-sidebar">
          <ResendList onSelectChat={(id) => navigate(`/chat/${id}`)} />
        </aside>
      )}
      
      <main className="app-content">
        <ChatRoom chatId={chatId} onBack={() => navigate("/")} />
      </main>
    </div>
  );
}
