import { createRoot } from "react-dom/client";
import { BrainrotBattle } from "@/components/game/brainrot-battle";

/** Entry point for the single-file standalone build (see build-standalone.mjs). */
const el = document.getElementById("root");
if (el) createRoot(el).render(<BrainrotBattle />);
