import { useParams } from "react-router";

export default function ChatPage() {
  const { id } = useParams();
  return <div>Chat Room {id}</div>;
}
