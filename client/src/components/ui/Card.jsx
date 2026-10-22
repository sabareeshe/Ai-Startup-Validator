// ============================================================
// components/ui/Card.jsx — Glassmorphism Card Component
// ============================================================

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  animate = true,
  delay = 0,
  ...props
}) {
  const Component = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay },
      }
    : {};

  return (
    <Component
      className={`glass-card p-6 ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
      {...animProps}
      {...props}
    >
      {children}
    </Component>
  );
}
