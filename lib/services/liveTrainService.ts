export interface TrainStationStatus {
    is_current_station: boolean;
    station_name: string;
    distance: string;
    timing: string;
    delay: string;
    platform: string;
    halt: string;
}

export interface LiveTrainResponse {
    success: boolean;
    train_name: string;
    message: string;
    updated_time: string;
    data: TrainStationStatus[];
}

export interface LiveTrainSummary {
    trainName: string;
    currentStation: string | null;
    delayStatus: string;
    lastUpdated: string;
    upcomingStations: TrainStationStatus[];
}

/**
 * Fetches live running status for a specific train using the Rappid.in API.
 * @param trainNumber The 5-digit Indian Railways train number (e.g., "12951")
 * @returns A promise that resolves to the raw API response or null if failed.
 */
export async function fetchLiveTrainStatusRaw(trainNumber: string): Promise<LiveTrainResponse | null> {
    try {
        const response = await fetch(`https://rappid.in/apis/train.php?train_no=${trainNumber}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch train status: ${response.statusText}`);
        }

        const data: LiveTrainResponse = await response.json();
        return data.success ? data : null;
    } catch (error) {
        console.error(`Error fetching live status for train ${trainNumber}:`, error);
        return null;
    }
}

/**
 * Fetches and summarizes the live running status for a specific train.
 * Useful for displaying quick insights on the route card.
 * @param trainNumber The 5-digit Indian Railways train number
 */
export async function getLiveTrainSummary(trainNumber: string): Promise<LiveTrainSummary | null> {
    const rawData = await fetchLiveTrainStatusRaw(trainNumber);

    if (!rawData || !rawData.success || !rawData.data) {
        return null;
    }

    const stations = rawData.data;

    // Find the current active station (where is_current_station is true)
    // If none are true, it either hasn't started or has completed its journey.
    const currentIndex = stations.findIndex(s => s.is_current_station);

    let currentStation = null;
    let delayStatus = "Unknown";
    let upcomingStations: TrainStationStatus[] = [];

    if (currentIndex !== -1) {
        const current = stations[currentIndex];
        currentStation = current.station_name;
        delayStatus = current.delay;
        // Get the next 3 upcoming stations
        upcomingStations = stations.slice(currentIndex + 1, currentIndex + 4);
    } else if (stations.length > 0) {
        // If we can't find the 'current' flag, check if it's completed or pending by looking at the first station's delay string
        const firstStation = stations[0];
        const lastStation = stations[stations.length - 1];

        if (lastStation.timing === "Destination" && lastStation.distance !== "-") {
            currentStation = lastStation.station_name;
            delayStatus = lastStation.delay;
        } else {
            currentStation = firstStation.station_name;
            delayStatus = firstStation.delay;
            upcomingStations = stations.slice(1, 4);
        }
    }

    return {
        trainName: rawData.train_name,
        currentStation,
        delayStatus,
        lastUpdated: rawData.updated_time,
        upcomingStations
    };
}
