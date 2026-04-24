import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DonationCard } from '@/components/donations/DonationCard';
import { DonationForm } from '@/components/donations/DonationForm';
import { useDonations } from '@/contexts/DonationContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SmartMealInsights } from '@/components/dashboard/SmartMealInsights';

const DonorDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { getDonationsByDonor, cancelDonation, deleteDonation } = useDonations();
  const { user } = useAuth();

  const myDonations = user ? getDonationsByDonor(user.id) : [];

  const stats = {
    totalPosted: myDonations.length,
    available: myDonations.filter(d => d.status === 'available').length,
    collected: myDonations.filter(d => d.status === 'collected').length,
  };

  const handleCancelDonation = async (donationId: string) => {
    try {
      await cancelDonation(donationId);
      toast({
        title: "Donation Cancelled",
        description: "Your donation has been marked as cancelled.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel donation.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    try {
      await deleteDonation(donationId);
      toast({
        title: "Donation Deleted",
        description: "The donation entry has been completely removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donation.",
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
    <DashboardLayout title="Donor Dashboard">
      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Donations"
            value={stats.totalPosted}
            subtitle="All time"
            icon={Package}
            variant="muted"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Currently Available"
            value={stats.available}
            subtitle="Awaiting pickup"
            icon={Clock}
            variant="primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Picked Up"
            value={stats.collected}
            subtitle="Successfully donated"
            icon={CheckCircle}
            variant="accent"
          />
        </motion.div>
      </motion.div>

      {/* Post new donation CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Button
          size="lg"
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto rounded-2xl h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg glow-emerald"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Food Donation
        </Button>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Smart Impact Insights</h2>
        <SmartMealInsights />
      </motion.div>

      {/* My donations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">My Donations</h2>

        {myDonations.length === 0 ? (
          <div className="bento-card text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No donations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by posting your first food donation
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Post Donation
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {myDonations.map((donation) => (
              <motion.div key={donation.id} variants={itemVariants}>
                <DonationCard
                  donation={donation}
                  variant="donor"
                  onAction={(donation.status === 'available' || donation.status === 'requested') ? () => handleCancelDonation(donation.id) : undefined}
                  onDelete={(donation.status === 'collected' || donation.status === 'cancelled') ? () => handleDeleteDonation(donation.id) : undefined}
                  actionLabel={(donation.status === 'available' || donation.status === 'requested') ? 'Cancel Post' : undefined}
                  actionVariant="destructive"
                  showContact={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Donation form */}
      <DonationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </DashboardLayout>
  );
};

export default DonorDashboard;
