import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Phone, Building, Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateUser, deleteAccount, changePassword } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        old: "",
        new: "",
        confirm: ""
    });
    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        companyName: user?.companyName || "",
    });

    if (!user) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handlePhotoUpload = () => {
        // Mock photo upload
        const mockImages = [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        ];
        const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
        updateUser({ profilePic: randomImg });
        toast.success("Profile picture updated!");
    };

    const backToDashboard = () => {
        navigate(user.role === "donor" ? "/donor/dashboard" : "/ngo/dashboard");
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
            const result = await deleteAccount();
            if (result.success) {
                toast.success("Account deleted successfully.");
                navigate("/");
            } else {
                toast.error(result.error || "Failed to delete account.");
            }
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.old || !passwords.new || !passwords.confirm) {
            toast.error("Please fill in all password fields.");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match.");
            return;
        }

        if (passwords.new.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        setIsUpdatingPassword(true);
        const result = await changePassword(passwords.old, passwords.new);
        setIsUpdatingPassword(false);

        if (result.success) {
            toast.success("Password updated successfully!");
            setPasswords({ old: "", new: "", confirm: "" });
        } else {
            toast.error(result.error || "Failed to update password.");
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Button
                    variant="outline"
                    onClick={backToDashboard}
                    className="transition-all active:scale-95 group mb-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Button>

                <Card className="border-none shadow-premium overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-foodbridge-green/20 to-foodbridge-teal/20" />
                    <CardHeader className="relative pb-0">
                        <div className="absolute -top-16 left-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.profilePic} />
                                    <AvatarFallback className="bg-foodbridge-green text-white text-3xl">
                                        {user.displayName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={handlePhotoUpload}
                                    className="absolute bottom-0 right-0 p-2 bg-background rounded-full shadow-md border hover:bg-muted transition-colors group-hover:scale-110"
                                >
                                    <Camera className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                        <div className="pt-16 pb-6 flex justify-between items-end">
                            <div>
                                <CardTitle className="text-2xl font-bold">{user.displayName}</CardTitle>
                                <CardDescription className="text-foodbridge-green font-medium">
                                    {user.role === 'ngo' ? 'NGO' : 'Donor'} Account
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)} variant="outline">
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" /> Display Name
                                </Label>
                                {isEditing ? (
                                    <Input
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="font-medium">{user.displayName || "Not set"}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground flex items-center gap-2">
                                    <Building className="h-4 w-4" /> {user.role === "donor" ? "Restaurant/Company Name" : "NGO Name"}
                                </Label>
                                {isEditing ? (
                                    <Input
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="font-medium">{user.companyName || "Not set"}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email Address
                                </Label>
                                {isEditing ? (
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="font-medium">{user.email || "Not set"}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground flex items-center gap-2">
                                    <Phone className="h-4 w-4" /> Phone Number
                                </Label>
                                {isEditing ? (
                                    <Input
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="font-medium">{user.phoneNumber || "Not set"}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    {isEditing && (
                        <CardFooter className="bg-muted/30 gap-3 justify-end border-t mt-6">
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-foodbridge-green hover:bg-foodbridge-green/90">
                                Save Changes
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <Card className="border-none shadow-premium overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Security</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleChangePassword();
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="oldPassword">Current Password</Label>
                                <Input
                                    id="oldPassword"
                                    type="password"
                                    value={passwords.old}
                                    onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="px-8 bg-secondary hover:bg-green-500 text-muted-foreground hover:text-black shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 border border-border/50"
                                >
                                    {isUpdatingPassword ? "Changing..." : "Change password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5 shadow-none mt-8">
                    <CardHeader>
                        <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
                        <CardDescription>
                            Permanently delete your account and all associated data.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="w-full md:w-auto"
                        >
                            Delete Account
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
