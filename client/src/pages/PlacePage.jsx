import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import { DoorOpen, DoorClosed, Users, Mail, MapPin } from "lucide-react";
import BookingWidget from "../BookingWidget";
import { UserContext } from "../UserContext";

export default function PlacePage() {
  const [place, setPlace] = useState(null);
  const { user } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axios.get(`/place/${id}`);
        setPlace(response.data);
      } catch (err) {
        console.error("Error fetching place data:", err);
        toast.error("Error fetching place data. Please try again.");
      }
    }
    fetchPlace();
  }, [id]);

  if (!place) {
    return (
      <div className="text-center py-10">
        <span className="text-xl font-semibold">Loading place details...</span>
      </div>
    );
  }

  const isOwner = user && place && user?.id === place.owner?._id;

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink place={place} />
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          {place.description && (
            <div className="my-4">
              <h2 className="font-semibold text-2xl mb-2">Description</h2>
              {place.description}
            </div>
          )}
          <span className="flex gap-1 items-center">
            <DoorOpen className="w-5 h-5" />
            Check-in: {place.checkIn}
          </span>
          <span className="flex gap-1 items-center">
            <DoorClosed className="w-5 h-5" />
            Check-out: {place.checkOut}
          </span>
          <span className="flex gap-1 items-center">
            <Users className="w-5 h-5" />
            Max-Guests: {place.maxGuests}
          </span>
        </div>

        <div>
          {isOwner ? (
            <div className="bg-white p-4 rounded-md text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                You are the owner of this place.
              </h2>
              <p className="mt-2 text-gray-500">
                Manage this accommodation from your dashboard.
              </p>
              <button
                className="mt-4 primary"
                onClick={() => {
                  window.location.href = "/account/places";
                }}
              >
                Go to your accommodation
              </button>
            </div>
          ) : (
            <BookingWidget place={place} />
          )}
        </div>
      </div>

      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Extra Info Section */}
          <div>
            <h2 className="font-semibold text-2xl mb-2">Extra Info</h2>
            <div className="text-sm text-gray-700 leading-5">
              {place.extraInfo}
            </div>
          </div>

          {/* Owner Details Section */}
          {place.owner && (
            <div>
              <h2 className="font-semibold text-2xl mb-2">Owner Details</h2>
              <div className="flex items-center mt-4 bg-gray-100 p-6 rounded-md shadow-sm">
                <img
                  src={`http://localhost:3030${place.owner.profilePic}`}
                  alt={`${place.owner.name}'s profile`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {place.owner.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 stroke-gray-700" />
                    <p className="text-sm text-gray-500">{place.owner.email}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 stroke-gray-700" />
                    <p className="text-sm text-gray-500">{place.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
