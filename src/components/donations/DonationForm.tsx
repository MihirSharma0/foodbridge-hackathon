import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Leaf, Drumstick, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDonations } from '@/contexts/DonationContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DonationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationForm = ({ isOpen, onClose }: DonationFormProps) => {
  const { addDonation } = useDonations();
  const { user } = useAuth();
  const [items, setItems] = useState([{ id: '1', name: '', isVeg: true, quantity: '', unit: 'servings' }]);
  const [formData, setFormData] = useState({
    weight: '',
    location: '',
    expiryHours: '3',
    notes: '',
    contactName: '',
    contactPhone: '',
  });

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', isVeg: true, quantity: '', unit: 'servings' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: string | boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + parseInt(formData.expiryHours));

    addDonation({
      itemName: items[0].name, // For compatibility
      isVeg: items.every(item => item.isVeg), // For compatibility (simplified)
      quantity: items.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0), // For compatibility
      quantityUnit: items[0].unit, // For compatibility
      items: items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity) || 0,
      })),
      weight: parseFloat(formData.weight),
      location: formData.location,
      expiryTime,
      notes: formData.notes,
      contactName: formData.contactName || undefined,
      contactPhone: formData.contactPhone || undefined,
      donorId: user.id,
      donorName: user.displayName,
    });

    toast({
      title: "Donation Posted!",
      description: "Your donation with multiple items is now visible.",
    });

    // Reset form
    setItems([{ id: '1', name: '', isVeg: true, quantity: '', unit: 'servings' }]);
    setFormData({
      weight: '',
      location: '',
      expiryHours: '3',
      notes: '',
      contactName: '',
      contactPhone: '',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Slide-out form */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Post New Donation</h2>
                  <p className="text-sm text-muted-foreground">Share your surplus food</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Food Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="rounded-lg h-8 gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl border border-border/50 bg-secondary/30 relative space-y-4"
                    >
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-destructive hover:text-white transition-colors shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      {/* Item name */}
                      <div className="space-y-2">
                        <Label htmlFor={`itemName-${item.id}`} className="text-xs font-medium text-muted-foreground">
                          Item {index + 1} Name *
                        </Label>
                        <Input
                          id={`itemName-${item.id}`}
                          placeholder="e.g., Vegetable Biryani"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="rounded-xl h-10 bg-background"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Quantity */}
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${item.id}`} className="text-xs font-medium text-muted-foreground">
                            Quantity *
                          </Label>
                          <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            placeholder="50"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            className="rounded-xl h-10 bg-background"
                            required
                            min="1"
                          />
                        </div>
                        {/* Unit */}
                        <div className="space-y-2">
                          <Label htmlFor={`unit-${item.id}`} className="text-xs font-medium text-muted-foreground">
                            Unit
                          </Label>
                          <select
                            id={`unit-${item.id}`}
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="servings">Servings</option>
                            <option value="pieces">Pieces</option>
                            <option value="portions">Portions</option>
                            <option value="packs">Packs</option>
                            <option value="boxes">Boxes</option>
                          </select>
                        </div>
                      </div>

                      {/* Veg toggle */}
                      <div className="flex rounded-xl bg-background/50 p-1 border border-border/50">
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, 'isVeg', true)}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all ${item.isVeg
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          <Leaf className="w-3.5 h-3.5" />
                          <span>Veg</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, 'isVeg', false)}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all ${!item.isVeg
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          <Drumstick className="w-3.5 h-3.5" />
                          <span>Non-Veg</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border/50 my-2" />

              {/* Shared Details */}
              <div className="space-y-6">
                <Label className="text-base font-semibold">Logistics</Label>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Total Approximate Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.5"
                    placeholder="e.g., 15"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="rounded-xl h-12"
                    required
                    min="0.5"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location *</Label>
                  <div className="relative">
                    <Input
                      id="location"
                      placeholder="e.g., 123 MG Road, Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="rounded-xl h-12 pr-10"
                      required
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Expiry time */}
                <div className="space-y-2">
                  <Label htmlFor="expiryHours">Safe for pickup within *</Label>
                  <div className="relative">
                    <select
                      id="expiryHours"
                      value={formData.expiryHours}
                      onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
                      className="w-full h-12 rounded-xl border border-input bg-background px-3 appearance-none focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5 hours</option>
                      <option value="6">6 hours</option>
                      <option value="8">8 hours</option>
                      <option value="12">12 hours</option>
                    </select>
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the food..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                {/* Contact info (optional) */}
                <div className="space-y-4">
                  <Label className="text-muted-foreground">Contact Info (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Contact Name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="rounded-xl h-12"
                    />
                    <Input
                      placeholder="Phone Number"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 sticky bottom-0 z-10"
              >
                Post Donation ({items.length} {items.length === 1 ? 'Item' : 'Items'})
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
