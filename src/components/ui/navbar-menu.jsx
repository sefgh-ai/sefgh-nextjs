"use client"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white/90 hover:text-white text-sm font-medium transition-smooth"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-slate-900/95 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-soft-lg"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-lg border border-white/10 bg-slate-900/80 backdrop-blur-lg shadow-soft hover:shadow-soft-lg flex justify-center space-x-6 px-6 py-2.5 transition-smooth"
    >
      {children}
    </nav>
  )
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <Link href={href} className="flex space-x-2 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-lg shadow-premium transition-smooth group-hover:shadow-premium-lg"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white group-hover:text-blue-400 transition-smooth">
          {title}
        </h4>
        <p className="text-slate-400 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  )
}

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <Link
      {...rest}
      className="text-slate-300 hover:text-white transition-smooth block py-2"
    >
      {children}
    </Link>
  )
}
