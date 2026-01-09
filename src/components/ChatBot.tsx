import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isVoice?: boolean;
}

interface ChatBotProps {
  welcomeMessage: string;
  placeholder: string;
  onlineText: string;
}

// Webhook URL - replace with your actual webhook
const WEBHOOK_URL = 'https://your-webhook-url.com/chat';

export function ChatBot({ welcomeMessage, placeholder, onlineText }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: welcomeMessage, isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || data.message || 'Thank you for your message! Our team will assist you shortly.',
          isBot: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Webhook error:', error);
      // Fallback response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! Our team will get back to you shortly. For urgent inquiries, please call us at +20 123 456 7890.',
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and send voice message simulation
      setIsRecording(false);
      const voiceMessage: Message = {
        id: Date.now().toString(),
        text: '🎤 Voice message sent',
        isBot: false,
        isVoice: true,
      };
      setMessages((prev) => [...prev, voiceMessage]);
      
      // Bot response for voice
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I received your voice message! Our team will listen and respond shortly.',
          isBot: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <>
      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg z-50 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-border"
          >
            {/* Header */}
            <div className="p-4 bg-card border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Egypt Tours</h3>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {onlineText}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-muted/30 flex flex-col gap-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`max-w-[80%] ${message.isBot ? 'self-start' : 'self-end'}`}
                >
                  {message.isVoice ? (
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-2xl flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-primary-foreground/60 rounded-full"
                            animate={{
                              height: [8, 16, 8],
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{message.text}</span>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        message.isBot
                          ? 'bg-muted text-foreground rounded-bl-sm'
                          : 'bg-primary text-primary-foreground rounded-br-sm'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start bg-muted px-4 py-2 rounded-2xl rounded-bl-sm"
                >
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 bg-muted border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isRecording}
              />
              
              {isRecording && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-destructive font-semibold"
                >
                  {formatTime(recordingTime)}
                </motion.span>
              )}
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full transition-all ${
                  isRecording 
                    ? 'text-destructive animate-pulse' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
