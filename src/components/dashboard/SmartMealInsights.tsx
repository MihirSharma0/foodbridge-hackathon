import { motion } from 'framer-motion';
import { Leaf, Droplets, Wind, Zap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDonations } from '@/contexts/DonationContext';
import { useAuth } from '@/contexts/AuthContext';

export const SmartMealInsights = () => {
  const { user } = useAuth();
  const { getImpactMetrics, getNutritionalProfile } = useDonations();

  if (!user) return null;

  const role = user.role as 'donor' | 'ngo';
  const metrics = getImpactMetrics(user.id, role);
  const profile = getNutritionalProfile(user.id, role);

  const totalItems = Object.values(profile).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    protein: (profile.protein / totalItems) * 100,
    carbs: (profile.carbs / totalItems) * 100,
    veg: (profile.veg / totalItems) * 100,
    fiber: (profile.fiber / totalItems) * 100,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Environmental Impact */}
        <Card className="bento-card overflow-hidden border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wind className="w-4 h-4 text-primary" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold text-primary">{metrics.co2Saved}kg</p>
                <p className="text-xs text-muted-foreground">CO2 Emissions Prevented</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-500">{metrics.waterSaved}L</p>
                <p className="text-xs text-muted-foreground">Water Conserved</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-background/50 text-[11px] leading-relaxed flex gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
              <span>By preventing food waste, you've saved enough water for roughly {Math.floor(Number(metrics.waterSaved) / 50)} showers!</span>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Variety */}
        <Card className="bento-card overflow-hidden border-accent/20 bg-accent/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              {role === 'donor' ? 'Donation Variety' : 'Meal Balance'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                <span>Protein Rich</span>
                <span>{Math.round(percentages.protein)}%</span>
              </div>
              <Progress value={percentages.protein} className="h-1.5 bg-accent/10" indicatorClassName="bg-accent" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                <span>Vegetarian</span>
                <span>{Math.round(percentages.veg)}%</span>
              </div>
              <Progress value={percentages.veg} className="h-1.5 bg-green-500/10" indicatorClassName="bg-green-500" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                <span>Fiber/Salads</span>
                <span>{Math.round(percentages.fiber)}%</span>
              </div>
              <Progress value={percentages.fiber} className="h-1.5 bg-orange-500/10" indicatorClassName="bg-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Tip */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-muted/50 border border-border flex gap-4 items-start"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Smart Choice Tip</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {percentages.veg < 50 
              ? "Increasing plant-based donations can further reduce your environmental footprint by up to 30%."
              : "Great job on prioritizing plant-based options! They are easier for NGOs to distribute quickly."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
