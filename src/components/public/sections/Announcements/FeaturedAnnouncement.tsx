"use client"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons/public/section.icons"
import { AnnouncementCardData, AnnouncementMedia } from "./Announcement-extended.types"
import { motion, Variants } from "framer-motion"
import MediaBlock from "./MediaBlock"


const RATIO_CLASS: Record<NonNullable<AnnouncementMedia["ratio"]>, string> = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "4/4": "aspect-square",
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
}


const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const listItem: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

const slideIn = (direction: "left" | "right"): Variants => ({
    hidden: { opacity: 0, x: direction === "right" ? 48 : -48, scale: 0.96 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
})

function PulseBadge({ label }: { label: string }) {
    return (
        <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full
                 border border-red-400/25 bg-red-500/8 px-3 py-1.5"
        >
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-red-500">
                {label}
            </span>
        </motion.div>
    )
}

/** Featured notice — full-width hero layout */
export default function FeaturedAnnouncements({ data }: { data: AnnouncementCardData }) {
    const {
        headerAlert,
        header,
        title,
        content,
        secondaryButton,
        media,
    } = data

    const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]


    return (
        <div className="grid h-full w-full grid-cols-1 items-center gap-[clamp(24px,4vw,48px)] lg:grid-cols-[1fr_1fr]">
            {/* Text column */}
            <motion.div
                className="flex flex-col"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0 } } }}
            >
                {headerAlert?.enabled && (
                    <PulseBadge label={headerAlert.label ?? "Aviso Importante"} />
                )}
                <motion.p
                    variants={fadeUp}
                    className="mb-3 font-sans text-[clamp(11px,1vw,13px)] font-bold uppercase tracking-[0.07em] text-primary"
                >
                    {header}
                </motion.p>
                <motion.h2
                    variants={fadeUp}
                    className="mb-4 font-[Syne,sans-serif] text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.1] tracking-tight text-[#0d1117]"
                >
                    {title}
                </motion.h2>
                <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    className="mb-5 block h-[3px] w-9 origin-left rounded-full bg-red-500"
                />
                {content.type === "text" && content.text && (
                    <motion.p
                        variants={fadeUp}
                        className="mb-6 text-[clamp(15px,1.2vw,17px)] font-light leading-relaxed text-fg-muted"
                    >
                        {content.text}
                    </motion.p>
                )}
                {content.type === "list" && content.items && content.items.length > 0 && (
                    <motion.ul variants={stagger} initial="hidden" animate="show" className="mb-6 flex flex-col gap-2.5" >
                        {content.items.map((item, i) => (
                            <motion.li
                                key={i}
                                variants={listItem}
                                className="flex items-center gap-2.5 text-[clamp(14px,1.1vw,16px)] text-[#0d1117]"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <IconByName name="Check" />
                                </span>
                                {item}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
                <motion.div className="flex flex-wrap items-center gap-3">
                    <Link href={`/Announcements/${data.id}`}>
                        <motion.button
                            whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(13,17,23,0.22)" }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-md
                                       bg-primary px-6 py-3.5 font-sans text-[15px] font-medium
                                       text-white transition-colors hover:bg-primary-hover"
                        >
                            Leer más
                            <IconByName name="rightArrowLink" />
                        </motion.button>
                    </Link>
                    {secondaryButton?.enabled && (
                        <Link href={secondaryButton.href} className="inline-flex items-center gap-1.5 border-b border-transparent
                         pb-0.5 font-sans text-sm text-fg-muted transition-colors
                         hover:border-[#0d1117] hover:text-[#0d1117]"
                        >
                            {secondaryButton.label}
                            <IconByName name="rightArrowLink" />
                        </Link>
                    )}
                </motion.div>
            </motion.div>

            {/* Media column */}
            <motion.div className="flex items-center justify-center" initial="hidden" animate="show" variants={slideIn("right")}>
                <div className={`relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] lg:w-4/5 ${ratioClass}`}>
                    <MediaBlock media={media} />
                </div>
            </motion.div>
        </div>
    )
}