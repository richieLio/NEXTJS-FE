import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig";
import { Button, Avatar, Image, Progress } from "@nextui-org/react";
import { toast } from "react-toastify";
import {CameraIcon} from "@/components/CameraIcon"
interface AvatarInputProps {
  userId: string;
  avatarUrl: string;
  onAvatarUrlChange: (url: string) => void;
}

const AvatarInput: React.FC<AvatarInputProps> = ({ userId, avatarUrl, onAvatarUrlChange }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectedFile = async (files: FileList | null) => {
    if (files && files.length > 0) {
      if (files[0].size < 10000000) { // 10MB limit
        setImageFile(files[0]);
        await handleUploadFile(files[0]);
      } else {
        toast.error("File size too large");
      }
    } else {
      toast.error("No file selected or file is too large");
    }
  };

  const handleUploadFile = async (file: File) => {
    const name = file.name;
    const storageRef = ref(storage, `image/${userId}/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressUpload(progress);
      },
      (error) => {
        setIsUploading(false);
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setIsUploading(false);
          onAvatarUrlChange(url);
        });
      }
    );
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleSelectedFile(e.target.files)}
        className="hidden"
        id="avatarInput"
      />
      <label htmlFor="avatarInput">
      <Avatar isBordered
          radius="full"
          size="lg"
          className="cursor-pointer w-20 h-20 text-large"
           showFallback src={avatarUrl || "https://images.unsplash.com/broken" }  fallback={
        <CameraIcon className="animate-pulse w-6 h-6 text-default-500" fill="currentColor" size={20} />
      } />
       
      </label>
      {isUploading && (
        <div className="mt-2">
          <Progress value={progressUpload} className="bg-primary-100" />
          <p>Uploading {Math.round(progressUpload)}%</p>
        </div>
      )}
    </div>
  );
};

export default AvatarInput;
