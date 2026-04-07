import { useState, useCallback } from 'react';
import { travelService, TravelPlanning } from '@/services/Travel/travelService';

export default () => {
	const [destinations, setDestinations] = useState<TravelPlanning.Destination[]>([]);
	const [itineraries, setItineraries] = useState<TravelPlanning.Itinerary[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchDestinations = useCallback(() => {
		setLoading(true);
		travelService.seedIfEmpty();
		const data = travelService.getDestinations();
		setDestinations(data);
		setLoading(false);
	}, []);

	const fetchItineraries = useCallback(() => {
		setLoading(true);
		const data = travelService.getItineraries();
		setItineraries(data);
		setLoading(false);
	}, []);

	const addDestination = (destination: TravelPlanning.Destination) => {
		const updated = [...destinations, destination];
		setDestinations(updated);
		travelService.saveDestinations(updated);
	};

	const updateDestination = (destination: TravelPlanning.Destination) => {
		const updated = destinations.map((d) =>
			d.destinationId === destination.destinationId ? destination : d
		);
		setDestinations(updated);
		travelService.saveDestinations(updated);
	};

	const deleteDestination = (id: string) => {
		const updated = destinations.filter((d) => d.destinationId !== id);
		setDestinations(updated);
		travelService.saveDestinations(updated);
	};

	const saveItineraries = (updatedItineraries: TravelPlanning.Itinerary[]) => {
		setItineraries(updatedItineraries);
		travelService.saveItineraries(updatedItineraries);
	};

	return {
		destinations,
		itineraries,
		loading,
		fetchDestinations,
		fetchItineraries,
		addDestination,
		updateDestination,
		deleteDestination,
		saveItineraries,
	};
};
