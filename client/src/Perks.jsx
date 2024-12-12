import React from 'react'
import {
  Wifi,
  CircleParking,
  Utensils,
  Waves,
  Tv,
  PawPrint,
} from "lucide-react";
const Perks = ({ selected, onChange }) => {
    function handleCheckBox(e) {
        const { checked, name } = e.target;
        checked ? onChange([...selected, name]) : onChange([...selected.filter(selectedName => selectedName !== name)]);
    }
  return (
    <>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("Wifi")} name="Wifi" onChange={handleCheckBox} />
        <Wifi className="w-5 h-5" />
        <span>Wifi</span>
      </label>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("Parking")} name="Parking" onChange={handleCheckBox} />
        <CircleParking className="w-5 h-5" />
        <span>Free parking</span>
      </label>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("TV")} name="TV" onChange={handleCheckBox} />
        <Tv className="w-5 h-5" />
        <span>TV</span>
      </label>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("Kitchen")} name="Kitchen" onChange={handleCheckBox} />
        <Utensils className="w-5 h-5" />
        <span>Kitchen</span>
      </label>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("Geyser")} name="Geyser" onChange={handleCheckBox} />
        <Waves className="w-5 h-5" />
        <span>Geyser</span>
      </label>
      <label className="flex items-center gap-2 border p-4 rounded-md cursor-pointer">
        <input type="checkbox" checked={selected.includes("Pets")} name="Pets" onChange={handleCheckBox} />
        <PawPrint className="w-5 h-5" />
        <span>Pets</span>
      </label>
    </>
  );
}

export default Perks
