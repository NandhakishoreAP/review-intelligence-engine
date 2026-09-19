"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  /** Plain text — revealed word by word */
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** Seconds between each word */
  stagger?: number;
  once?: boolean;
  highlightWord?: string;
}

export function TextReveal({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  stagger = 0.05,
  once = true,
  highlightWord = "signal.",
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return <Tag className={cn(className)}>{text}</Tag>;
  }

  return (
    <Tag data-slot="text-reveal" className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "0px 0px -10% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => {
          const isHighlight =
            highlightWord &&
            word.toLowerCase().replace(/[^a-z]/g, "") ===
              highlightWord.toLowerCase().replace(/[^a-z]/g, "");

          return (
            <motion.span
              key={`${word}-${i}`}
              className={cn(
                "inline-block will-change-transform",
                isHighlight && "text-[var(--brand-from)] font-bold"
              )}
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
                },
              }}
            >
              {isHighlight ? (
                <span className="text-[var(--brand-from)] font-bold">{word}</span>
              ) : (
                word
              )}
              {i < words.length - 1 && " "}
            </motion.span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
