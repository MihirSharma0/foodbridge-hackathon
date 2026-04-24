import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Donation } from '@/contexts/DonationContext';
import { MapPin, Clock, Package, Scale, MessageSquare, User, Phone, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface DonationCardProps {
  donation: Donation;
  variant: 'donor' | 'ngo';
  onAction?: () => void;
  onDelete?: () => void;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive' | 'outline';
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  showContact?: boolean;
}

export const DonationCard = ({
  donation,
  variant,
  onAction,
  onDelete,
  actionLabel,
  actionVariant = 'default',
  onSecondaryAction,
  secondaryActionLabel,
  showContact = false,
}: DonationCardProps) => {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hoursUntilExpiry = (donation.expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // 15-minute cancellation logic
  const CANCEL_WINDOW_MINUTES = 15;
  const timeSinceRequested = donation.requestedAt ? now.getTime() - donation.requestedAt.getTime() : 0;
  const timeLeftMs = (CANCEL_WINDOW_MINUTES * 60 * 1000) - timeSinceRequested;
  const isCancellable = donation.status === 'requested' && donation.requestedAt && timeLeftMs > 0 && donation.requestedBy === user?.id;

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExpiryStatus = () => {
    let label = `Safe for pickup till ${formatTime(donation.expiryTime)}`;
    if (hoursUntilExpiry <= 1) {
      const minutesLeft = Math.max(0, Math.floor(hoursUntilExpiry * 60));
      label += ` (${minutesLeft}m left)`;
      return { label, color: 'bg-destructive text-destructive-foreground' };
    }
    if (hoursUntilExpiry <= 3) return { label, color: 'bg-amber text-white' };
    return { label, color: 'bg-primary text-primary-foreground' };
  };

  const getStatusBadge = () => {
    switch (donation.status) {
      case 'available':
        return { label: 'Available', color: 'bg-primary/10 text-primary border-primary/20' };
      case 'requested':
        if (donation.requestedBy === user?.id) {
          return { label: 'You Requested This', color: 'bg-emerald/10 text-emerald-600 border-emerald/20' };
        }
        return { label: `Requested by ${donation.requestedByName}`, color: 'bg-amber/10 text-amber border-amber/20' };
      case 'collected':
        return { label: 'Collected', color: 'bg-muted text-muted-foreground border-muted' };
      case 'cancelled':
        return { label: 'Cancelled by Donor', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    }
  };

  const expiryStatus = getExpiryStatus();
  const statusBadge = getStatusBadge();

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={cn(
      "bento-card relative overflow-hidden transition-all duration-300",
      donation.status === 'collected' && "opacity-60"
    )}>
      {/* Delete button (Top Right, Collected or Cancelled Only) */}
      {(donation.status === 'collected' || donation.status === 'cancelled') && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Top bar with veg indicator and expiry */}
      <div className="flex items-center justify-between mb-4 pr-8">
        <div className="flex items-center gap-2">
          {donation.items && donation.items.length > 1 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {donation.items.some(i => i.isVeg) && <div className="veg-indicator border-background" />}
                {donation.items.some(i => !i.isVeg) && <div className="nonveg-indicator border-background" />}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {donation.items.every(i => i.isVeg) ? 'All Veg' :
                  donation.items.every(i => !i.isVeg) ? 'All Non-Veg' : 'Mixed Type'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className={donation.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
              <span className="text-sm text-muted-foreground font-medium">
                {donation.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
          )}
        </div>
        <Badge className={cn("text-[10px] md:text-xs", expiryStatus.color)}>
          {expiryStatus.label}
        </Badge>
      </div>

      {/* Item list */}
      <div className="mb-4">
        {donation.items && donation.items.length > 1 ? (
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground/90">Multiple Items ({donation.items.length})</h3>
            <div className="space-y-1.5">
              {donation.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-secondary/20 rounded-lg px-3 py-1.5">
                  <span className="flex items-center gap-2 font-medium">
                    <div className={item.isVeg ? 'veg-indicator w-2 h-2' : 'nonveg-indicator w-2 h-2'} />
                    {item.name}
                  </span>
                  <span className="text-muted-foreground text-xs font-semibold bg-background/50 px-2 py-0.5 rounded-full">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">{donation.itemName}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{donation.quantity} {donation.quantityUnit}</span>
              </div>
              <div className="flex items-center gap-1">
                <Scale className="w-4 h-4" />
                <span>{donation.weight} kg</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Combined weight if multiple items (optional, but keep layout consistent) */}
      {donation.items && donation.items.length > 1 && (
        <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground bg-muted/30 w-fit px-2 py-1 rounded-md">
          <Scale className="w-3.5 h-3.5" />
          <span>Total Weight: {donation.weight} kg</span>
        </div>
      )}

      {/* Location */}
      <div className="flex items-start gap-2 mb-3 text-sm">
        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">{donation.location}</span>
      </div>

      {/* Notes */}
      {donation.notes && (
        <div className="flex items-start gap-2 mb-3 text-sm">
          <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground line-clamp-2">{donation.notes}</span>
        </div>
      )}

      {/* Contact info (Always show name and number if present, especially when requested) */}
      {(donation.contactName || donation.contactPhone) && (
        <div className="flex flex-wrap gap-3 mb-3 text-sm p-2 bg-secondary/10 rounded-xl border border-secondary/20">
          {donation.contactName && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">{donation.contactName}</span>
            </div>
          )}
          {donation.contactPhone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">{donation.contactPhone}</span>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border my-4" />

      {/* Bottom: Status and action */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <Badge
            variant="outline"
            className={cn(
              "text-[11px] leading-tight w-fit h-auto py-1 px-2 whitespace-normal text-left",
              statusBadge.color
            )}
          >
            {statusBadge.label}
          </Badge>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {variant === 'donor' ? 'Posted' : 'From'} {variant === 'donor' ? formatTimeAgo(donation.createdAt) : donation.donorName}
            </span>
            {isCancellable && (
              <span className="text-[10px] text-amber-600 font-medium">
                Cancellation window expires in {formatCountdown(timeLeftMs)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto ml-auto">
          {onAction && actionLabel && (
            <Button
              size="sm"
              variant={actionVariant}
              onClick={onAction}
              className="rounded-xl w-full"
            >
              {actionLabel}
            </Button>
          )}

          {isCancellable && onSecondaryAction && variant === 'ngo' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSecondaryAction}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300 w-full"
            >
              {isHovered ? (
                <span className="flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  {formatCountdown(timeLeftMs)}
                </span>
              ) : (
                secondaryActionLabel || 'Cancel Request'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
