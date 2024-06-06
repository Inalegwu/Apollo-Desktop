import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { v4 } from "uuid";
import { FileTypes } from "./types";

export function generateRandomName() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 3,
    separator: "-",
  });

  return randomName;
}

export function generateAppId() {
  return v4();
}

export const randomNumber = () =>
  Math.floor((Math.random() * window.innerWidth) / 2);

export const randomNumberfromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const matchFileType = (ext: string) => {
  if (ext === FileTypes.MD) {
    return FileTypes.MD;
  }

  if (ext === FileTypes.DOCX) {
    return FileTypes.DOCX;
  }

  if (ext === FileTypes.TXT) {
    return FileTypes.TXT;
  }

  return null;
};
