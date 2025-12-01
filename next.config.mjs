import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false, // Disabled - causing 50s+ compile times

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Speed up compilation (modularizeImports for tree-shaking)
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Experimental: Use turbo for faster builds
  experimental: {
    turbo: {
      root: __dirname,
    },
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Optimize build output
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "lucide-react",
      "@radix-ui/react-icons",
      "sonner",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "framer-motion",
    ],
  },
};

export default nextConfig;
