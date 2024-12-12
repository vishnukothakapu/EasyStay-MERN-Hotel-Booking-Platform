import { useState, useEffect } from "react";
import axios from "axios";
import Perks from "../Perks";
import { toast } from "react-toastify";
import PhotosUploader from "../PhotosUploader";
import {
  Building,
  DoorClosed,
  DoorOpen,
  MapPinHouse,
  IndianRupee,
  UsersRound,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
export default function PlacesFormPage() {
  const { id } = useParams();
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [extraInfo, setExtraInfo] = useState("");
  const [price, setPrice] = useState(0);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      console.log(response);
      const { data } = response;
      setTitle(data?.title || "");
      setAddress(data?.address || "");
      setAddedPhotos(data?.photos || []);
      setDescription(data?.description || "");
      setPerks(data?.perks || []);
      setCheckIn(data?.checkIn || "");
      setCheckOut(data?.checkOut || "");
      setMaxGuests(data?.maxGuests || 1);
      setExtraInfo(data?.extraInfo || "");
      setPrice(data?.price || 0);
    });
  }, [id]);
  function inputHeader(header) {
    return <h2 className="text-2xl mt-4">{header}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      extraInfo,
      price,
    };
    try {
      if (id) {
        //update
        await axios.put(`/places/${id}`, placeData );
        toast.success("Accommodation updated successfully");
      } else {
        await axios.post("/places", placeData);
        toast.success("Accommodation added successfully");
      }
      setRedirect(true);
    }
    catch (err) {
      console.error('Error updating accommodation', err);
      toast.error('Failed to save accommodation. Please try again');
    }
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {preInput("Title", "Title for your place. Should be short and catchy")}
        <div className="flex items-center relative">
          <Building className="absolute stroke-gray-500 w-5 h-5 left-2" />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {preInput("Address", "Address of this place")}
        <div className="flex items-center relative">
          <MapPinHouse className="absolute stroke-gray-500 left-2 w-5 h-5" />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {preInput("Photos", "More = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {preInput("Perks", "Select all the perks that are available")}
        <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput(
          "Check in & out times, Max guests",
          "Add check-in and out times"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div className="mt-2 -mb-1">
            <label>Check in</label>
            <div className="flex items-center relative">
              <DoorOpen className="absolute stroke-gray-500 left-2 w-5 h-5" />
              <input
                type="text"
                placeholder="14:00"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 -mb-1">
            <label>Check out</label>
            <div className="flex items-center relative">
              <DoorClosed className="absolute stroke-gray-500 left-2 w-5 h-5" />
              <input
                type="text"
                placeholder="21:00"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 -mb-1">
            <label>Max guests</label>
            <div className="flex items-center relative">
              <UsersRound className="absolute stroke-gray-500 left-2 w-5 h-5" />
              <input
                type="number"
                placeholder="4"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 -mb-1">
            <label>Price per night</label>
            <div className="flex items-center relative">
              <IndianRupee className="absolute stroke-gray-500 left-2 w-5 h-5" />
              <input
                type="number"
                placeholder="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {preInput("Extra info", "House rules, etc...")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        ></textarea>

        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
