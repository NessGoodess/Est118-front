import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { getPrivateImageUrl } from "@/lib/api";
import { DailyAttendanceStudent } from "@/features/general-attendance/types/general-attendance";


interface LazyStudentPhotoProps {
    student: DailyAttendanceStudent;
}

export default function LazyStudentPhoto({ student }: LazyStudentPhotoProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "120px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="relative aspect-5/6 w-12 flex-shrink-0">
            {visible && student.photo_url ? (
                <Image
                    className="rounded-lg object-cover"
                    src={getPrivateImageUrl(student.photo_url)}
                    alt={student.name}
                    fill
                    sizes="48px"
                    unoptimized
                    loading="lazy"
                />
            ) : (
                <div className="h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                        {student.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}