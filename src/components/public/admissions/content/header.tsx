
import { motion } from "framer-motion";

interface Props {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

export default function Header({ icon, title, description }: Props) {
    return (
        <header>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex"
            >
                {icon && (
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-soft rounded-full m-0 mb-4">
                        {icon}
                    </div>
                )}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold text-foreground mb-2 font-merriweather">
                        {title}
                    </h2>
                    <p className="text-fg-muted max-w-2xl">
                        {description}
                    </p>
                </div>
            </motion.div>
        </header>
    );
}
