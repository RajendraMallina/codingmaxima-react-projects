import { useEffect, useRef, useState, type FormEvent } from "react";
import LabLayout from "./LabLayout";
import "./api-projects.css";

type Country = {
  name: string;
  alpha2Code?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  flag?: string;
  flags?: { svg?: string; png?: string };
  languages?: { name?: string }[];
  currencies?: { name?: string; code?: string }[];
  timezones?: string[];
};
type Recent = { name: string; code: string };
const key = "codingmaxima.country-recent.v1";
function flag(country: Country) {
  try {
    const url = new URL(
      country.flags?.svg || country.flags?.png || country.flag || "",
    );
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
export default function CountryExplorer() {
  const [query, setQuery] = useState(""),
    [results, setResults] = useState<Country[]>([]),
    [selected, setSelected] = useState<Country | null>(null),
    [recent, setRecent] = useState<Recent[]>([]),
    [status, setStatus] = useState("Search for a country to begin.");
  const request = useRef(0);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(saved))
        setRecent(
          saved
            .filter(
              (v): v is Recent =>
                !!v && typeof v.name === "string" && typeof v.code === "string",
            )
            .slice(0, 5),
        );
    } catch {
      /* History is optional. */
    }
    return () => {
      request.current++;
    };
  }, []);
  function show(country: Country) {
    setSelected(country);
    if (!country.alpha2Code) return;
    const next = [
      { name: country.name, code: country.alpha2Code },
      ...recent.filter((item) => item.code !== country.alpha2Code),
    ].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Browsing still works without storage. */
    }
  }
  async function load(path: string, detail = false) {
    const id = ++request.current;
    setStatus("Searching countries…");
    setResults([]);
    setSelected(null);
    try {
      const response = await fetch("https://countries.dev/" + path);
      if (response.status === 404)
        throw new Error("No country found. Try another name.");
      if (response.status === 429)
        throw new Error("Too many requests. Please try again later.");
      if (!response.ok)
        throw new Error(
          "Country data is temporarily unavailable. Please try again.",
        );
      const data: unknown = await response.json();
      if (id !== request.current) return;
      const rows: Country[] = (Array.isArray(data) ? data : [data]).filter(
        (row): row is Country => !!row && typeof row.name === "string",
      );
      if (!rows.length) {
        setStatus("No country found. Try another name.");
        return;
      }
      setResults(rows);
      setStatus(
        `${rows.length} ${rows.length === 1 ? "country" : "countries"} found.`,
      );
      if (detail) show(rows[0]);
    } catch (error) {
      if (id === request.current)
        setStatus(
          error instanceof Error
            ? error.message
            : "Could not connect. Check your internet and try again.",
        );
    }
  }
  function search(event: FormEvent) {
    event.preventDefault();
    const name = query.trim();
    if (!name) {
      setStatus("Enter a country name.");
      return;
    }
    void load("name/" + encodeURIComponent(name));
  }
  return (
    <LabLayout
      title="Country Explorer"
      icon="◎"
      kicker="PUBLIC APIS · DISCOVERY"
      description="Discover countries, explore their details, and return to places you have viewed recently."
    >
      <div className="lab-layout">
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <div className="lab-card-heading">
                <div>
                  <h2>Find a country</h2>
                  <p>Search by full or partial country name.</p>
                </div>
                <span className="lab-icon" aria-hidden="true">
                  ⌕
                </span>
              </div>
              <form className="lab-form" onSubmit={search}>
                <div className="lab-field">
                  <label htmlFor="country-query">Country name</label>
                  <input
                    id="country-query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try India or United"
                    maxLength={100}
                    required
                  />
                </div>
                <button className="lab-button primary" type="submit">
                  Search countries
                </button>
              </form>
            </div>
          </section>
          <section className="lab-card">
            <div className="lab-card-body">
              <h2 className="api-section-title">Recently viewed</h2>
              <p className="api-note">Saved in this browser.</p>
              <div className="api-chips">
                {recent.length ? (
                  recent.map((item) => (
                    <button
                      className="lab-button small"
                      key={item.code}
                      type="button"
                      onClick={() =>
                        void load(
                          "alpha/" + encodeURIComponent(item.code),
                          true,
                        )
                      }
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <p className="api-note">
                    Countries you open will appear here.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <h2 className="api-section-title">Search results</h2>
              <p className="api-status" role="status" aria-live="polite">
                {status}
              </p>
              <div className="api-results">
                {results.map((country) => (
                  <article
                    className="api-result"
                    key={country.alpha2Code || country.name}
                  >
                    <div className="api-title">
                      {flag(country) && (
                        <img className="api-flag" src={flag(country)} alt="" />
                      )}
                      <div>
                        <h3>{country.name}</h3>
                        <p>
                          {country.capital || "Capital unavailable"} ·{" "}
                          {country.region || "Region unavailable"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="lab-button small"
                      type="button"
                      onClick={() => show(country)}
                    >
                      View details
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {selected && (
            <section className="lab-card">
              <div className="lab-card-body">
                <div className="lab-card-heading">
                  <div>
                    <h2>{selected.name}</h2>
                    <p>
                      {selected.subregion ||
                        selected.region ||
                        "Country details"}
                    </p>
                  </div>
                  {flag(selected) && (
                    <img className="api-flag" src={flag(selected)} alt="" />
                  )}
                </div>
                <div className="api-detail">
                  {[
                    ["Capital", selected.capital],
                    ["Region", selected.region],
                    [
                      "Population",
                      typeof selected.population === "number"
                        ? selected.population.toLocaleString()
                        : "",
                    ],
                    [
                      "Languages",
                      selected.languages
                        ?.map((x) => x.name)
                        .filter(Boolean)
                        .join(", "),
                    ],
                    [
                      "Currencies",
                      selected.currencies
                        ?.map((x) =>
                          [x.name, x.code].filter(Boolean).join(" · "),
                        )
                        .filter(Boolean)
                        .join(", "),
                    ],
                    ["Time zones", selected.timezones?.join(", ")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value || "Not available"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          <p className="api-note">
            Country data from{" "}
            <a
              className="api-source"
              href="https://countries.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              countries.dev ↗
            </a>
          </p>
        </div>
      </div>
    </LabLayout>
  );
}
