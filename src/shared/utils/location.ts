const COORDINATE_PRECISION = 6;
const NO_LOCATION_MESSAGE = 'Ubicación no disponible';

function hasValidCoordinates(latitude: number | null, longitude: number | null): boolean {
  return latitude !== null && longitude !== null;
}

export function formatCoordinates(
  latitude: number | null,
  longitude: number | null,
): string {
  if (!hasValidCoordinates(latitude, longitude)) {
    return NO_LOCATION_MESSAGE;
  }

  const lat = parseFloat(latitude!.toFixed(COORDINATE_PRECISION));
  const lng = parseFloat(longitude!.toFixed(COORDINATE_PRECISION));

  return `${lat}, ${lng}`;
}
