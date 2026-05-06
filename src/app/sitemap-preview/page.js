import SitemapPreviewClient from "./sitemap-preview-client";

export const metadata = {
  title: "Sitemap Preview | SEFGH",
  description: "Preview URLs from sitemap.xml before shipping navigation changes.",
};

export default function SitemapPreviewPage() {
  return <SitemapPreviewClient />;
}
