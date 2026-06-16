import { BsForkKnife } from "react-icons/bs";
import { GrGamepad } from "react-icons/gr";
import {
  MdOutlineDashboard,
  MdOutlineHouse,
  MdOutlineLocalTaxi,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { PiFilmSlateBold } from "react-icons/pi";

export const categoryOptions = [
  { value: "housing", label: "Housing" },
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "gaming", label: "Gaming" },
  { value: "others", label: "Others" },
];

export const categoryIcons = {
  housing: MdOutlineHouse,
  food: BsForkKnife,
  transportation: MdOutlineLocalTaxi,
  entertainment: PiFilmSlateBold,
  shopping: MdOutlineShoppingBag,
  gaming: GrGamepad,
  others: MdOutlineDashboard,
};
