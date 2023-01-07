import { Image } from "./image";
import { Model } from "./model";

export type Car = {
  id: number;

  variant: string;
  power?: number;
  officialWeight?: number;
  weight?: number;
  options?: string;
  startYear?: string;
  endYear?: string;
  imageFile?: Image;
  selectedFavcarsUrl?: string;
  model: Model;

  // Transient fields
  label?: string;
};