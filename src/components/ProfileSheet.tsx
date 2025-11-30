import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Purchase {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
  promoCode?: string;
}

interface ProfileSheetProps {
  purchases: Purchase[];
}

export default function ProfileSheet({ purchases }: ProfileSheetProps) {
  return (
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
                    <span className="text-primary font-bold">{purchase.total.toFixed(0)} ₽</span>
                  </CardTitle>
                  {purchase.promoCode && (
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Icon name="Tag" size={12} />
                      Промокод: {purchase.promoCode}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.title} x{item.quantity}
                      </span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(0)} ₽</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
