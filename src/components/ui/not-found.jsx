'use client';

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotFound({
  errorCode = "404",
  title = "Look like you're lost",
  description = "The page you are looking for is not available!",
  links = [],
  onBackClick,
  onHomeClick,
  backButtonText = "Go back",
  homeButtonText = "Go to Home",
  showBackground = true,
  className,
  children,
}) {
  return (
    <main
      className={cn(
        "min-h-screen w-full flex items-center justify-center py-16 px-4 bg-background",
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            {/* 404 Animated Hero Section */}
            <div
              className="relative h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain overflow-hidden"
              style={{
                backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
              }}
              aria-hidden="true"
            >
              <h1 className="text-center text-foreground text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-bold relative z-10">
                {errorCode}
              </h1>
            </div>

            {/* Content Section */}
            <div className="mt-[-50px]">
              <h3 className="text-2xl text-foreground sm:text-3xl font-bold mb-4">
                {title}
              </h3>
              <p className="mb-6 text-muted-foreground sm:mb-5">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row justify-center items-center my-5">
                <Button
                  variant="outline"
                  onClick={onBackClick}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backButtonText}
                </Button>
                <Button
                  variant="default"
                  onClick={onHomeClick}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {homeButtonText}
                </Button>
              </div>
            </div>

            {/* Helpful Links Section */}
            {links.length > 0 && (
              <div className="mt-12 flex flex-col gap-3 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Helpful Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.title}
                      className="group relative p-4 border border-border rounded-xl hover:border-green-500 transition-all hover:shadow-lg bg-card"
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                          <link.icon className="size-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-semibold text-foreground flex items-center justify-center gap-2">
                            {link.title}
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {link.subtitle}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
