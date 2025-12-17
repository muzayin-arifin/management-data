"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cinzel } from "next/font/google"

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] })

export function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3500) // Show for 3.5 seconds
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
        >
            <div className="relative">
                <motion.h1 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`${cinzel.className} text-4xl md:text-7xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 drop-shadow-2xl`}
                >
                    MUZAYIN ARIFIN
                </motion.h1>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 blur-sm" />
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
