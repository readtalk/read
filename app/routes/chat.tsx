// app/routes/chat.tsx
import { useParams } from "react-router";
import ChatRoom from "../components/ChatRoom";

export default function ChatPage() {
  const { id } = useParams();
  return <ChatRoom chatId={id || null} />;
}
