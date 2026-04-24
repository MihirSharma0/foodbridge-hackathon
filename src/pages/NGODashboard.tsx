import { motion } from 'framer-motion';
import { Heart, Package, Truck, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DonationCard } from '@/components/donations/DonationCard';
import { useDonations } from '@/contexts/DonationContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SmartMealInsights } from '@/components/dashboard/SmartMealInsights';

const NGODashboard = () => {
  const {
    getAvailableAndRequestedDonations,
    getRequestedByNgo,
    requestDonation,
    markAsCollected,
    cancelRequest,
    deleteDonation
  } = useDonations();
  const { user } = useAuth();

  const availableDonations = getAvailableAndRequestedDonations();
  const myRequests = user ? getRequestedByNgo(user.id) : [];

  // Calculate meals saved (rough estimate: 1 serving = 1 meal)
  const mealsSaved = myRequests
    .filter(d => d.status === 'collected')
    .reduce((sum, d) => sum + d.quantity, 0);

  const stats = {
    mealsSaved,
    available: availableDonations.length,
    pickupsToday: myRequests.filter(d => d.status === 'requested').length,
  };

  const handleRequestPickup = async (donationId: string) => {
    if (!user) return;
    try {
      await requestDonation(donationId, user.id, user.displayName);
      toast({
        title: "Pickup Requested!",
        description: "The donor has been notified. Please proceed with pickup.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request pickup.",
        variant: "destructive",
      });
    }
  };

  const handleCancelRequest = async (donationId: string) => {
    try {
      await cancelRequest(donationId);
      toast({
        title: "Request Cancelled",
        description: "The donation is now available for other NGOs.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request.",
        variant: "destructive",
      });
    }
  };

  const handleMarkCollected = async (donationId: string) => {
    try {
      await markAsCollected(donationId);
      toast({
        title: "Marked as Collected!",
        description: "Thank you for making a difference.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as collected.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (donationId: string) => {
    try {
      await deleteDonation(donationId);
      toast({
        title: "Entry Removed",
        description: "The collected donation has been removed from your history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout title="NGO Dashboard">
      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Meals Saved"
            value={mealsSaved}
            subtitle="Through FoodBridge"
            icon={Heart}
            variant="accent"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Available Now"
            value={stats.available}
            subtitle="Ready for pickup"
            icon={Package}
            variant="primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Pending Pickups"
            value={stats.pickupsToday}
            subtitle="Awaiting collection"
            icon={Truck}
            variant="muted"
          />
        </motion.div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Meal Variety Insights</h2>
        <SmartMealInsights />
      </motion.div>

      {/* Available Donations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Available Donations</h2>

        {availableDonations.length === 0 ? (
          <div className="bento-card text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No donations available</h3>
            <p className="text-muted-foreground">
              Check back soon for new food donations in your area
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {availableDonations.map((donation) => (
              <motion.div key={donation.id} variants={itemVariants}>
                <DonationCard
                  donation={donation}
                  variant="ngo"
                  onAction={donation.status === 'available' ? () => handleRequestPickup(donation.id) : undefined}
                  actionLabel={donation.status === 'available' ? "Request Pickup" : undefined}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* My Requests */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>

        {myRequests.length === 0 ? (
          <div className="bento-card text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No active requests</h3>
            <p className="text-muted-foreground">
              Request a donation above to start collecting
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {myRequests.map((donation) => {
              const now = new Date();
              const CANCEL_WINDOW_MINUTES = 15;
              const isCancellable = donation.status === 'requested' &&
                donation.requestedAt &&
                (now.getTime() - donation.requestedAt.getTime()) < (CANCEL_WINDOW_MINUTES * 60 * 1000);

              return (
                <motion.div key={donation.id} variants={itemVariants}>
                  <DonationCard
                    donation={donation}
                    variant="ngo"
                    showContact
                    onAction={
                      donation.status === 'requested' || donation.status === 'available'
                        ? () => handleMarkCollected(donation.id)
                        : undefined
                    }
                    onSecondaryAction={
                      donation.status === 'requested' && donation.requestedBy === user?.id
                        ? () => handleCancelRequest(donation.id)
                        : undefined
                    }
                    onDelete={donation.status === 'collected' ? () => handleDeleteEntry(donation.id) : undefined}
                    actionLabel={donation.status === 'collected' ? undefined : "Mark as Picked Up"}
                    secondaryActionLabel="Cancel Pickup"
                    actionVariant="default"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default NGODashboard;
