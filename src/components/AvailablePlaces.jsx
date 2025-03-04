import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  // Todo : fetch available places from backend API
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        // Fetch available places from the backend API
        const places = await fetchAvailablePlaces(availablePlaces);
        // Sort locations by distance
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          // Reset error state if there was any
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message: error.message || "error",
        });
        // Reset fetching state if there was any
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);
  // Render error message if there is one
  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }
  // Render available places
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText="Loading available places..."
      isLoading={isFetching}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
} // AvailablePlaces
