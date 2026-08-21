"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    number: "01",
    group: "FEATURED PRODUCT",
    category: "AI PLATFORM / MODEL OPS",
    title: "LLM Fine-Tuning Platform",
    description:
      "A focused workspace for preparing datasets, running fine-tuning jobs, comparing evaluations, and managing custom language-model releases.",
    technique: "FINE-TUNING PIPELINE",
    outcome: "DATASET TO DEPLOYMENT",
    tags: ["LLMS", "FINE-TUNING", "RUNPOD", "HUGGING FACE", "PYTHON"],
  },
  {
    number: "02",
    group: "FEATURED PRODUCT",
    category: "PRODUCTIVITY / TEAM SYSTEM",
    title: "TaskFlow Collaborative Workspace",
    description:
      "A task-management workspace with real-time team chat, shared project boards, status tracking, and focused collaboration.",
    technique: "REAL-TIME COLLABORATION",
    outcome: "ONE SHARED WORKSPACE",
    tags: ["REACT NATIVE", "NODE.JS", "EXPRESS", "FIREBASE", "REAL-TIME CHAT"],
  },
  {
    number: "03",
    group: "FEATURED PRODUCT",
    category: "AI AGENT / RAG SYSTEM",
    title: "AI Customer Support Agent with RAG",
    description:
      "A support agent that retrieves grounded answers from company knowledge, keeps conversation context, and routes difficult cases.",
    technique: "RETRIEVAL-AUGMENTED GENERATION",
    outcome: "GROUNDED SUPPORT ANSWERS",
    tags: ["AI AGENTS", "RAG", "LLMS", "VECTOR SEARCH", "NODE.JS"],
  },
  {
    number: "04",
    group: "NEURAL NETWORK LAB",
    category: "EVOLUTIONARY COMPUTING",
    title: "Genetic Text Evolver",
    description:
      "An interactive experiment that evolves a random population toward a target phrase while exposing every generation and fitness score.",
    technique: "GENETIC ALGORITHM",
    outcome: "SELECTION / CROSSOVER / MUTATION",
    tags: ["GENETIC ALGORITHMS", "JAVASCRIPT", "LIVE FITNESS"],
  },
  {
    number: "05",
    group: "NEURAL NETWORK LAB",
    category: "REINFORCEMENT LEARNING",
    title: "Neural Maze Brain",
    description:
      "A learning agent that discovers routes through a maze using experience replay and a visible decision policy.",
    technique: "DEEP Q-NETWORK",
    outcome: "REPLAY MEMORY / POLICY VIEW",
    tags: ["DEEP Q-NETWORK", "REINFORCEMENT LEARNING", "REPLAY MEMORY"],
  },
  {
    number: "06",
    group: "NEURAL NETWORK LAB",
    category: "AUTONOMOUS SYSTEMS",
    title: "Neural Car Driving Simulator",
    description:
      "A driving simulation where sensor-driven neural controllers improve across evolving populations of vehicles.",
    technique: "NEUROEVOLUTION",
    outcome: "SENSORS / EVOLVING CONTROLLERS",
    tags: ["NEUROEVOLUTION", "NEURAL NETWORKS", "SIMULATION"],
  },
  {
    number: "07",
    group: "NEURAL NETWORK LAB",
    category: "AUDIO INTELLIGENCE",
    title: "Neural Voice Emotion Detector",
    description:
      "An audio classifier that converts voice recordings into log-mel features and predicts the emotion carried by the speaker.",
    technique: "CONVOLUTIONAL NEURAL NETWORK",
    outcome: "LOG-MEL / EMOTION CLASSIFICATION",
    tags: ["CNN", "LOG-MEL FEATURES", "AUDIO CLASSIFICATION"],
  },
];

export function ProjectsShowcase() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index));
    const story = storyRef.current;
    if (!story) return;

    const storyTop = story.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = story.offsetHeight - window.innerHeight;
    const target = storyTop + (nextIndex / (projects.length - 1)) * scrollDistance;

    window.scrollTo({ top: target, behavior: "smooth" });
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    let animationFrame = 0;

    const updateFromVerticalScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const story = storyRef.current;
        if (!story) return;

        const rect = story.getBoundingClientRect();
        const scrollDistance = Math.max(1, story.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
        const nextIndex = Math.min(
          projects.length - 1,
          Math.floor(progress * projects.length),
        );

        setActiveIndex(nextIndex);
      });
    };

    updateFromVerticalScroll();
    window.addEventListener("scroll", updateFromVerticalScroll, { passive: true });
    window.addEventListener("resize", updateFromVerticalScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateFromVerticalScroll);
      window.removeEventListener("resize", updateFromVerticalScroll);
    };
  }, []);

  const project = projects[activeIndex];

  return (
    <section className="project-showcase" id="work" aria-labelledby="projects-title">
      <header className="project-showcase-heading">
        <p>003 / SELECTED WORK</p>
        <div>
          <h2 id="projects-title">Projects</h2>
          <p>Seven builds across production AI products and neural network experiments.</p>
        </div>
      </header>

      <div className="project-scroll-story" ref={storyRef}>
        <div className="project-scroll-sticky">
          <div className="project-showcase-toolbar">
            <div className="project-progress-copy" aria-live="polite">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(projects.length).padStart(2, "0")}</span>
            </div>

            <div className="project-progress-track" aria-hidden="true">
              <span style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }} />
            </div>

            <p className="project-scroll-hint">SCROLL TO EXPLORE ↓</p>

            <div className="project-slider-controls">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Show previous project"
              >
                <span aria-hidden="true">↑</span>
                PREV
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === projects.length - 1}
                aria-label="Show next project"
              >
                NEXT
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>

          <article className="project-slide project-scroll-slide">
            <div className="project-slide-copy">
              <div className="project-slide-meta">
                <span>{project.number} / {project.group}</span>
                <span>{project.category}</span>
              </div>
              <span className="project-slide-number" aria-hidden="true">{project.number}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-skills-block">
                <span>SKILLS / TOOLS</span>
                <ul aria-label={`${project.title} skills and tools`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </div>

            <div className="project-slide-visual" aria-hidden="true">
              <div className="project-visual-grid" />
              <span className="project-visual-index">PROJECT_{project.number}</span>
              <div className="project-visual-mark">
                <span>{project.number}</span>
              </div>
              <dl>
                <div>
                  <dt>TECHNIQUE</dt>
                  <dd>{project.technique}</dd>
                </div>
                <div>
                  <dt>DEMONSTRATES</dt>
                  <dd>{project.outcome}</dd>
                </div>
              </dl>
            </div>
          </article>

          <nav className="project-slide-dots" aria-label="Choose a project">
            {projects.map((item, index) => (
              <button
                type="button"
                key={item.number}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => goTo(index)}
                aria-label={`Show project ${item.number}: ${item.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                {item.number}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
