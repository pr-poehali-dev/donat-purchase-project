import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface DonateCardProps {
  item: DonateItem;
  onAddToCart: (item: DonateItem) => void;
  rarityColors: Record<string, string>;
  rarityGlow: Record<string, string>;
}

export default function DonateCard({ item, onAddToCart, rarityColors, rarityGlow }: DonateCardProps) {
  return (
    <Card
      className={`overflow-hidden bg-[hsl(var(--game-card))] border-primary/20 transition-all duration-300 ${rarityGlow[item.rarity]} hover:scale-105 group`}
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-3 right-3 ${rarityColors[item.rarity]} text-white border-0`}
        >
          {item.rarity}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{item.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl font-bold text-primary">{item.price} ₽</span>
          {item.discount && (
            <Badge variant="secondary" className="text-xs">
              -{item.discount}%
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name={item.icon} size={20} className="mr-2" />
          Купить
        </Button>
      </CardFooter>
    </Card>
  );
}
