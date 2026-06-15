import { fetchApi } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const data = await fetchApi('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
  return (data as { reply: string }).reply;
}
