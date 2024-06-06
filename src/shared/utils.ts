import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { v4 } from "uuid";

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

export const randomNumber = () => Math.floor(Math.random() * 250);
