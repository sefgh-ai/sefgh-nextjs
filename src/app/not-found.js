'use client';

import { NotFound } from "@/components/ui/not-found";
import {
  Book,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const demoLinks = [
  {
    title: "Documentation",
    subtitle: "Dive in to learn all about our project",
    icon: BookOpen,
    href: "/about",
  },
  {
    title: "Our blog",
    subtitle: "Read the latest post on our blog",
    icon: Book,
    href: "/trending",
  },
  {
    title: "Chat to us",
    subtitle: "Can't find what you're looking for?",
    icon: MessageCircle,
    href: "/chat",
  },
];

export default function NotFoundPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleHomeClick = () => {
    router.push("/home");
  };

  return (
    <NotFound
      links={demoLinks}
      onBackClick={handleBackClick}
      onHomeClick={handleHomeClick}
    />
  );
}
