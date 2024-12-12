import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import { useState, useEffect, React } from 'react'; 
import { Plus } from 'lucide-react';
const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="text-center mt-5">
        <Link
          to={"/account/places/new"}
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full text-center cursor-pointer"
        >
          <Plus className="w-6 h-6" />
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place, index) => (
            <Link
              to={"/account/places/" + place._id}
              key={index}
              className="bg-gray-100 cursor-pointer p-2 rounded-md flex gap-4 "
            >
              <div className="flex w-32 h-32 bg-gray-500 grow shrink-0 overflow-hidden rounded-md">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl font-medium">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PlacesPage;
