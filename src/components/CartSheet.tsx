import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

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

interface CartSheetProps {
  cart: CartItem[];
  promoCode: string;
  appliedPromo: string | null;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveFromCart: (id: number) => void;
  onCompletePurchase: () => void;
  calculateTotal: () => number;
  promoCodes: Record<string, number>;
}

export default function CartSheet({
  cart,
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onApplyPromoCode,
  onUpdateQuantity,
  onRemoveFromCart,
  onCompletePurchase,
  calculateTotal,
  promoCodes,
}: CartSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/50 hover:border-primary">
          <Icon name="ShoppingCart" size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-[hsl(var(--game-card))] border-primary/20 overflow-y-auto">
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
              <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Корзина пуста</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <Card key={item.id} className="bg-[hsl(var(--game-dark))] border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-sm">{item.title}</CardTitle>
                        <CardDescription className="text-xs">{item.price} ₽</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Icon name="Minus" size={14} />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Icon name="Plus" size={14} />
                      </Button>
                      <span className="ml-auto font-bold text-primary">
                        {(item.price * item.quantity).toFixed(0)} ₽
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-[hsl(var(--game-dark))] border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">Промокод</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Введите промокод"
                      value={promoCode}
                      onChange={(e) => onPromoCodeChange(e.target.value)}
                      className="bg-[hsl(var(--game-card))] border-primary/20"
                    />
                    <Button onClick={onApplyPromoCode} variant="outline">
                      Применить
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="text-sm text-green-500 flex items-center gap-2">
                      <Icon name="Check" size={16} />
                      Промокод {appliedPromo} применен (-{promoCodes[appliedPromo]}%)
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Итого</CardTitle>
                    <span className="text-3xl font-bold text-primary">{calculateTotal().toFixed(0)} ₽</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={onCompletePurchase}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оформить покупку
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
