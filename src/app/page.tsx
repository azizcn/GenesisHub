"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import OnboardingView from "./components/OnboardingView";
import LearningHub from "./components/LearningHub";
import IdeaAgentView from "./components/IdeaAgentView";
import Footer from "./components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

function AppContent() {
  const { currentView } = useApp();

  return (
    <main className="relative min-h-screen">
      {/* Subtle noise overlay for texture */}
      <div className="noise-overlay" />

      <Navbar />

      <div className="pt-16">
        <AnimatePresence mode="wait">
          {currentView === "onboarding" && (
            <motion.div key="onboarding" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <OnboardingView />
            </motion.div>
          )}

          {currentView === "hub" && (
            <motion.div key="hub" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <LearningHub />
            </motion.div>
          )}

          {currentView === "idea-agent" && (
            <motion.div key="idea-agent" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <IdeaAgentView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
