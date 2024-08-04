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
  Avatar,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
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
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
    { key: "Others", label: "Others" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfile();
        if (response.code === 200) {
          const dob = response.data.dob ? new Date(response.data.dob) : null;
          setUser(response.data);
          setFormData({
            userId: response.data.id,
            email: response.data.email,
            phone: response.data.phoneNumber,
            address: response.data.address,
            gender: response.data.gender,
            dob: dob ? new Date(dob.getTime() - dob.getTimezoneOffset() * 60000).toISOString().split("T")[0] : "",
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
              <Select
                variant="flat"
                label="Gender"
                name="gender"
                className="mb-4"
                value={formData.gender}
                defaultSelectedKeys={[formData.gender]}
                onChange={handleInputChange} 
              >
                {genders.map((gender) => (
                  <SelectItem key={gender.key}>{gender.label}</SelectItem>
                ))}
              </Select>
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
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src="https://nextui.org/avatars/avatar-1.png"
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {user?.fullName || "N/A"}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {user?.id || "N/A"}
                    </h5>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 py-0 text-small text-default-400">
                <p>Email: {user?.email || "N/A"}</p>
                <p>Address: {user?.address || "N/A"}</p>
                <p>
                  Date of Birth:{" "}
                  {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </p>
                <p>Gender: {user?.gender || "N/A"}</p>
                <p>Phone: {user?.phoneNumber || "N/A"}</p>
                <span className="pt-2">
                  #Click edit button for updating your information
                  <span className="py-2" aria-label="computer" role="img">
                    💻
                  </span>
                </span>
              </CardBody>
              <Button className="mt-5" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
