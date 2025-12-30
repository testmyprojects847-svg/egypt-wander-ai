import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WEBHOOK_URL = 'https://n8n.algaml.com/webhook/5032d8a2-9caa-40da-b08d-902ccf854819/chat';

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً بك! 👋 أنا مساعدك الذكي لرحلات مصر. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في:\n\n• البحث عن رحلات سياحية\n• معرفة تفاصيل الرحلات والأسعار\n• حجز رحلة\n• الاستفسار عن أي معلومات',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          user_id: 'user_' + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.output || data.response || data.message || 'عذراً، حدث خطأ في الاستجابة.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    'ما هي أفضل الرحلات لدى الأقصر؟',
    'كم سعر رحلة شرم الشيخ؟',
    'هل يوجد رحلات للصحراء البيضاء؟',
    'أريد حجز رحلة للأهرامات',
  ];

  return (
    <Layout hideFooter>
      <section className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="bg-primary py-4 md:py-6">
          <div className="container-custom">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">المساعد الذكي</h1>
                <p className="text-sm text-primary-foreground/70">مدعوم بالذكاء الاصطناعي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col container-custom py-4 max-w-4xl">
          <Card className="flex-1 flex flex-col border-0 shadow-medium overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Bot className="w-5 h-5" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-secondary text-foreground rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-muted-foreground">جاري الكتابة...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Suggested Questions (only show at start) */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <p className="text-sm text-muted-foreground mb-3">أسئلة مقترحة:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(q);
                          inputRef.current?.focus();
                        }}
                        className="text-sm"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <CardContent className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  placeholder="اكتب رسالتك هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 h-12"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="lg"
                  className="h-12 px-6 shadow-gold"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ChatPage;
