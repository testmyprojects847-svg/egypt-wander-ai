import { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff } from 'lucide-react';
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

// Webhook URL for n8n chat
const WEBHOOK_URL = 'https://n8n.algaml.com/webhook/eae37119-7aac-445a-ba59-a51a4b35267d/chat';

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        body: JSON.stringify({ 
          chatInput: text.trim(),
          sessionId: 'session-' + Date.now()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || data.reply || data.message || data.text || 'Thank you for your message! Our team will assist you shortly.',
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
      {/* AI Concierge Launcher Button - Luxurious Design */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" style={{ transform: 'scale(1.3)' }} />
          
          {/* Main button */}
          <div className="relative w-16 h-16 rounded-full border-2 border-primary bg-background flex items-center justify-center glow-gold">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <motion.span
                  key="ankh"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  className="text-primary text-3xl font-bold"
                >
                  ☥
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Label */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-2 text-right">
                <p className="text-primary text-sm font-semibold">AI Concierge</p>
                <p className="text-muted-foreground text-xs">Plan Your Journey</p>
              </div>
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 w-[380px] h-[550px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-primary/30"
          >
            {/* Header */}
            <div className="p-4 bg-background border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <span className="text-primary text-xl">☥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gradient-gold">Egypt Tours</h3>
                  <span className="text-xs text-success flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    {onlineText}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-background/50 flex flex-col gap-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`max-w-[80%] ${message.isBot ? 'self-start' : 'self-end'}`}
                >
                  {message.isVoice ? (
                    <div className="bg-gradient-to-r from-primary to-primary-light text-background px-4 py-2 rounded-2xl flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-background/60 rounded-full"
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
                          ? 'bg-secondary text-foreground rounded-bl-sm'
                          : 'bg-gradient-to-r from-primary to-primary-light text-background rounded-br-sm'
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
                  className="self-start bg-secondary px-4 py-2 rounded-2xl rounded-bl-sm"
                >
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 bg-secondary border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
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
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
