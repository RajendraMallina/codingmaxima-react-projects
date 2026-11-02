import { useEffect, useRef, useState, type FormEvent } from "react";
import LabLayout from "./LabLayout";
import "./api-projects.css";
type Currency = { iso_code: string; name: string };
type Result = {
  amount: number;
  base: string;
  quote: string;
  rate: number;
  date: string;
};
const number = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 4 });
export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]),
    [amount, setAmount] = useState("100"),
    [base, setBase] = useState("USD"),
    [quote, setQuote] = useState("EUR"),
    [date, setDate] = useState(""),
    [result, setResult] = useState<Result | null>(null),
    [status, setStatus] = useState("Loading currencies…");
  const request = useRef(0);
  async function loadCurrencies() {
    setStatus("Loading currencies…");
    try {
      const response = await fetch("https://api.frankfurter.dev/v2/currencies");
      if (!response.ok) throw Error();
      const data: unknown = await response.json();
      const list = Array.isArray(data)
        ? data.filter(
            (c): c is Currency =>
              !!c &&
              typeof c.iso_code === "string" &&
              typeof c.name === "string",
          )
        : [];
      if (!list.length) throw Error();
      setCurrencies(list);
      setStatus("Enter an amount and choose currencies.");
    } catch {
      setStatus("Could not load currencies. Check your connection and retry.");
    }
  }
  useEffect(() => {
    void loadCurrencies();
    return () => {
      request.current++;
    };
  }, []);
  async function convert(e: FormEvent) {
    e.preventDefault();
    const id = ++request.current,
      n = Number(amount);
    setResult(null);
    if (amount.trim() === "" || !Number.isFinite(n) || n < 0) {
      setStatus("Enter a non-negative amount.");
      return;
    }
    if (base === quote) {
      setResult({ amount: n, base, quote, rate: 1, date: "" });
      setStatus("Both currencies are the same.");
      return;
    }
    setStatus("Loading exchange rate…");
    try {
      const params = new URLSearchParams({ base, quotes: quote });
      if (date) params.set("date", date);
      const response = await fetch(
        "https://api.frankfurter.dev/v2/rates?" + params,
      );
      if (!response.ok) throw Error();
      const rows = (await response.json()) as {
        rate?: number;
        date?: string;
        quote?: string;
      }[];
      if (id !== request.current) return;
      const row = Array.isArray(rows)
        ? rows.find((x) => x.quote === quote)
        : undefined;
      if (
        !row ||
        typeof row.rate !== "number" ||
        !Number.isFinite(row.rate) ||
        !row.date
      ) {
        setStatus("No rate is available for this currency pair and date.");
        return;
      }
      setResult({ amount: n, base, quote, rate: row.rate, date: row.date });
      setStatus(date ? "Historical rate" : "Latest available rate");
    } catch {
      if (id === request.current)
        setStatus(
          "Could not load a rate. Try another date or try again later.",
        );
    }
  }
  return (
    <LabLayout
      title="Currency Converter"
      icon="↔"
      kicker="PUBLIC APIS · CURRENCY"
      description="Convert an amount with the latest available rate, or select a date to explore historical rates."
    >
      <div className="lab-layout">
        <section className="lab-card">
          <div className="lab-card-body">
            <div className="lab-card-heading">
              <div>
                <h2>Convert currencies</h2>
                <p>Rates are reference rates, not live trading prices.</p>
              </div>
              <span className="lab-icon" aria-hidden="true">
                ↔
              </span>
            </div>
            <form className="lab-form" onSubmit={convert}>
              <div className="lab-field">
                <label htmlFor="currency-amount">Amount</label>
                <input
                  id="currency-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="any"
                  required
                />
              </div>
              <div className="lab-fields">
                <div className="lab-field">
                  <label htmlFor="currency-base">From</label>
                  <select
                    id="currency-base"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c.iso_code} value={c.iso_code}>
                        {c.iso_code} · {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lab-field">
                  <label htmlFor="currency-quote">To</label>
                  <select
                    id="currency-quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c.iso_code} value={c.iso_code}>
                        {c.iso_code} · {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                className="lab-button"
                onClick={() => {
                  setBase(quote);
                  setQuote(base);
                  setResult(null);
                }}
              >
                ⇄ Swap currencies
              </button>
              <div className="lab-field">
                <label htmlFor="currency-date">
                  Historical date (optional)
                </label>
                <input
                  id="currency-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                />
              </div>
              <button
                className="lab-button primary"
                type="submit"
                disabled={!currencies.length}
              >
                Convert
              </button>
              {!currencies.length && (
                <button
                  className="lab-button"
                  type="button"
                  onClick={() => void loadCurrencies()}
                >
                  Retry currencies
                </button>
              )}
            </form>
          </div>
        </section>
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <h2 className="api-section-title">Conversion result</h2>
              <p className="api-status" role="status" aria-live="polite">
                {status}
              </p>
              {result && (
                <div className="api-detail">
                  <div>
                    <span>Converted amount</span>
                    <strong>
                      {number(result.amount * result.rate)} {result.quote}
                    </strong>
                  </div>
                  <div>
                    <span>Exchange rate</span>
                    <strong>
                      1 {result.base} = {number(result.rate)} {result.quote}
                    </strong>
                  </div>
                  <div>
                    <span>Rate date</span>
                    <strong>{result.date || "Same currency"}</strong>
                  </div>
                </div>
              )}
            </div>
          </section>
          <p className="api-note">
            Rates from{" "}
            <a
              className="api-source"
              href="https://frankfurter.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frankfurter ↗
            </a>
            . Availability varies by currency and date.
          </p>
        </div>
      </div>
    </LabLayout>
  );
}
