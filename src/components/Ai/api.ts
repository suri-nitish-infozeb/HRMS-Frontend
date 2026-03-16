import axios from "axios";
import type { Message } from "./types";
import { formatReplyToMessage } from "./Formatter";

interface AIRequestPayload {
  message: string;
  userName: string;
  email: string;
}

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_API_URL;

export async function fetchAIResponse(promptPayload: {
  username: string;
  email: string;
  prompt: string;
}): Promise<Message> {
  const payload: AIRequestPayload = {
    message: promptPayload.prompt,
    userName: promptPayload.username,
    email: promptPayload.email,
  };

  console.log(" Endpoint:", CHAT_ENDPOINT);
  console.log(" Payload:", payload);

  try {
    const res = await axios.post(CHAT_ENDPOINT, payload);
    console.log(" Raw response:", res.data);

    const reply: string = res.data.reply ?? "";

    // ✅ Pass BOTH the reply AND the original user prompt
    // so formatter knows if user explicitly requested a format
    const formatted = await formatReplyToMessage(reply, promptPayload.prompt);

    return {
      ...formatted,
      id: crypto.randomUUID(),
      role: "assistant",
      timestamp: new Date().toISOString(),
    } as Message;

  } catch (err) {
    console.error(" API Error:", err);

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      type: "text",
      timestamp: new Date().toISOString(),
      content: "Sorry, something went wrong. Please try again.",
    };
  }
}