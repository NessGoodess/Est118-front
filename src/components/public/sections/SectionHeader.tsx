"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
    text: string;
    title: string;
    description: string;
}

export default function SectionHeader({ text, title, description }: SectionHeaderProps) {
    return (
        <section
            className="relative px-[clamp(20px,6vw,80px)] pt-[clamp(24px,5vw,48px)]
                   pb-[clamp(16px,4vw,32px)] mb-5 md:mb-10"
        >
            <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-brand-700/70" />
            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="font-sans text-[11px] font-bold uppercase tracking-[0.07em] text-foreground">
                        {text}
                    </p>
                    <h1 className="mt-1 font-[Syne,sans-serif] text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <span className="mt-3 block h-[3px] w-12 rounded-full bg-danger" />
                    <p className="mt-4 max-w-2xl text-[clamp(14px,1.2vw,16px)] font-light text-foreground">
                        {description}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}