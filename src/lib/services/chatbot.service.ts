import { fetchApi } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_CONTEXT_MESSAGES = 20;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const data = await fetchApi('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ messages: messages.slice(-MAX_CONTEXT_MESSAGES) }),
  });
  return (data as { reply: string }).reply;
}
