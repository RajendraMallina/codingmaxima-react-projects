import { useEffect, useRef, useState, type FormEvent } from "react";
import LabLayout from "./LabLayout";
import "./api-projects.css";
type Profile = {
  login: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  location?: string;
};
type Repo = {
  name: string;
  description?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
  default_branch?: string;
  open_issues_count?: number;
};
async function json(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (response.status === 404)
    throw Error(
      "No profile or repository found. Check the name and try again.",
    );
  if (response.status === 403 || response.status === 429)
    throw Error(
      "GitHub request limit reached or access restricted. Please try again later.",
    );
  if (!response.ok)
    throw Error("GitHub is temporarily unavailable. Please try again.");
  return response.json();
}
function avatar(user: Profile) {
  try {
    const url = new URL(user.avatar_url || "");
    return url.protocol === "https:" &&
      url.hostname === "avatars.githubusercontent.com"
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export default function GithubExplorer() {
  const [username, setUsername] = useState(""),
    [repoSearch, setRepoSearch] = useState(""),
    [sort, setSort] = useState("updated"),
    [profile, setProfile] = useState<Profile | null>(null),
    [repos, setRepos] = useState<Repo[]>([]),
    [detail, setDetail] = useState<Repo | null>(null),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [status, setStatus] = useState("Search for a public GitHub profile."),
    [repoStatus, setRepoStatus] = useState("");
  const request = useRef(0),
    repoRequest = useRef(0),
    activeSearch = useRef("");
  useEffect(
    () => () => {
      request.current++;
      repoRequest.current++;
    },
    [],
  );
  async function loadRepos(user: Profile, next: number, search: string) {
    const id = ++repoRequest.current;
    setPage(next);
    setDetail(null);
    setRepos([]);
    setRepoStatus("Loading repositories…");
    try {
      let url: string;
      if (search) {
        const params = new URLSearchParams({
          q: `user:${user.login} ${search} in:name`,
          per_page: "10",
          page: String(next),
          sort: "updated",
          order: "desc",
        });
        url = "https://api.github.com/search/repositories?" + params;
      } else
        url =
          "https://api.github.com/users/" +
          encodeURIComponent(user.login) +
          "/repos?" +
          new URLSearchParams({
            per_page: "10",
            page: String(next),
            sort: "updated",
            direction: "desc",
          });
      const data = (await json(url)) as
        Repo[] | { items?: Repo[]; total_count?: number };
      if (id !== repoRequest.current) return;
      const rows = Array.isArray(data) ? data : data.items || [];
      setRepos(rows.filter((row) => row && typeof row.name === "string"));
      setTotal(
        Array.isArray(data) ? user.public_repos || 0 : data.total_count || 0,
      );
      setRepoStatus(
        rows.length
          ? "Choose a repository for details."
          : "No repositories found.",
      );
    } catch (error) {
      if (id === repoRequest.current) {
        setTotal(0);
        setRepoStatus(
          error instanceof Error
            ? error.message
            : "Could not load repositories.",
        );
      }
    }
  }
  async function searchProfile(event: FormEvent) {
    event.preventDefault();
    const name = username.trim();
    if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(name)) {
      setStatus("Enter a valid GitHub username.");
      return;
    }
    const id = ++request.current;
    repoRequest.current++;
    setProfile(null);
    setRepos([]);
    setDetail(null);
    setRepoStatus("");
    setStatus("Loading profile…");
    try {
      const data = (await json(
        "https://api.github.com/users/" + encodeURIComponent(name),
      )) as Profile;
      if (id !== request.current) return;
      if (!data || typeof data.login !== "string")
        throw Error("Profile data is unavailable.");
      setProfile(data);
      setStatus("Profile loaded.");
      setRepoSearch("");
      activeSearch.current = "";
      void loadRepos(data, 1, "");
    } catch (error) {
      if (id === request.current)
        setStatus(
          error instanceof Error
            ? error.message
            : "Could not connect to GitHub.",
        );
    }
  }
  async function show(repo: Repo) {
    if (!profile) return;
    const id = ++repoRequest.current;
    setDetail(null);
    setRepoStatus("Loading repository details…");
    try {
      const data = (await json(
        "https://api.github.com/repos/" +
          encodeURIComponent(profile.login) +
          "/" +
          encodeURIComponent(repo.name),
      )) as Repo;
      if (id !== repoRequest.current) return;
      setDetail(data);
      setRepoStatus("Repository details loaded.");
    } catch (error) {
      if (id === repoRequest.current)
        setRepoStatus(
          error instanceof Error
            ? error.message
            : "Could not load repository details.",
        );
    }
  }
  const rows =
    sort === "name"
      ? [...repos].sort((a, b) => a.name.localeCompare(b.name))
      : repos;
  const profileUrl =
    "https://github.com/" + encodeURIComponent(profile?.login || "");
  return (
    <LabLayout
      title="GitHub Profile Explorer"
      icon="⌘"
      kicker="PUBLIC APIS · DEVELOPERS"
      description="Explore a public profile, search repositories, and open repository details."
    >
      <div className="lab-layout">
        <div className="api-stack">
          <section className="lab-card">
            <div className="lab-card-body">
              <div className="lab-card-heading">
                <div>
                  <h2>Find a developer</h2>
                  <p>Enter a GitHub username.</p>
                </div>
                <span className="lab-icon" aria-hidden="true">
                  ⌕
                </span>
              </div>
              <form className="lab-form" onSubmit={searchProfile}>
                <div className="lab-field">
                  <label htmlFor="github-username">Username</label>
                  <input
                    id="github-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Try octocat"
                    maxLength={39}
                    required
                  />
                </div>
                <button className="lab-button primary">Find profile</button>
              </form>
              <p
                className="api-status api-subtitle"
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            </div>
          </section>
          {profile && (
            <section className="lab-card">
              <div className="lab-card-body">
                <div className="api-title">
                  {avatar(profile) && (
                    <img className="api-avatar" src={avatar(profile)} alt="" />
                  )}
                  <div>
                    <h2>{profile.name || profile.login}</h2>
                    <p className="api-note">@{profile.login}</p>
                  </div>
                </div>
                <p className="api-note api-subtitle">
                  {profile.bio || "No bio provided."}
                </p>
                <div className="api-detail">
                  {[
                    [
                      "Public repositories",
                      profile.public_repos ?? "Not available",
                    ],
                    ["Followers", profile.followers ?? "Not available"],
                    ["Following", profile.following ?? "Not available"],
                    ["Location", profile.location || "Not provided"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <p className="api-note api-subtitle">
                  <a
                    className="api-source"
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View profile on GitHub ↗
                  </a>
                </p>
              </div>
            </section>
          )}
        </div>
        <div className="api-stack">
          {profile && (
            <>
              <section className="lab-card">
                <div className="lab-card-body">
                  <h2 className="api-section-title">Repositories</h2>
                  <form
                    className="lab-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      activeSearch.current = repoSearch.trim();
                      void loadRepos(profile, 1, activeSearch.current);
                    }}
                  >
                    <div className="lab-field">
                      <label htmlFor="github-repos">
                        Search repository names
                      </label>
                      <input
                        id="github-repos"
                        value={repoSearch}
                        onChange={(e) => setRepoSearch(e.target.value)}
                        placeholder="Search all repositories"
                        maxLength={100}
                      />
                    </div>
                    <button className="lab-button">Search repositories</button>
                  </form>
                  <div className="lab-field api-subtitle">
                    <label htmlFor="github-sort">Sort this page</label>
                    <select
                      id="github-sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="updated">Recently updated</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                  <p
                    className="api-status api-subtitle"
                    role="status"
                    aria-live="polite"
                  >
                    {repoStatus}
                  </p>
                  <div className="api-results">
                    {rows.map((repo) => (
                      <article className="api-result" key={repo.name}>
                        <div>
                          <h3>{repo.name}</h3>
                          <p>
                            {repo.description || "No description provided."}
                          </p>
                          <p>
                            {repo.language || "Language unavailable"} · ★{" "}
                            {repo.stargazers_count ?? 0}
                          </p>
                        </div>
                        <button
                          className="lab-button small"
                          type="button"
                          onClick={() => void show(repo)}
                        >
                          View details
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="api-pager">
                    <button
                      className="lab-button small"
                      type="button"
                      disabled={page <= 1}
                      onClick={() =>
                        void loadRepos(profile, page - 1, activeSearch.current)
                      }
                    >
                      Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                      className="lab-button small"
                      type="button"
                      disabled={page * 10 >= total}
                      onClick={() =>
                        void loadRepos(profile, page + 1, activeSearch.current)
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
              {detail && (
                <section className="lab-card">
                  <div className="lab-card-body">
                    <h2 className="api-section-title">{detail.name}</h2>
                    <p className="api-note">
                      {detail.description || "No description provided."}
                    </p>
                    <div className="api-detail">
                      {[
                        ["Language", detail.language || "Not available"],
                        ["Stars", detail.stargazers_count ?? 0],
                        ["Forks", detail.forks_count ?? 0],
                        [
                          "Default branch",
                          detail.default_branch || "Not available",
                        ],
                        ["Open issues", detail.open_issues_count ?? 0],
                        ["Last updated", detail.updated_at || "Not available"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span>{k}</span>
                          <strong>{v}</strong>
                        </div>
                      ))}
                    </div>
                    <p className="api-note api-subtitle">
                      <a
                        className="api-source"
                        href={
                          profileUrl + "/" + encodeURIComponent(detail.name)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View repository on GitHub ↗
                      </a>
                    </p>
                  </div>
                </section>
              )}
            </>
          )}
          <p className="api-note">
            Public data from{" "}
            <a
              className="api-source"
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub REST API ↗
            </a>
            . Unauthenticated requests are limited.
          </p>
        </div>
      </div>
    </LabLayout>
  );
}
