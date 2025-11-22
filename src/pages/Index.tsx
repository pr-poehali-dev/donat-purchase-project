import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DonateItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  icon: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CartItem extends DonateItem {
  quantity: number;
}

interface Purchase {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
  promoCode?: string;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500',
};

const rarityGlow = {
  common: 'hover:shadow-[0_0_20px_rgba(107,114,128,0.5)]',
  rare: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  epic: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]',
  legendary: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]',
};

const donateItems: DonateItem[] = [
  {
    id: 1,
    title: 'VIP Статус',
    description: 'Эксклюзивные привилегии на месяц',
    price: 499,
    icon: 'Crown',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/5482be6c-6d27-4051-8f5f-4ca012806e4e.jpg',
    rarity: 'legendary',
  },
  {
    id: 2,
    title: 'Набор ресурсов',
    description: '1000 кристаллов + 5000 золота',
    price: 299,
    icon: 'Gem',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/cd411cb4-4a83-43a7-ac44-f0707f30a3de.jpg',
    rarity: 'epic',
  },
  {
    id: 3,
    title: 'Премиум кейс',
    description: 'Случайные редкие предметы',
    price: 199,
    icon: 'Package',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/ba2f1663-3e41-422b-94ae-5b0cf08182d0.jpg',
    rarity: 'rare',
  },
  {
    id: 4,
    title: 'Ускорение',
    description: 'x2 опыта на 7 дней',
    price: 149,
    icon: 'Zap',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/2c1721ec-6b74-4b3a-a81f-4bdb57c78fba.jpg',
    rarity: 'rare',
  },
  {
    id: 5,
    title: 'Стартовый набор',
    description: 'Идеально для новичков',
    price: 99,
    icon: 'Gift',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/42a3e72e-0b50-4fcb-bfd7-82334d28f75c.jpg',
    rarity: 'common',
  },
  {
    id: 6,
    title: 'Легендарный скин',
    description: 'Уникальный облик персонажа',
    price: 599,
    icon: 'Sparkles',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/924d195c-ccdd-4c69-b3d1-100176e0d0c9.jpg',
    rarity: 'legendary',
  },
];

