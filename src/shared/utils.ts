export const NAMES = [
  "satisfied",
  "simple",
  "horse",
  "defacto",
  "standard",
  "rebellios",
  "statue",
  "moustache",
  "disgruntled",
  "developer",
  "experienced",
  "deviant",
  "animated",
  "kaiju",
  "protector",
  "disciplined",
];

export function generateNewDeviceName() {
  return `${NAMES[Math.floor(Math.random() * NAMES.length)]}-${
    NAMES[Math.floor(Math.random() * NAMES.length)]
  }-${NAMES[Math.floor(Math.random() * NAMES.length)]}`;
}
