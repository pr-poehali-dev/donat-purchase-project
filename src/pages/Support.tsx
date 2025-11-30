import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Support() {
  const [stage, setStage] = useState<'menu' | 'chat'>('menu');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я бот техподдержки. Выберите тему обращения:',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [waitingForSupport, setWaitingForSupport] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const supportTopics = [
    { id: 1, title: 'Проблема с оплатой', icon: 'CreditCard' },
    { id: 2, title: 'Не получил донат', icon: 'AlertCircle' },
    { id: 3, title: 'Технические проблемы', icon: 'Settings' },
    { id: 4, title: 'Вопрос о рангах', icon: 'Crown' },
    { id: 5, title: 'Вызвать сотрудника', icon: 'Users' },
  ];

  const handleTopicSelect = (topic: typeof supportTopics[0]) => {
    if (topic.id === 5) {
      setWaitingForSupport(true);
      addMessage(
        'Ожидайте, сотрудник техподдержки скоро подключится к чату. Среднее время ожидания: 2-5 минут.',
        true
      );
      toast({
        title: 'Запрос отправлен',
        description: 'Сотрудник подключится в ближайшее время',
      });
      setStage('chat');
    } else {
      addMessage(`Вы выбрали: ${topic.title}`, false);
      
      setTimeout(() => {
        const responses: Record<number, string> = {
          1: 'По вопросам оплаты проверьте статус транзакции в профиле. Если платеж прошел, но донат не пришел - нажмите "Вызвать сотрудника".',
          2: 'Обычно донаты приходят мгновенно. Попробуйте обновить страницу. Если не помогло - вызовите сотрудника.',
          3: 'Опишите проблему подробнее или вызовите сотрудника для помощи.',
          4: 'Информация о рангах:\n• Владелец - полный контроль\n• Администратор - управление донатами\n• Поддержка - работа с чатом',
        };
        addMessage(responses[topic.id], true);
      }, 1000);
      
      setStage('chat');
    }
  };

  const addMessage = (text: string, isBot: boolean) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isBot,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, false);
    setInputValue('');

    if (!waitingForSupport) {
      setTimeout(() => {
        addMessage(
          'Если вам нужна помощь сотрудника, нажмите "Вызвать сотрудника" в меню тем.',
          true
        );
      }, 1000);
    } else {
      setTimeout(() => {
        addMessage('Сотрудник получил ваше сообщение и скоро ответит.', true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-dark))] via-[hsl(var(--game-card))] to-[hsl(var(--game-dark))]">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[hsl(var(--game-dark))]/80 border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Техподдержка
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {stage === 'menu' ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-purple">
                <Icon name="Headphones" size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Чем можем помочь?</h2>
              <p className="text-muted-foreground">Выберите тему обращения</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportTopics.map((topic) => (
                <Card
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className="cursor-pointer bg-[hsl(var(--game-card))] border-primary/20 hover:border-primary/50 transition-all hover:scale-105"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Icon name={topic.icon} size={24} className="text-primary" />
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-[hsl(var(--game-card))] border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={24} />
                    Чат поддержки
                  </CardTitle>
                  <CardDescription>
                    {waitingForSupport ? 'Ожидание сотрудника...' : 'Бот техподдержки'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStage('menu')}>
                  <Icon name="Menu" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] overflow-y-auto space-y-3 p-4 bg-[hsl(var(--game-dark))] rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isBot
                            ? 'bg-primary/20 text-foreground'
                            : 'bg-gradient-to-r from-primary to-secondary text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Введите сообщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-[hsl(var(--game-dark))] border-primary/20"
                  />
                  <Button onClick={handleSendMessage} className="bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
