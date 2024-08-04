import React, { useEffect, useState } from "react";
import { userProfile, putUpdateProfile } from "../api/user";
import {
  Card,
  Spacer,
  CardHeader,
  CardBody,
  Input,
  Button,
  Select,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const Profile = () => {
  const [user, setUser] = useState<any>(null); // Use a more specific type if you have one
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    address: "",
    dob: "",
    gender: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfile();
        if (response.code === 200) {
          setUser(response.data);
          setFormData({
            userId: response.data.id,
            email: response.data.email,
            phone: response.data.phoneNumber,
            address: response.data.address,
            gender: response.data.gender,
            dob: response.data.dob
              ? new Date(response.data.dob).toISOString().split("T")[0]
              : "", // Ensure the date is in YYYY-MM-DD format
            fullName: response.data.fullName,
          });
        } else {
          toast.error("Failed to fetch user profile");
          setError("Failed to fetch user profile");
        }
      } catch (error) {
        toast.error("An error occurred during fetch user profile");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await putUpdateProfile(
        formData.userId,
        formData.email,
        formData.phone,
        formData.address,
        formData.gender,
        formData.dob,
        formData.fullName
      );
      if (response.code === 200) {
        toast.success("Profile updated successfully");
        setUser(response.data);
        setEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred during profile update");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading profile.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <h2 className="text-2xl font-bold">Your Profile</h2>
        </CardHeader>
        <CardBody>
          <Spacer y={1} />
          {editing ? (
            <>
              <Input
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                fullWidth
                label="Gender"
                name="gender"
                type="text"
                value={formData.gender}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Input
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mb-4"
              />
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold">Full Name</h3>
              <p className="text-lg">{user?.fullName || "N/A"}</p>
              <Spacer y={1} />
              <h3 className="text-xl font-semibold">Email</h3>
              <p className="text-lg">{user?.email || "N/A"}</p>
              <Spacer y={1} />
              <h3 className="text-xl font-semibold">Address</h3>
              <p className="text-lg">{user?.address || "N/A"}</p>
              <Spacer y={1} />
              <h3 className="text-xl font-semibold">Date of Birth</h3>
              <p className="text-lg">
                {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
              </p>
              <Spacer y={1} />
              <h3 className="text-xl font-semibold">Gender</h3>
              <p className="text-lg">{user?.gender || "N/A"}</p>
              <Spacer y={1} />
              <h3 className="text-xl font-semibold">Phone</h3>
              <p className="text-lg">{user?.phoneNumber || "N/A"}</p>
              <Spacer y={1} />
              <Button onClick={() => setEditing(true)}>Edit</Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
