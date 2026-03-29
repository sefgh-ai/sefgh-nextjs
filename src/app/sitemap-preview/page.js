"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Link as LinkIcon, Loader2, RefreshCw } from "lucide-react";
import AppFooter from "@/components/ui/app-footer";

export const metadata = {
  title: "Sitemap Preview | SEFGH",
  description: "Preview URLs from sitemap.xml before shipping navigation changes.",
};

export default function SitemapPreviewPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/sitemap.xml");
        if (!res.ok) {
          throw new Error(`Failed to fetch sitemap (status ${res.status})`);
        }
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const locNodes = Array.from(xml.getElementsByTagName("loc"));
        const extracted = locNodes
          .map((node) => node.textContent?.trim())
          .filter(Boolean);
        if (!cancelled) {
          setUrls(extracted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to parse sitemap");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const domain = useMemo(() => {
    if (!urls.length) return "";
    try {
      const url = new URL(urls[0]);
      return url.origin;
    } catch (e) {
      return "";
    }
  }, [urls]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200 text-sm font-medium">
            <LinkIcon className="w-4 h-4" />
            Sitemap preview
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Your indexed pages</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Quick view of sitemap entries detected in <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">/sitemap.xml</code>. Useful before shipping navigation changes.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-blue-900/20 space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="w-5 h-5 animate-spin text-blue-300" />
              Loading sitemap...
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 text-amber-200 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-semibold">Could not load sitemap</div>
                <p className="text-sm text-amber-100/80">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>
                  Found <span className="font-semibold text-white">{urls.length}</span> entries
                  {domain ? ` for ${domain}` : ""}.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    setUrls([]);
                    // re-run effect
                    fetch("/sitemap.xml")
                      .then((res) => {
                        if (!res.ok) throw new Error(`Failed to fetch sitemap (status ${res.status})`);
                        return res.text();
                      })
                      .then((text) => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(text, "application/xml");
                        const locNodes = Array.from(xml.getElementsByTagName("loc"));
                        const extracted = locNodes
                          .map((node) => node.textContent?.trim())
                          .filter(Boolean);
                        setUrls(extracted);
                      })
                      .catch((err) => setError(err.message || "Unable to parse sitemap"))
                      .finally(() => setLoading(false));
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-200"
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/40">
                {urls.map((url) => (
                  <div key={url} className="px-4 py-3 text-sm text-slate-200 flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <a
                      href={url}
                      className="hover:text-blue-200 break-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url}
                    </a>
                  </div>
                ))}
                {!urls.length && (
                  <div className="px-4 py-6 text-center text-slate-400">No entries found in sitemap.</div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
      <AppFooter />
    </main>
  );
}
