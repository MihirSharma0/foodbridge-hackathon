import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export type DonationStatus = 'available' | 'requested' | 'collected' | 'cancelled';

export interface DonationItem {
  id: string;
  name: string;
  isVeg: boolean;
  quantity: number;
  unit: string;
}

export interface Donation {
  id: string;
  itemName: string;
  isVeg: boolean;
  quantity: number;
  quantityUnit: string;
  items: DonationItem[];
  weight: number;
  location: string;
  expiryTime: Date;
  notes: string;
  contactName?: string;
  contactPhone?: string;
  donorId: string;
  donorName: string;
  status: DonationStatus;
  requestedBy: string | null;
  requestedByName: string | null;
  requestedAt?: Date;
  createdAt: Date;
}

interface DonationContextType {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'status' | 'requestedBy' | 'requestedByName' | 'createdAt'>) => Promise<void>;
  requestDonation: (donationId: string, ngoId: string, ngoName: string) => Promise<void>;
  cancelRequest: (donationId: string) => Promise<void>;
  markAsCollected: (donationId: string) => Promise<void>;
  cancelDonation: (donationId: string) => Promise<void>;
  deleteDonation: (donationId: string) => Promise<void>;
  getDonationsByDonor: (donorId: string) => Donation[];
  getAvailableAndRequestedDonations: () => Donation[];
  getRequestedByNgo: (ngoId: string) => Donation[];
  getImpactMetrics: (userId: string, role: 'donor' | 'ngo') => { co2Saved: string, waterSaved: string, mealsServed: number };
  getNutritionalProfile: (userId: string, role: 'donor' | 'ngo') => { protein: number, carbs: number, veg: number, fiber: number };
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/donations`);
      const donationData = response.data.map((d: any) => ({
        ...d,
        id: d._id,
        expiryTime: new Date(d.expiryTime),
        createdAt: new Date(d.createdAt),
        requestedAt: d.requestedAt ? new Date(d.requestedAt) : undefined
      }));
      setDonations(donationData);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 10000); // Poll every 10s for demo
    return () => clearInterval(interval);
  }, [fetchDonations]);

  const addDonation = useCallback(async (newDonation: Omit<Donation, 'id' | 'status' | 'requestedBy' | 'requestedByName' | 'createdAt'>) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/donations`, newDonation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error adding donation: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const requestDonation = useCallback(async (donationId: string, _ngoId: string, ngoName: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/donations/${donationId}/request`, { ngoName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error requesting donation: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const cancelRequest = useCallback(async (donationId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/donations/${donationId}/cancel`, { role: 'ngo' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error cancelling request: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const markAsCollected = useCallback(async (donationId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/donations/${donationId}/collect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error marking as collected: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const cancelDonation = useCallback(async (donationId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/donations/${donationId}/cancel`, { role: 'donor' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error cancelling donation: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const deleteDonation = useCallback(async (donationId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (error) {
      console.error("Error deleting donation: ", error);
      throw error;
    }
  }, [fetchDonations]);

  const getDonationsByDonor = useCallback((donorId: string) => {
    return donations.filter(d => d.donorId === donorId);
  }, [donations]);

  const getAvailableAndRequestedDonations = useCallback(() => {
    return donations.filter(d => d.status === 'available' || d.status === 'requested');
  }, [donations]);

  const getRequestedByNgo = useCallback((ngoId: string) => {
    return donations.filter(d => d.requestedBy === ngoId);
  }, [donations]);

  const getImpactMetrics = useCallback((userId: string, role: 'donor' | 'ngo') => {
    const relevantDonations = role === 'donor' 
      ? donations.filter(d => d.donorId === userId && d.status === 'collected')
      : donations.filter(d => d.requestedBy === userId && d.status === 'collected');
    
    const totalWeight = relevantDonations.reduce((sum, d) => sum + (d.weight || 0), 0);
    
    return {
      co2Saved: (totalWeight * 2.5).toFixed(1),
      waterSaved: (totalWeight * 100).toFixed(0),
      mealsServed: relevantDonations.reduce((sum, d) => sum + (d.quantity || 0), 0)
    };
  }, [donations]);

  const getNutritionalProfile = useCallback((userId: string, role: 'donor' | 'ngo') => {
    const relevantDonations = role === 'donor' 
      ? donations.filter(d => d.donorId === userId)
      : donations.filter(d => d.requestedBy === userId);
    
    const tags = { protein: 0, carbs: 0, veg: 0, fiber: 0 };
    relevantDonations.forEach(d => {
      const name = d.itemName.toLowerCase();
      if (name.includes('chicken') || name.includes('meat') || name.includes('paneer') || name.includes('dal')) tags.protein++;
      if (name.includes('rice') || name.includes('roti') || name.includes('bread') || name.includes('potato')) tags.carbs++;
      if (d.isVeg) tags.veg++;
      if (name.includes('salad') || name.includes('fruit') || name.includes('vegetable')) tags.fiber++;
    });
    return tags;
  }, [donations]);

  return (
    <DonationContext.Provider value={{
      donations, addDonation, requestDonation, cancelRequest, markAsCollected,
      cancelDonation, deleteDonation, getDonationsByDonor, getAvailableAndRequestedDonations,
      getRequestedByNgo, getImpactMetrics, getNutritionalProfile
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationContext);
  if (context === undefined) throw new Error('useDonations must be used within a DonationProvider');
  return context;
};
