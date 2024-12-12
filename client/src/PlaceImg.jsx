export default function PlaceImg({ place,index=0,className=null }) {
  if (!place.photos?.length) {
    return "";
    }
    if (!className) {
        className="object-cover "
    }
  return (
    
      <img
        src={`http://localhost:3030/uploads/${place.photos[index]}`}
        alt={`${place.title} preview`}
        className={className}
      />
  );
}
