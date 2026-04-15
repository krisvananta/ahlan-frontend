"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Users, Pen, Sparkles } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "Amplifying Muslim voices from every corner of the world — from Jakarta to London, Cairo to Toronto.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Built by the community, for the community. Every issue is shaped by reader feedback and contributor passion.",
  },
  {
    icon: Pen,
    title: "Creative Freedom",
    description:
      "Our Fan-Writer program lets you design your own article pages — your story, your aesthetic, your voice.",
  },
  {
    icon: Sparkles,
    title: "Quality & Excellence",
    description:
      "We hold every piece to the highest editorial standard, blending timeless Islamic values with modern storytelling.",
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-cream py-[var(--spacing-section)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-accent-dark">
              Our Story
            </span>
            <h2 className="font-heading text-3xl font-bold text-heading sm:text-4xl lg:text-5xl">
              About{" "}
              <span className="text-primary">Ahlan</span>
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-body sm:text-base">
              <p>
                <strong className="text-heading">Ahlan</strong> (أهلاً) — Arabic
                for &ldquo;welcome&rdquo; — was born from a simple belief: that
                the Muslim world&apos;s stories of creativity, innovation, and
                faith deserve a platform as beautiful as the content itself.
              </p>
              <p>
                We&apos;re more than a magazine. We&apos;re a movement of
                writers, designers, and thinkers who believe that Islamic culture
                should be represented with the premium quality and modern
                sensibility it deserves.
              </p>
              <p>
                From our <strong className="text-heading">Fan-Writer Design Engine</strong>{" "}
                — where every contributor can customize their article&apos;s
                look and feel — to our curated digital magazine issues, every
                pixel is crafted with intention.
              </p>
            </div>

            {/* Decorative calligraphy */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3">
              <span className="font-heading text-2xl text-accent">بسم الله</span>
              <span className="text-xs text-muted">In the name of God</span>
            </div>
          </motion.div>

          {/* Right — Values Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="group rounded-xl border border-cream-dark bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-accent/30 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <value.icon size={20} />
                </div>
                <h3 className="font-heading text-base font-bold text-heading">
                  {value.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
