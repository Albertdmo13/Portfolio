import { motion, AnimatePresence } from "framer-motion";
import GameCard from "./GameCard";
import { SOFT_SKILL_CARD, gameCards } from "../constants";

export default function TooltipCard({ hoveredSkill, mousePos, pxSize }) {
  if (!hoveredSkill) return null;

  const cardWidth = 100 * pxSize;
  const cardHeight = 140 * pxSize;
  const offset = 5 * pxSize;

  let left = mousePos.x + offset;
  let top = mousePos.y + offset;

  if (top + cardHeight > window.innerHeight) {
    top = mousePos.y - cardHeight - offset;
  }
  if (left + cardWidth > window.innerWidth) {
    left = window.innerWidth - cardWidth - offset;
  }

  const isSoft = hoveredSkill.category === "Soft";
  const sprite = isSoft ? SOFT_SKILL_CARD : gameCards[hoveredSkill.mastery];

  return (
    <AnimatePresence>
      {hoveredSkill && (
        <motion.div
          key="tooltip-card"
          initial={{ opacity: 0, scale: 0.9, filter: "brightness(3)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: ["brightness(2)", "brightness(1.2)", "brightness(1)"],
          }}
          exit={{ opacity: 0, scale: 0.9, filter: "brightness(1)" }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
            filter: { duration: 0.35, ease: "easeOut" },
          }}
          style={{
            position: "fixed",
            left: `${left}px`,
            top: `${top}px`,
            pointerEvents: "none",
            zIndex: 999999,
          }}
        >
          <GameCard
            pixelSize={pxSize}
            image={hoveredSkill.cardBackground}
            title={hoveredSkill.name}
            item={hoveredSkill.color_icon_url}
            category={hoveredSkill.category}
            cardSprite={sprite}
            description={hoveredSkill.description}
            isSoft={isSoft}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
