import { motion } from "framer-motion";
import pharaohsImage from "@/assets/pharaohs.png";

function PharaohStatue({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <motion.div
      initial={{ x: isLeft ? -80 : 80, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 14 }}
      className="relative"
    >
      {/* Float */}
      <motion.div
        animate={{ y: [0, -14, 0], rotateZ: [0, isLeft ? -1.5 : 1.5, 0] }}
        transition={{ duration: isLeft ? 4.2 : 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow wrapper */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 35px hsl(var(--${isLeft ? "primary" : "accent"}) / 0.18)`,
              `0 0 80px hsl(var(--${isLeft ? "primary" : "accent"}) / 0.30)`,
              `0 0 35px hsl(var(--${isLeft ? "primary" : "accent"}) / 0.18)`,
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Crop one side from the combined image */}
          <div className="w-36 h-44 md:w-56 md:h-64 overflow-hidden">
            <img
              src={pharaohsImage}
              alt={isLeft ? "Golden pharaoh mask" : "Blue Egyptian queen bust"}
              className={
                "w-full h-full object-cover " + (isLeft ? "object-left" : "object-right")
              }
              loading="eager"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Base glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.35, 0.8, 0.35], scaleX: [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        className={
          "absolute -bottom-5 left-1/2 -translate-x-1/2 w-44 h-4 bg-gradient-to-r from-transparent " +
          (isLeft ? "via-primary" : "via-accent") +
          " to-transparent blur-md"
        }
      />

      {/* Sparkle */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-12, -34] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: isLeft ? 0.4 : 0.9 }}
        className={
          "absolute top-6 " +
          (isLeft ? "right-6 bg-primary" : "left-6 bg-accent") +
          " w-2 h-2 rounded-full"
        }
      />
    </motion.div>
  );
}

export function PharaohStatues({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 flex justify-center items-center gap-4 md:gap-16 mb-8"
    >
      <PharaohStatue side="left" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="hidden md:block"
      >
        <motion.p
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-muted-foreground text-sm tracking-widest"
        >
          {label}
        </motion.p>
      </motion.div>

      <PharaohStatue side="right" />
    </motion.div>
  );
}
