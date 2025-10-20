import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Enhanced 2D Anime Student Character with Dynamic Effects
export default function Character3D({ isTyping, headFlying, isUserTyping }) {
    const [blink, setBlink] = useState(false)

    // Random blinking effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true)
            setTimeout(() => setBlink(false), 150)
        }, 3000 + Math.random() * 2000)
        return () => clearInterval(blinkInterval)
    }, [])

    return (
        <div className="w-full h-full flex items-end justify-center relative">
            {/* Animated 2D Character */}
            <motion.div
                animate={{
                    y: isTyping ? [0, -15, 0] : [0, -8, 0],
                    rotate: isTyping ? [0, -2, 2, -2, 0] : 0,
                }}
                transition={{
                    duration: isTyping ? 1.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative w-full h-full flex items-end justify-center pb-4"
                style={{ perspective: '1000px' }}
            >
                <div className="h-[90%] w-auto relative">
                    <motion.svg
                        viewBox="0 0 200 320"
                        className="h-full w-auto drop-shadow-2xl absolute inset-0"
                        animate={{
                            filter: isTyping
                                ? [
                                    "drop-shadow(0 0 30px rgba(57, 197, 187, 1)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.6))",
                                    "drop-shadow(0 0 50px rgba(236, 72, 153, 1)) drop-shadow(0 0 80px rgba(57, 197, 187, 0.6))",
                                    "drop-shadow(0 0 30px rgba(57, 197, 187, 1)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.6))"
                                ]
                                : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))"
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: isTyping ? Infinity : 0,
                        }}
                    >
                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="skirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#1e3a8a" />
                            </linearGradient>
                            <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#f0f0f0" />
                            </linearGradient>
                            <linearGradient id="collarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1e3a8a" />
                            </linearGradient>
                            <radialGradient id="ribbonGradient">
                                <stop offset="0%" stopColor="#ff6b6b" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </radialGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Body - School Uniform - Wrapped in foreignObject for 3D rotation */}
                        <foreignObject x="0" y="120" width="200" height="200">
                            <motion.div
                                xmlns="http://www.w3.org/1999/xhtml"
                                animate={isTyping ? {
                                    rotateY: [0, 15, -15, 0],
                                    scale: [1, 1.05, 1]
                                } : {
                                    rotateY: [0, 5, -5, 0],
                                    scale: 1
                                }}
                                transition={isTyping ? {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } : {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: 'center top',
                                    height: '100%',
                                    width: '100%'
                                }}
                            >
                                <svg viewBox="0 0 200 200" width="200" height="200" style={{ overflow: 'visible' }}>
                                    <g>
                                        {/* Skirt with gradient and pleats */}
                                        <path d="M 70 60 L 60 110 L 60 130 L 80 130 L 80 110 L 75 60 Z" fill="url(#skirtGradient)" stroke="#1e40af" strokeWidth="1" />
                                        <path d="M 125 60 L 130 110 L 130 130 L 110 130 L 110 110 L 120 60 Z" fill="url(#skirtGradient)" stroke="#1e40af" strokeWidth="1" />
                                        <rect x="75" y="55" width="50" height="25" fill="url(#skirtGradient)" rx="3" stroke="#1e40af" strokeWidth="1" />

                                        {/* Skirt pleats detail */}
                                        <line x1="85" y1="60" x2="82" y2="130" stroke="#1e40af" strokeWidth="1" opacity="0.5" />
                                        <line x1="95" y1="60" x2="95" y2="130" stroke="#1e40af" strokeWidth="1" opacity="0.5" />
                                        <line x1="105" y1="60" x2="108" y2="130" stroke="#1e40af" strokeWidth="1" opacity="0.5" />

                                        {/* Legs with shading */}
                                        <rect x="62" y="130" width="16" height="50" fill="#ffd4a3" rx="8" />
                                        <rect x="64" y="130" width="4" height="50" fill="#ffb380" rx="2" opacity="0.3" />
                                        <rect x="112" y="130" width="16" height="50" fill="#ffd4a3" rx="8" />
                                        <rect x="114" y="130" width="4" height="50" fill="#ffb380" rx="2" opacity="0.3" />

                                        {/* Shoes with shine */}
                                        <ellipse cx="70" cy="185" rx="12" ry="8" fill="#8b4513" />
                                        <ellipse cx="70" cy="183" rx="8" ry="4" fill="#a0522d" opacity="0.6" />
                                        <ellipse cx="120" cy="185" rx="12" ry="8" fill="#8b4513" />
                                        <ellipse cx="120" cy="183" rx="8" ry="4" fill="#a0522d" opacity="0.6" />

                                        {/* Sailor Uniform Top with gradient */}
                                        <path d="M 70 0 L 60 20 L 60 60 L 130 60 L 130 20 L 120 0 Z" fill="url(#shirtGradient)" stroke="#e0e0e0" strokeWidth="1" />

                                        {/* Sailor Collar with gradient */}
                                        <path d="M 70 0 L 50 30 L 70 40 Z" fill="url(#collarGradient)" stroke="#1e40af" strokeWidth="1" />
                                        <path d="M 120 0 L 140 30 L 120 40 Z" fill="url(#collarGradient)" stroke="#1e40af" strokeWidth="1" />
                                        <path d="M 70 0 L 95 10 L 120 0 L 120 40 L 70 40 Z" fill="url(#collarGradient)" stroke="#1e40af" strokeWidth="1" />

                                        {/* Collar stripes */}
                                        <line x1="75" y1="35" x2="65" y2="35" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                                        <line x1="125" y1="35" x2="115" y2="35" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

                                        {/* Ribbon with gradient and animation */}
                                        <polygon points="95,25 85,35 95,40 105,35" fill="url(#ribbonGradient)" filter="url(#glow)" />
                                        <circle cx="95" cy="30" r="5" fill="url(#ribbonGradient)" filter="url(#glow)" />
                                        <circle cx="95" cy="29" r="2" fill="#ff9999" opacity="0.8" />

                                        {/* Arms with shading */}
                                        <g>
                                            <rect x="45" y="20" width="15" height="50" fill="url(#shirtGradient)" rx="7" stroke="#e0e0e0" strokeWidth="1" />
                                            <rect x="47" y="20" width="4" height="50" fill="#ffffff" rx="2" opacity="0.5" />
                                            <circle cx="52" cy="75" r="10" fill="#ffd4a3" />
                                            <circle cx="54" cy="73" r="6" fill="#ffb380" opacity="0.3" />
                                        </g>

                                        <g>
                                            <rect x="130" y="20" width="15" height="50" fill="url(#shirtGradient)" rx="7" stroke="#e0e0e0" strokeWidth="1" />
                                            <rect x="139" y="20" width="4" height="50" fill="#ffffff" rx="2" opacity="0.5" />
                                            <circle cx="138" cy="75" r="10" fill="#ffd4a3" />
                                            <circle cx="136" cy="73" r="6" fill="#ffb380" opacity="0.3" />
                                        </g>
                                    </g>
                                </svg>
                            </motion.div>
                        </foreignObject>

                        {/* Neck with shading */}
                        <rect x="85" y="100" width="20" height="20" fill="#ffd4a3" />
                        <rect x="87" y="100" width="6" height="20" fill="#ffb380" opacity="0.2" />

                        {/* Head with anime face image - SUPER FAST SHAKE when thinking, LOOK DOWN when user typing */}
                        <motion.g
                            animate={{
                                opacity: headFlying ? 0 : 1,
                                scale: headFlying ? 0 : 1,
                                // When user is typing, look down at input. When bot is thinking, shake head
                                rotate: isUserTyping ? 15 : (isTyping ? [0, -8, 8, -8, 8, -8, 8, -5, 5, -3, 3, 0] : 0),
                                x: isTyping ? [0, -2, 2, -2, 2, -2, 2, -1, 1, 0] : 0,
                                y: isUserTyping ? 8 : 0
                            }}
                            transition={{
                                rotate: {
                                    duration: isUserTyping ? 0.5 : 0.4,
                                    repeat: isTyping && !isUserTyping ? Infinity : 0,
                                    ease: isUserTyping ? "easeOut" : "linear",
                                    repeatDelay: 0.1
                                },
                                x: {
                                    duration: 0.4,
                                    repeat: isTyping && !isUserTyping ? Infinity : 0,
                                    ease: "linear",
                                    repeatDelay: 0.1
                                },
                                y: {
                                    duration: 0.5,
                                    ease: "easeOut"
                                },
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.3 }
                            }}
                        >
                            <defs>
                                <clipPath id="headClip">
                                    <circle cx="95" cy="65" r="40" />
                                </clipPath>
                                <radialGradient id="headGlow">
                                    <stop offset="0%" stopColor="#ffe4c4" />
                                    <stop offset="100%" stopColor="#ffd4a3" />
                                </radialGradient>
                            </defs>

                            {/* Head base with gradient */}
                            <circle cx="95" cy="65" r="40" fill="url(#headGlow)" stroke="#ffb380" strokeWidth="2" />

                            {/* Face image */}
                            <image
                                href="https://png.pngtree.com/png-clipart/20220705/ourmid/pngtree-anime-character-face-happy-smile-expression-png-image_5687460.png"
                                x="55"
                                y="25"
                                width="80"
                                height="80"
                                clipPath="url(#headClip)"
                                preserveAspectRatio="xMidYMid slice"
                            />

                            {/* Blinking overlay */}
                            {blink && (
                                <g>
                                    <rect x="70" y="55" width="12" height="3" fill="#ffd4a3" rx="1" />
                                    <rect x="108" y="55" width="12" height="3" fill="#ffd4a3" rx="1" />
                                </g>
                            )}

                            {/* Hair with detailed strands */}
                            <g opacity="0.4">
                                <ellipse cx="95" cy="40" rx="42" ry="25" fill="#2d1810" />
                                <path d="M 53 55 Q 45 65 50 80 L 55 65 Z" fill="#2d1810" />
                                <path d="M 137 55 Q 145 65 140 80 L 135 65 Z" fill="#2d1810" />

                                {/* Hair strands */}
                                <path d="M 70 30 Q 65 35 68 45" stroke="#1a0f08" strokeWidth="2" fill="none" opacity="0.6" />
                                <path d="M 85 28 Q 83 35 85 45" stroke="#1a0f08" strokeWidth="2" fill="none" opacity="0.6" />
                                <path d="M 105 28 Q 107 35 105 45" stroke="#1a0f08" strokeWidth="2" fill="none" opacity="0.6" />
                                <path d="M 120 30 Q 125 35 122 45" stroke="#1a0f08" strokeWidth="2" fill="none" opacity="0.6" />
                            </g>

                            {/* Cheek blush */}
                            <ellipse cx="70" cy="75" rx="8" ry="6" fill="#ff9999" opacity="0.4" />
                            <ellipse cx="120" cy="75" rx="8" ry="6" fill="#ff9999" opacity="0.4" />

                            {/* Face highlight */}
                            <ellipse cx="85" cy="55" rx="15" ry="20" fill="#ffffff" opacity="0.2" />
                        </motion.g>

                        {/* Energy aura when typing */}
                        {isTyping && (
                            <motion.g
                                animate={{
                                    opacity: [0.3, 0.7, 0.3],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <circle cx="95" cy="160" r="80" fill="none" stroke="url(#collarGradient)" strokeWidth="3" opacity="0.5" />
                                <circle cx="95" cy="160" r="90" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.3" />
                            </motion.g>
                        )}
                    </motion.svg>
                </div>
            </motion.div>

            {/* Enhanced glow effects behind character */}
            <motion.div
                animate={{
                    scale: isTyping ? [1, 1.3, 1] : [1, 1.15, 1],
                    opacity: isTyping ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: isTyping ? 1.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-0 w-3/4 h-1/3 bg-gradient-to-t from-cyan-500/50 via-pink-500/40 to-transparent blur-3xl -z-10"
            />

            {/* Secondary glow layer */}
            <motion.div
                animate={{
                    scale: isTyping ? [1.2, 1, 1.2] : [1.1, 1, 1.1],
                    opacity: isTyping ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: isTyping ? 2 : 4,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-0 w-2/3 h-1/4 bg-gradient-to-t from-purple-500/40 via-blue-500/30 to-transparent blur-2xl -z-10"
            />

            {/* Floating sparkles around character */}
            {isTyping && [...Array(6)].map((_, i) => (
                <motion.div
                    key={`sparkle-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: [0, Math.cos(i * 60) * 60],
                        y: [0, Math.sin(i * 60) * 60],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                    }}
                    className="absolute left-1/2 bottom-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(57, 197, 187, 0.8)' }}
                />
            ))}
        </div>
    )
}
