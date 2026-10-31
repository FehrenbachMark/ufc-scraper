'use client';

import { motion } from 'motion/react';

/** A list row that fades up into view, staggered by `index`. */
export function Reveal({ index = 0, className, children }) {
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 10) * 0.05 }}
    >
      {children}
    </motion.li>
  );
}
