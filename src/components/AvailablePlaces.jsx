import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  // Todo : fetch available places from backend API
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json(); 
        if (!response.ok) {
          throw new Error("Failed to fetch places.");
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({
          message: error.message || "error"
        });
      }
        setIsFetching(false);
    }
    fetchPlaces();
  }, []);
  if(error) {
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
