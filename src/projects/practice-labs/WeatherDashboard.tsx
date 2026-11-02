import { useEffect, useRef, useState, type FormEvent } from "react";
import LabLayout from "./LabLayout";
import "./api-projects.css";
type Place = {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};
type Weather = {
  timezone?: string;
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
    precipitation_probability_max?: number[];
  };
};
function label(code?: number) {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code !== undefined && code >= 51 && code <= 67) return "Rain or drizzle";
  if (code !== undefined && code >= 71 && code <= 77) return "Snow";
  if (code !== undefined && code >= 80 && code <= 86) return "Showers";
  if (code !== undefined && code >= 95) return "Thunderstorm";
  return "Conditions unavailable";
}
function value(n: number | undefined, suffix: string) {
  return typeof n === "number" && Number.isFinite(n)
    ? `${n}${suffix}`
    : "Not available";
}
export default function WeatherDashboard() {
  const [query, setQuery] = useState(""),
    [places, setPlaces] = useState<Place[]>([]),
    [place, setPlace] = useState<Place | null>(null),
    [weather, setWeather] = useState<Weather | null>(null),
    [status, setStatus] = useState("Search for a city to begin.");
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  async function search(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) {
      setStatus("Enter a city name.");
      return;
    }
    const id = ++request.current;
    setPlaces([]);
    setPlace(null);
    setWeather(null);
    setStatus("Searching locations…");
    try {
      const response = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?" +
          new URLSearchParams({
            name: q,
            count: "10",
            language: "en",
            format: "json",
          }),
      );
      if (!response.ok) throw Error("Search unavailable");
      const data = (await response.json()) as { results?: Place[] };
      if (id !== request.current) return;
      const rows = (data.results || []).filter(
        (item) =>
          typeof item.latitude === "number" &&
          typeof item.longitude === "number",
      );
      setPlaces(rows);
      setStatus(
        rows.length
          ? "Choose a location to see its weather."
          : "No matching cities found. Try another name.",
      );
    } catch {
      if (id === request.current)
        setStatus(
          "Could not load locations. Check your connection and try again.",
        );
    }
  }
  async function choose(item: Place) {
    const id = ++request.current;
    setPlace(item);
    setWeather(null);
    setStatus("Loading forecast…");
    const params = new URLSearchParams({
      latitude: String(item.latitude),
      longitude: String(item.longitude),
      current:
        "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
      daily:
        "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
      timezone: "auto",
      forecast_days: "7",
    });
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?" + params,
      );
      if (!response.ok) throw Error("Forecast unavailable");
      const data = (await response.json()) as Weather;
      if (id !== request.current) return;
      if (!data.current || !data.daily) throw Error("Incomplete forecast");
      setWeather(data);
      setStatus("Forecast loaded.");
    } catch {
      if (id === request.current)
        setStatus("Could not load the forecast. Choose the location to retry.");
    }
  }
  return (
    <LabLayout
      title="Weather Dashboard"
      icon="☀"
      kicker="PUBLIC APIS · WEATHER"
      description="Find a city, choose the right location, and explore its current conditions and seven-day forecast."
    >
      <div className="lab-layout">
        <section className="lab-card">
          <div className="lab-card-body">
            <div className="lab-card-heading">
              <div>
                <h2>Find a city</h2>
                <p>Choose a matching location after searching.</p>
              </div>
              <span className="lab-icon" aria-hidden="true">
                ⌕
              </span>
            </div>
            <form className="lab-form" onSubmit={search}>
              <div className="lab-field">
                <label htmlFor="weather-query">City name</label>
                <input
                  id="weather-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try London"
                  maxLength={100}
                  required
                />
              </div>
              <button className="lab-button primary">Search locations</button>
            </form>
            <div className="api-results">
              {places.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lab-button"
                  onClick={() => void choose(item)}
                >
                  {item.name}
                  {item.admin1 ? ", " + item.admin1 : ""}
                  {item.country ? ", " + item.country : ""}
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <h2 className="api-section-title">
                {place?.name || "Your forecast"}
                {place?.country ? ", " + place.country : ""}
              </h2>
              <p className="api-status" role="status" aria-live="polite">
                {status}
              </p>
              {weather && (
                <>
                  <p className="api-note">
                    Local time zone: {weather.timezone || "Not available"}
                  </p>
                  <div className="api-detail">
                    {[
                      [
                        "Current temperature",
                        value(weather.current?.temperature_2m, "°C"),
                      ],
                      ["Conditions", label(weather.current?.weather_code)],
                      [
                        "Feels like",
                        value(weather.current?.apparent_temperature, "°C"),
                      ],
                      [
                        "Humidity",
                        value(weather.current?.relative_humidity_2m, "%"),
                      ],
                      [
                        "Wind speed",
                        value(weather.current?.wind_speed_10m, " km/h"),
                      ],
                    ].map(([name, v]) => (
                      <div key={name}>
                        <span>{name}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <h2 className="api-section-title api-subtitle">
                    Seven-day forecast
                  </h2>
                  <div className="api-results">
                    {(weather.daily?.time || []).map((day, i) => (
                      <div className="api-result" key={day}>
                        <div>
                          <h3>{day}</h3>
                          <p>
                            {label(weather.daily?.weather_code?.[i])} · Rain
                            chance{" "}
                            {value(
                              weather.daily?.precipitation_probability_max?.[i],
                              "%",
                            )}
                          </p>
                        </div>
                        <strong>
                          {value(weather.daily?.temperature_2m_max?.[i], "°")} /{" "}
                          {value(weather.daily?.temperature_2m_min?.[i], "°")}
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
          <p className="api-note">
            Weather and location data from{" "}
            <a
              className="api-source"
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open-Meteo ↗
            </a>
          </p>
        </div>
      </div>
    </LabLayout>
  );
}
