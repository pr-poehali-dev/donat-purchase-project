import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import DonateCard from '@/components/DonateCard';
import CartSheet from '@/components/CartSheet';
import ProfileSheet from '@/components/ProfileSheet';

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
    title: 'Legend Diamond',
    description: 'Эксклюзивные привилегии на месяц',
    price: 499,
    icon: 'Crown',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/5482be6c-6d27-4051-8f5f-4ca012806e4e.jpg',
    rarity: 'legendary',
  },
  {
    id: 2,
    title: 'Legend Platinum',
    description: '1000 кристаллов + 5000 золота',
    price: 299,
    icon: 'Gem',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/cd411cb4-4a83-43a7-ac44-f0707f30a3de.jpg',
    rarity: 'epic',
  },
  {
    id: 3,
    title: 'Legend Gold',
    description: 'Случайные редкие предметы',
    price: 199,
    icon: 'Package',
    image: 'https://cdn.poehali.dev/projects/0a1a43b8-e98e-4484-8ade-d7af7a871a94/files/ba2f1663-3e41-422b-94ae-5b0cf08182d0.jpg',
    rarity: 'rare',
  },
  {
    id: 4,
    title: 'Legend Silver',
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
            <ProfileSheet purchases={purchases} />
            <CartSheet
              cart={cart}
              promoCode={promoCode}
              appliedPromo={appliedPromo}
              onPromoCodeChange={setPromoCode}
              onApplyPromoCode={applyPromoCode}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onCompletePurchase={completePurchase}
              calculateTotal={calculateTotal}
              promoCodes={promoCodes}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Магазин донатов
          </h2>
          <p className="text-muted-foreground text-lg">
            Улучшайте свой игровой опыт с эксклюзивными предметами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donateItems.map((item) => (
            <DonateCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              rarityColors={rarityColors}
              rarityGlow={rarityGlow}
            />
          ))}
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-primary/20 bg-[hsl(var(--game-dark))]/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Gamepad2" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">© 2024 GameShop. Все права защищены.</span>
            </div>
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Поддержка
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Icon name="FileText" size={16} className="mr-2" />
                Правила
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}