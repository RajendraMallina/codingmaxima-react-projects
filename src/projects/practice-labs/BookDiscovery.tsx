import { useEffect, useRef, useState, type FormEvent } from "react";
import LabLayout from "./LabLayout";
import { seedReading, type ReadingItem } from "./reading-catalog";
import { isReading, studioKeys } from "./studio-data";
import "./api-projects.css";
type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};
type Results = { numFound: number; docs: Book[] };
const author = (book: Book) =>
  book.author_name?.filter((name) => typeof name === "string").join(", ") ||
  "Unknown author";
const url = (book: Book) =>
  /^\/works\/OL\d+W$/.test(book.key)
    ? "https://openlibrary.org" + book.key
    : "";
const cover = (book: Book) =>
  typeof book.cover_i === "number" &&
  Number.isSafeInteger(book.cover_i) &&
  book.cover_i > 0
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "";
export default function BookDiscovery() {
  const [query, setQuery] = useState(""),
    [type, setType] = useState("title"),
    [books, setBooks] = useState<Book[]>([]),
    [status, setStatus] = useState("Search for a title or author to begin."),
    [shelfStatus, setShelfStatus] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0);
  const request = useRef(0),
    active = useRef({ query: "", type: "title" }),
    cache = useRef(new Map<string, Results>());
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  async function load(next: number) {
    const id = ++request.current;
    setBooks([]);
    setStatus("Searching Open Library…");
    setPage(next);
    const params = new URLSearchParams({
        [active.current.type]: active.current.query,
        page: String(next),
        limit: "10",
        fields: "key,title,author_name,first_publish_year,cover_i",
      }),
      key = params.toString();
    try {
      let data = cache.current.get(key);
      if (!data) {
        const response = await fetch(
          "https://openlibrary.org/search.json?" + params,
        );
        if (!response.ok) throw Error();
        data = (await response.json()) as Results;
        if (
          !data ||
          !Array.isArray(data.docs) ||
          typeof data.numFound !== "number"
        )
          throw Error();
        cache.current.set(key, data);
      }
      if (id !== request.current) return;
      setBooks(
        data.docs.filter(
          (book) =>
            book &&
            typeof book.title === "string" &&
            typeof book.key === "string",
        ),
      );
      setTotal(data.numFound);
      setStatus(
        data.numFound
          ? `${data.numFound.toLocaleString()} results found.`
          : "No books found. Try another search.",
      );
    } catch {
      if (id === request.current) {
        setTotal(0);
        setStatus("Could not load books. Check your connection and try again.");
      }
    }
  }
  function search(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setStatus("Enter a title or author.");
      return;
    }
    active.current = { query: query.trim(), type };
    void load(1);
  }
  function add(book: Book) {
    const link = url(book);
    if (!link) {
      setShelfStatus(
        "This result cannot be saved because its Open Library link is unavailable.",
      );
      return;
    }
    try {
      const raw = localStorage.getItem(studioKeys.reading),
        saved: unknown = raw === null ? seedReading() : JSON.parse(raw);
      if (!Array.isArray(saved) || !saved.every(isReading)) {
        setShelfStatus(
          "Your reading library could not be read, so it was not changed.",
        );
        return;
      }
      const id = "openlibrary-" + book.key.split("/").pop();
      if (saved.some((item) => item.id === id || item.url === link)) {
        setShelfStatus("This book is already in your reading library.");
        return;
      }
      const item: ReadingItem = {
        id,
        title: book.title.slice(0, 180),
        author: author(book).slice(0, 120),
        type: "Book",
        subject: "Books",
        url: link,
        source: "Open Library",
        status: "Want to read",
        progress: 0,
        notes: "",
      };
      localStorage.setItem(
        studioKeys.reading,
        JSON.stringify([item, ...saved]),
      );
      setShelfStatus("Added to your reading library.");
    } catch {
      setShelfStatus(
        "Could not save your book. Check that browser storage is available.",
      );
    }
  }
  return (
    <LabLayout
      title="Book Discovery"
      icon="▤"
      kicker="PUBLIC APIS · BOOKS"
      description="Discover books by title or author and add interesting finds to your reading library."
    >
      <div className="lab-layout">
        <section className="lab-card">
          <div className="lab-card-body">
            <div className="lab-card-heading">
              <div>
                <h2>Find a book</h2>
                <p>Search Open Library's book catalog.</p>
              </div>
              <span className="lab-icon" aria-hidden="true">
                ⌕
              </span>
            </div>
            <form className="lab-form" onSubmit={search}>
              <div className="lab-field">
                <label htmlFor="book-type">Search by</label>
                <select
                  id="book-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                </select>
              </div>
              <div className="lab-field">
                <label htmlFor="book-query">Search terms</label>
                <input
                  id="book-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try Pride and Prejudice"
                  maxLength={150}
                  required
                />
              </div>
              <button className="lab-button primary">Search books</button>
            </form>
            <p className="api-note api-subtitle">
              Search results are catalog records; a free full text is not
              available for every book.
            </p>
            <p className="api-note">
              <a href="/reading-tracker" className="api-source">
                Open Personal Reading Tracker →
              </a>
            </p>
          </div>
        </section>
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <h2 className="api-section-title">Search results</h2>
              <p className="api-status" role="status" aria-live="polite">
                {status}
              </p>
              <p className="api-status" role="status" aria-live="polite">
                {shelfStatus}
              </p>
              <div className="api-results">
                {books.map((book) => (
                  <article className="api-result" key={book.key}>
                    <div className="api-title">
                      {cover(book) && (
                        <img
                          className="api-cover"
                          src={cover(book)}
                          alt=""
                          loading="lazy"
                        />
                      )}
                      <div>
                        <h3>{book.title}</h3>
                        <p>
                          {author(book)} ·{" "}
                          {book.first_publish_year || "Year unavailable"}
                        </p>
                        {url(book) && (
                          <a
                            className="api-source"
                            href={url(book)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Open Library ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      className="lab-button small"
                      type="button"
                      onClick={() => add(book)}
                    >
                      Add to reading list
                    </button>
                  </article>
                ))}
              </div>
              {total > 10 && (
                <div className="api-pager">
                  <button
                    className="lab-button small"
                    type="button"
                    disabled={page <= 1}
                    onClick={() => void load(page - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {Math.ceil(total / 10)}
                  </span>
                  <button
                    className="lab-button small"
                    type="button"
                    disabled={page * 10 >= total}
                    onClick={() => void load(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
          <p className="api-note">
            Book data from{" "}
            <a
              className="api-source"
              href="https://openlibrary.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Library ↗
            </a>
          </p>
        </div>
      </div>
    </LabLayout>
  );
}
