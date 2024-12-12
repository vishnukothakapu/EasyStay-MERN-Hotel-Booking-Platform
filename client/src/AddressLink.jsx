import { MapPin } from 'lucide-react';

export default function AddressLink({ place }) {
    if(!place?.address){
        return null;
    }
    return (
      <div className="my-2 flex items-center gap-1">
        <MapPin className="w-5 h-5" />
        <a
          className="block font-semibold underline"
          target="_blank"
          href={"https://maps.google.com/?q=" + place.address}
        >
          {place.address}
        </a>
      </div>
    );
}