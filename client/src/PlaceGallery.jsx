import { Image,X } from 'lucide-react';
import { useState,useEffect } from 'react';
export default function PlaceGallery({ place }) {
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    // useEffect(() => {
    //     if (showAllPhotos) {
    //         document.body.style.overflow = "hidden";
    //     }
    //     else {
    //         document.body.style.overflow = "auto";
    //     }
    // }, [showAllPhotos]);
    if (showAllPhotos) {
     return (
       <div className="absolute inset-0 bg-black text-white min-h-screen z-50">
         <div className="bg-black p-8 grid gap-4">
           <div>
             <h2 className="text-3xl text-center">Photos of {place.title}</h2>
             <button
               onClick={() => setShowAllPhotos(false)}
               className="fixed right-8 top-8 flex gap-1 py-2 px-3 rounded-md shadow-md bg-white  text-black items-center"
             >
               <X className="w-5 h-5" />
               Close
             </button>
           </div>
           {place?.photos?.length > 0 &&
             place.photos.map((photo, index) => (
               <div key={index} className="block m-auto">
                 <img
                   className=""
                   src={`http://localhost:3030/uploads/${photo}`}
                   alt={place.title}
                 />
               </div>
             ))}
         </div>
       </div>
     );
   }
    return (
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-md overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-contain cursor-pointer"
                  src={`http://localhost:3030/uploads/${place.photos?.[0]}`}
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={`http://localhost:3030/uploads/${place.photos?.[1]}`}
              />
            )}
            <div className="overflow-hidden">
              {place.photos?.[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  src={`http://localhost:3030/uploads/${place.photos?.[2]}`}
                />
              )}
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-md border border-gray-900"
          onClick={() => setShowAllPhotos(true)}
        >
          <Image className="w-5 h-5" />
          <span>Show more photos</span>
        </button>
      </div>
    );
}