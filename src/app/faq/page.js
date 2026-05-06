import FAQClient from "./faq-client";

export const metadata = {
  title: "FAQ | SEFGH",
  description: "Frequently asked questions about SEFGH.",
  alternates: { canonical: "https://sefgh.org/faq" },
};

export default function FAQPage() {
  return <FAQClient />;
}