const promoCodes = {
  'GAME2024': 20,
  'WELCOME': 15,
  'FRIDAY': 25,
};

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { toast } = useToast();

  const addToCart = (item: DonateItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({
      title: 'Добавлено в корзину! 🎮',
      description: item.title,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    if (appliedPromo && promoCodes[appliedPromo as keyof typeof promoCodes]) {
      const discount = promoCodes[appliedPromo as keyof typeof promoCodes];
      return subtotal * (1 - discount / 100);
    }

    return subtotal;
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code as keyof typeof promoCodes]) {
      setAppliedPromo(code);
      toast({
        title: 'Промокод применен! 🎉',
        description: `Скидка ${promoCodes[code as keyof typeof promoCodes]}%`,
      });
    } else {
      toast({
        title: 'Неверный промокод',
        description: 'Попробуйте другой код',
        variant: 'destructive',
      });
    }
  };

  const completePurchase = () => {
    if (cart.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары для покупки',
        variant: 'destructive',
      });
      return;
    }

    const purchase: Purchase = {
      id: Date.now(),
      items: [...cart],
      total: calculateTotal(),
      date: new Date().toLocaleDateString('ru-RU'),
      promoCode: appliedPromo || undefined,
    };

    setPurchases([purchase, ...purchases]);
    setCart([]);
    setAppliedPromo(null);
    setPromoCode('');

    toast({
      title: 'Покупка завершена! 🎮',
      description: `Сумма: ${purchase.total.toFixed(0)} ₽`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-dark))] via-[hsl(var(--game-card))] to-[hsl(var(--game-dark))]">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[hsl(var(--game-dark))]/80 border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-purple">
              <Icon name="Gamepad2" size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                GameShop
              </h1>
              <p className="text-xs text-muted-foreground">Магазин донатов</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-primary/50 hover:border-primary">
                  <Icon name="User" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] bg-[hsl(var(--game-card))] border-primary/20">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Icon name="User" size={24} />
                    Профиль игрока
                  </SheetTitle>
                  <SheetDescription>История ваших покупок</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {purchases.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Покупок пока нет</p>
                    </div>
                  ) : (
                    purchases.map((purchase) => (
                      <Card key={purchase.id} className="bg-[hsl(var(--game-dark))] border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Icon name="Calendar" size={16} />
                              {purchase.date}
                            </span>
                            <Badge variant="outline" className="border-primary/50">
                              {purchase.total.toFixed(0)} ₽
                            </Badge>
                          </CardTitle>
                          {purchase.promoCode && (
                            <Badge className="w-fit bg-secondary/20 text-secondary border-secondary/50">
                              Промокод: {purchase.promoCode}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {purchase.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.title} x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-primary/50 hover:border-primary">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary animate-pulse-glow">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] bg-[hsl(var(--game-card))] border-primary/20">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Icon name="ShoppingCart" size={24} />
                    Корзина
                  </SheetTitle>
                  <SheetDescription>Ваши выбранные товары</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id} className="bg-[hsl(var(--game-dark))] border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                <Icon name={item.icon} size={24} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold text-primary">
                                    {item.price} ₽
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-auto text-destructive hover:text-destructive"
                                  >
                                    <Icon name="Trash2" size={16} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card className="bg-[hsl(var(--game-dark))] border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Промокод"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              className="bg-background/50 border-primary/30"
                            />
                            <Button onClick={applyPromoCode} variant="outline" className="border-secondary/50">
                              <Icon name="Tag" size={16} />
                            </Button>
                          </div>
                          {appliedPromo && (
                            <div className="mb-4 p-2 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-between">
                              <span className="text-sm text-secondary font-semibold">
                                Промокод: {appliedPromo} (-{promoCodes[appliedPromo as keyof typeof promoCodes]}%)
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAppliedPromo(null)}
                                className="h-6 w-6 p-0"
                              >
                                <Icon name="X" size={14} />
                              </Button>
                            </div>
                          )}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Итого:</span>
                            <span className="text-2xl font-bold text-primary">{calculateTotal().toFixed(0)} ₽</span>
                          </div>
                          <Button onClick={completePurchase} className="w-full gradient-game hover:opacity-90 text-lg py-6">
                            <Icon name="CreditCard" size={20} className="mr-2" />
                            Оплатить
                          </Button>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-in">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-float">
            Магазин донатов
          </h2>
          <p className="text-muted-foreground text-lg">
            Прокачай свой игровой опыт с эксклюзивными предложениями
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {donateItems.map((item, index) => (
            <Card
              key={item.id}
              className={`bg-gradient-to-br from-[hsl(var(--game-card))] to-[hsl(var(--game-dark))] border-2 overflow-hidden border-${item.rarity === 'legendary' ? 'orange' : item.rarity === 'epic' ? 'purple' : item.rarity === 'rare' ? 'blue' : 'gray'}-500/30 hover:border-${item.rarity === 'legendary' ? 'orange' : item.rarity === 'epic' ? 'purple' : item.rarity === 'rare' ? 'blue' : 'gray'}-500/60 transition-all duration-300 ${rarityGlow[item.rarity]} animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <Badge className={`absolute top-4 right-4 ${rarityColors[item.rarity]} text-white border-0 capitalize`}>
                  {item.rarity}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {item.price} ₽
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => addToCart(item)}
                  className="w-full gradient-game hover:opacity-90 text-white font-semibold"
                >
                  <Icon name="ShoppingCart" size={18} className="mr-2" />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-[hsl(var(--game-card))] to-[hsl(var(--game-dark))] border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Icon name="Tag" size={28} className="text-primary" />
              Есть промокод?
            </CardTitle>
            <CardDescription className="text-base">
              Введи промокод, добавь товары в корзину и получи скидку при оплате
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Введи промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="bg-background/50 border-primary/30 text-lg h-14"
              />
              <Button 
                onClick={applyPromoCode} 
                className="gradient-game hover:opacity-90 h-14 px-8"
              >
                <Icon name="Check" size={20} className="mr-2" />
                Применить
              </Button>
            </div>
            {appliedPromo && (
              <div className="mt-4 p-4 rounded-lg bg-secondary/20 border-2 border-secondary/50 flex items-center justify-between animate-slide-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Icon name="Check" size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-secondary text-lg">Промокод активирован!</div>
                    <div className="text-sm text-muted-foreground">
                      {appliedPromo} - скидка {promoCodes[appliedPromo as keyof typeof promoCodes]}%
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoCode('');
                  }}
                  className="hover:bg-secondary/20"
                >
                  <Icon name="X" size={18} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </main>

      <footer className="mt-20 py-8 border-t border-primary/20 bg-[hsl(var(--game-dark))]/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 GameShop. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}