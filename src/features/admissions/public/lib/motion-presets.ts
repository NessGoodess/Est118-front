export const admissionsEase = [0.16, 1, 0.3, 1] as const;

export const admissionsFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: admissionsEase },
  },
};

export const admissionsStaggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};
