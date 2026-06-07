// app/components/ChatRoom.tsx
import { useState } from "react";

export default function ChatRoom({ chatId }: { chatId: string | null }) {
  const [newMessage, setNewMessage] = useState("");

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Dummy messages */}
        <div className="text-center text-gray-400 text-sm">Chat room for {chatId}</div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 outline-none"
          />
          <button className="px-4 py-2 bg-red-600 text-white rounded-full">Send</button>
        </div>
      </div>
    </div>
  );
}
