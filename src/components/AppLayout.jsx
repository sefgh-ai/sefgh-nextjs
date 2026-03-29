"use client";

// Minimal layout wrapper to prevent import errors; extend as needed
export default function AppLayout({ children }) {
	return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
