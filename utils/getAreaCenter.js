export default function getAreaCenter(bounds) {
  const center = {
    lat: (bounds[0] + bounds[2]) / 2,
    lon: (bounds[1] + bounds[3]) / 2
  };
  return center;
}