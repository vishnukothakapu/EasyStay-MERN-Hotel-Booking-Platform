import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then((response) => {
      setPlaces(response.data);
    })
  },[])
  return (
    <div>
      {places?.length == 0 && (
        <div className="my-2 text-center ">No places found...</div>
      )}
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.length > 0 &&
          places.map((place, index) => (
            <Link to={`/place/${place._id}`} key={index}>
              <div className="bg-gray-500 rounded-md flex mb-2">
                {place.photos?.[0] && (
                  <img
                    src={`http://localhost:3030/uploads/${place.photos?.[0]}`}
                    alt={`${place.title} preview`}
                    className="rounded-md object-cover aspect-square "
                  />
                )}
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="text-gray-500 w-5 h-5" />
                <h3 className="font-medium text-md text-gray-700">
                  {place.address}
                </h3>
              </div>
              <h2 className="text-md">{place.title}</h2>
              <div>
                <span className="font-semibold">₹ {place.price}</span> per night
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default IndexPage
