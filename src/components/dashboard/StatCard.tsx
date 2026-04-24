import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'muted';
}

export const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'primary' }: StatCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          valueBg: 'gradient-text',
        };
      case 'accent':
        return {
          iconBg: 'bg-accent/10',
          iconColor: 'text-accent',
          valueBg: 'text-accent',
        };
      case 'muted':
        return {
          iconBg: 'bg-muted',
          iconColor: 'text-muted-foreground',
          valueBg: 'text-foreground',
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className="bento-card">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", classes.iconBg)}>
          <Icon className={cn("w-6 h-6", classes.iconColor)} />
        </div>
      </div>
      <div className={cn("text-3xl md:text-4xl font-bold mb-1", classes.valueBg)}>
        {value}
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
    </div>
  );
};
