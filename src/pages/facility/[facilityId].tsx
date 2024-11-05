import { getFacilityById } from "@/pages/api/facility";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Facility {
  id: string;
  name: string;
  location: string;
  contactInfo: string;
  type: string;
  createdBy: string;
  createdAt: string;
  images: string[];
}

export default function FacilityDetails() {
  const router = useRouter();
  const { facilityId } = router.query;
  const [facility, setFacility] = useState<Facility | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchFacility = async () => {
      if (facilityId) {
        const data = await getFacilityById(facilityId as string);
        console.log(data.data);
        setFacility(data.data);
      }
    };
    fetchFacility();
  }, [facilityId]);

  const nextImage = () => {
    if (facility) {
      setCurrentImage((prev) => (prev === facility.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (facility) {
      setCurrentImage((prev) => (prev === 0 ? facility.images.length - 1 : prev - 1));
    }
  };

  if (!facility) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">{facility.name}</h1>
      
      {/* First horizontal bar */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="relative h-[400px] md:w-2/3 group">
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-4 rounded-full z-10 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <span className="text-2xl font-bold">‹</span>
          </button>
          <Image
            src={facility.images[currentImage]}
            alt={facility.name}
            fill
            className="object-cover rounded-2xl shadow-xl"
            priority
          />
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-4 rounded-full z-10 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <span className="text-2xl font-bold">›</span>
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            {facility.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentImage === index ? 'bg-blue-600 scale-110' : 'bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-lg">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Location</h2>
            <p className="text-gray-600">{facility.location}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Info</h2>
            <p className="text-gray-600">{facility.contactInfo}</p>
          </div>
        </div>
      </div>

      {/* Second horizontal bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Type</h2>
          <p className="text-gray-600">{facility.type}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Created At</h2>
          <p className="text-gray-600">{new Date(facility.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <button
            onClick={() => router.push(`/facility/${facility.id}/booking`)}
            className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
    
  );}