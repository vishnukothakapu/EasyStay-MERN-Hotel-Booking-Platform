import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { Plus, CloudUpload, Image,Trash2 } from "lucide-react";

const PhotosUploader = ({ addedPhotos, onChange }) => {
  const [photoLink, setPhotoLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function addPhotoByLink(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      onChange((prev) => {
        return [...prev, filename];
      });
      setPhotoLink("");
    } catch (error) {
      console.error("Error uploading photo by link:", error);
      toast.error("Error uploading photo by link:");
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    setLoading(true);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    try {
      const response = await axios.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data: filenames } = response;
      onChange((prev) => {
        return [...prev, ...filenames];
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Error uploading photos");
    } finally {
      setLoading(false);
    }
  }
  function removePhoto(ev,filename) {
    ev.preventDefault();
    onChange([...addedPhotos.filter(photo=>photo!==filename)]);
  }
  function selectAsMainPhoto(ev,filename) {
    ev.preventDefault();
    onChange([filename,...addedPhotos.filter(photo=>photo!==filename)]);
  }
  return (
    <>
      <div className="flex gap-2 items-center relative">
        <div className="flex items-center w-full">
          <Image className="absolute stroke-gray-500 left-2 w-5 h-5" />
          <input
            type="text"
            placeholder="Add using a link....jpg"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
          />
        </div>
        <button
          className="bg-gray-200 px-4 rounded-2xl flex items-center gap-1"
          onClick={addPhotoByLink}
          disabled={loading}
        >
          <Plus className="w-6 h-6" />
          {loading ? "Uploading..." : "Add Photo"}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-32 flex relative" key={link}>
              <img
                src={"http://localhost:3030/uploads/" + link}
                className="rounded-xl w-full object-cover"
              />
              <button onClick={(ev)=>selectAsMainPhoto(ev,link)} className="absolute bottom-1 cursor-pointer text-white left-1 bg-black bg-opacity-50 rounded-md px-3 py-2 hover:bg-black">
   {link===addedPhotos[0]&&(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
</svg>

   )}
   {link!==addedPhotos[0] &&(

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
   )}

            </button>
              <button onClick={(ev)=>removePhoto(ev,link)} className="absolute bottom-1 cursor-pointer text-white right-1 bg-primary bg-opacity-50 rounded-md px-3 py-2 hover:bg-primary">
                <Trash2 className="w-6 h-6"/>
            </button>
            </div>
            
          ))}
        <label className="h-32 cursor-pointer flex gap-1 justify-center items-center border bg-transparent rounded-2xl p-2 text-xl text-gray-500">
          <input
            type="file"
            className="hidden"
            multiple
            onChange={uploadPhoto}
            disabled={loading}
          />
          <CloudUpload className="w-6 h-6" />
          {loading ? "Uploading..." : "Upload"}
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;
