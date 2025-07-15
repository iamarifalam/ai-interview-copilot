import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import ChatBubble from './components/ChatBubble';
import TypingDots from './components/TypingDots';
import MicButton from './components/MicButton';
import { useSpeech } from './utils/speech';

const App = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const speech = useSpeech((text) => {
    setInput((prev) => (prev ? prev + ' ' + text : text));
  });

  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) setChat(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chat));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: 'user', content: input }];
    setChat(newChat);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful AI interview assistant.' },
            ...newChat,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
}
,
        }
      );

      const reply = res.data.choices?.[0]?.message?.content || 'No response';
      setChat([...newChat, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.message;
      setChat([...newChat, { role: 'assistant', content: `❌ Error: ${errMsg}` }]);
    }

    setLoading(false);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen transition-colors duration-500`}>
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
        <nav className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 sticky top-0 z-50 shadow-sm border-b dark:border-gray-700 flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-white">Interview Copilot</h1>
          <div className="space-x-4 hidden md:flex">
            {['Copilot', 'AI Mock', 'Features', 'Resources'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                {item}
              </a>
            ))}
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm font-semibold px-4 py-1 rounded-full border border-indigo-500 dark:border-white text-indigo-600 dark:text-white hover:bg-indigo-100 dark:hover:bg-gray-700 transition-all"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>

        <main id="copilot" className="p-6 md:p-12 space-y-6">
          <AnimatePresence>
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ChatBubble text={msg.content} isUser={msg.role === 'user'} />
              </motion.div>
            ))}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto px-6 py-4 rounded-xl bg-white/60 dark:bg-white/10 shadow-md flex items-center gap-2"
              >
                <TypingDots />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Typing...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </main>

        <footer className="px-6 py-6 bg-white/80 dark:bg-gray-900/80 border-t border-gray-300 dark:border-gray-700 backdrop-blur-md sticky bottom-0 z-40">
          <div className="max-w-3xl mx-auto flex items-end gap-4">
            <textarea
              className="flex-grow p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 resize-none shadow focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 dark:bg-gray-800 dark:text-white"
              placeholder="Ask your interview question..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {loading ? 'Sending' : 'Send'}
            </button>
            <MicButton onClick={() => speech.start()} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
