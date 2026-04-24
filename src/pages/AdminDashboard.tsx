import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    ShoppingBag,
    Trash2,
    RotateCcw,
    Plus,
    LayoutDashboard,
    LogOut,
    Store,
    HandHeart,
    ChevronRight,
    MoreVertical,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    ShieldCheck,
    UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import { useDonations, Donation } from '@/contexts/DonationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout, user: currentUser } = useAuth();
    const { donations, deleteDonation } = useDonations();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'donor' | 'ngo'>('all');
    const [donationStatusFilter, setDonationStatusFilter] = useState<'all' | 'available' | 'requested' | 'collected' | 'cancelled'>('all');

    // Dialog states
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Add User states
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole>('donor');
    const [newUserDisplayName, setNewUserDisplayName] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/auth/all-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/auth/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/auth/users/${selectedUser.id}/reset-password`, 
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Password reset for ${selectedUser.displayName}`);
            setIsResetPasswordOpen(false);
            setNewPassword('');
            setConfirmPassword('');
            fetchUsers();
        } catch (error) {
            toast.error("Failed to reset password");
        }
    };

    const handleCreateUser = async () => {
        if (!newUserEmail || !newUserPassword || !newUserDisplayName) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/auth/admin-create-user`, {
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
                displayName: newUserDisplayName
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User created successfully");
            setIsAddUserOpen(false);
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserDisplayName('');
            fetchUsers();
        } catch (error) {
            toast.error("Failed to create user");
        }
    };

    const filteredUsers = allUsers.filter(u => {
        const matchesSearch = (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.username || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
        return matchesSearch && matchesRole;
    });

    const filteredDonations = donations.filter(d => {
        const matchesSearch = (d.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.donorName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = donationStatusFilter === 'all' || d.status === donationStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        // Users stats reflect total in system, filtered by search but NOT by role filter
        donors: allUsers.filter(u =>
            u.role === 'donor' &&
            ((u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
        ).length,
        ngos: allUsers.filter(u =>
            u.role === 'ngo' &&
            ((u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
        ).length,
        // Meals stats reflect the selected status stage
        meals: donations
            .filter(d => {
                const matchesSearch = (d.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (d.donorName || '').toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = donationStatusFilter === 'all' || d.status === donationStatusFilter;
                return matchesSearch && matchesStatus;
            })
            .reduce((acc, d) => acc + (Number(d.quantity) || 0), 0)
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar / Topbar */}
            <div className="border-b bg-card">
                <div className="container px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <span className="font-bold text-xl uppercase tracking-tighter">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground hidden md:block">
                            Welcome, {currentUser?.displayName}
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container px-4 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="glass">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase">
                                        {userRoleFilter === 'all' ? 'Total Donors' : userRoleFilter === 'donor' ? 'Donors Found' : 'Donors'}
                                    </p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.donors}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Store className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase">
                                        {userRoleFilter === 'all' ? 'Total NGOs' : userRoleFilter === 'ngo' ? 'NGOs Found' : 'NGOs'}
                                    </p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.ngos}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                                    <HandHeart className="w-6 h-6 text-accent" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase">
                                        {donationStatusFilter === 'all' ? 'Total Meals' : `Meals ${donationStatusFilter.charAt(0).toUpperCase() + donationStatusFilter.slice(1)}`}
                                    </p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.meals}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${donationStatusFilter === 'all' ? 'bg-primary/10 text-primary' :
                                    donationStatusFilter === 'available' ? 'bg-orange-500/10 text-orange-600' :
                                        donationStatusFilter === 'requested' ? 'bg-blue-500/10 text-blue-600' :
                                            donationStatusFilter === 'collected' ? 'bg-green-500/10 text-green-600' :
                                                'bg-red-500/10 text-red-600'
                                    }`}>
                                    {donationStatusFilter === 'all' && <ShoppingBag className="w-6 h-6" />}
                                    {donationStatusFilter === 'available' && <Clock className="w-6 h-6" />}
                                    {donationStatusFilter === 'requested' && <AlertCircle className="w-6 h-6" />}
                                    {donationStatusFilter === 'collected' && <CheckCircle2 className="w-6 h-6" />}
                                    {donationStatusFilter === 'cancelled' && <XCircle className="w-6 h-6" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="bg-muted/50 p-1 rounded-xl">
                            <TabsTrigger value="users" className="rounded-lg px-6">
                                <Users className="w-4 h-4 mr-2" />
                                Users
                            </TabsTrigger>
                            <TabsTrigger value="donations" className="rounded-lg px-6">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Donations
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 w-[180px] md:w-[250px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <TabsContent value="users" className="mt-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10">
                                            <Users className="w-4 h-4 mr-2" />
                                            {userRoleFilter === 'all' ? 'All Roles' : userRoleFilter === 'donor' ? 'Donors' : 'NGOs'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setUserRoleFilter('all')}>All Roles</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setUserRoleFilter('donor')}>Donors Only</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setUserRoleFilter('ngo')}>NGOs Only</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TabsContent>

                            <TabsContent value="donations" className="mt-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10">
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            {donationStatusFilter === 'all' ? 'All Stages' : donationStatusFilter.charAt(0).toUpperCase() + donationStatusFilter.slice(1)}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setDonationStatusFilter('all')}>All Stages</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDonationStatusFilter('available')}>Available</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDonationStatusFilter('requested')}>Requested</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDonationStatusFilter('collected')}>Collected</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDonationStatusFilter('cancelled')}>Cancelled</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TabsContent>

                            <Button onClick={() => setIsAddUserOpen(true)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="users">
                        <Card className="glass overflow-hidden">
                            <ScrollArea className="h-[600px]">
                                <div className="divide-y divide-border">
                                    {filteredUsers.filter(u => u.role === 'donor').length > 0 && (
                                        <>
                                            <div className="bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-3 h-3" /> Donors
                                                </div>
                                                <span className="bg-primary/10 px-1.5 rounded text-primary">{filteredUsers.filter(u => u.role === 'donor').length}</span>
                                            </div>
                                            {filteredUsers.filter(u => u.role === 'donor').map((u) => (
                                                <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary`}>
                                                            <Store className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{u.displayName}</p>
                                                            <p className="text-xs text-muted-foreground">{u.email} • @{u.username}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(u);
                                                                setIsResetPasswordOpen(true);
                                                            }}
                                                        >
                                                            <RotateCcw className="w-4 h-4 mr-2" />
                                                            Reset Password
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteUser(u.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {filteredUsers.filter(u => u.role === 'ngo').length > 0 && (
                                        <>
                                            <div className="bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between border-t">
                                                <div className="flex items-center gap-2">
                                                    <HandHeart className="w-3 h-3" /> NGOs
                                                </div>
                                                <span className="bg-accent/10 px-1.5 rounded text-accent">{filteredUsers.filter(u => u.role === 'ngo').length}</span>
                                            </div>
                                            {filteredUsers.filter(u => u.role === 'ngo').map((u) => (
                                                <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-accent/20 text-accent`}>
                                                            <HandHeart className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{u.displayName}</p>
                                                            <p className="text-xs text-muted-foreground">{u.email} • @{u.username}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(u);
                                                                setIsResetPasswordOpen(true);
                                                            }}
                                                        >
                                                            <RotateCcw className="w-4 h-4 mr-2" />
                                                            Reset Password
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteUser(u.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {filteredUsers.length === 0 && (
                                        <div className="p-12 text-center text-muted-foreground">
                                            No users found matching your search.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </TabsContent>

                    <TabsContent value="donations">
                        <Card className="glass overflow-hidden">
                            <ScrollArea className="h-[600px]">
                                <div className="divide-y divide-border">
                                    {(['available', 'requested', 'collected', 'cancelled'] as const).map((status) => {
                                        const stageDonations = filteredDonations.filter(d => d.status === status);
                                        if (stageDonations.length === 0) return null;

                                        return (
                                            <div key={status} className="divide-y divide-border">
                                                <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between border-b ${status === 'collected' ? 'bg-green-500/10 text-green-700' :
                                                    status === 'requested' ? 'bg-blue-500/10 text-blue-700' :
                                                        status === 'cancelled' ? 'bg-red-500/10 text-red-700' :
                                                            'bg-orange-500/10 text-orange-700'
                                                    }`}>
                                                    <div className="flex items-center gap-2">
                                                        {status === 'available' && <Clock className="w-3 h-3" />}
                                                        {status === 'requested' && <AlertCircle className="w-3 h-3" />}
                                                        {status === 'collected' && <CheckCircle2 className="w-3 h-3" />}
                                                        {status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                                        {status} Donations
                                                    </div>
                                                    <span className={`px-1.5 rounded ${status === 'collected' ? 'bg-green-500/20' :
                                                        status === 'requested' ? 'bg-blue-500/20' :
                                                            status === 'cancelled' ? 'bg-red-500/20' :
                                                                'bg-orange-500/20'
                                                        }`}>{stageDonations.length}</span>
                                                </div>
                                                {stageDonations.map((d) => (
                                                    <div key={d.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${d.status === 'collected' ? 'bg-green-500/20 text-green-600' :
                                                                d.status === 'requested' ? 'bg-blue-500/20 text-blue-600' :
                                                                    d.status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
                                                                        'bg-orange-500/20 text-orange-600'
                                                                }`}>
                                                                {d.status === 'collected' ? <CheckCircle2 className="w-5 h-5" /> :
                                                                    d.status === 'requested' ? <AlertCircle className="w-5 h-5" /> :
                                                                        d.status === 'cancelled' ? <XCircle className="w-5 h-5" /> :
                                                                            <Clock className="w-5 h-5" />}
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="font-semibold text-foreground truncate">{d.itemName}</p>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    By {d.donorName} • {d.quantity} {d.quantityUnit} • {d.location}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge className={`${d.status === 'collected' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                                        d.status === 'requested' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                                            d.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                                                                'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                                        }`}>
                                                                        {d.status}
                                                                    </Badge>
                                                                    {d.requestedByName && (
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {status === 'collected' ? 'Collected by: ' : 'Requested by: '}{d.requestedByName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => {
                                                                if (confirm('Delete this donation card?')) {
                                                                    deleteDonation(d.id);
                                                                    toast.success("Donation deleted");
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                    {filteredDonations.length === 0 && (
                                        <div className="p-12 text-center text-muted-foreground">
                                            No donations found matching your search or filters.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Reset Password Dialog */}
            <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Set a new password for {selectedUser?.displayName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
                        <Button onClick={handleResetPassword}>Update Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Manually create a new donor or NGO account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-name">Display Name</Label>
                            <Input
                                id="new-name"
                                value={newUserDisplayName}
                                onChange={(e) => setNewUserDisplayName(e.target.value)}
                                placeholder="Restaurant or NGO Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-email">Email Address</Label>
                            <Input
                                id="new-email"
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="flex gap-4">
                                <Button
                                    variant={newUserRole === 'donor' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setNewUserRole('donor')}
                                >
                                    Donor
                                </Button>
                                <Button
                                    variant={newUserRole === 'ngo' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setNewUserRole('ngo')}
                                >
                                    NGO
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-user-pass">Password</Label>
                            <Input
                                id="new-user-pass"
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateUser}>Create Account</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
