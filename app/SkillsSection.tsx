import type { IconType } from "react-icons";
import {
  SiAndroidstudio,
  SiClaudecode,
  SiCloudflare,
  SiCursor,
  SiDart,
  SiDocker,
  SiExpress,
  SiExpo,
  SiFastapi,
  SiFastlane,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiKeras,
  SiOpencv,
  SiPydantic,
  SiSpacy,
  SiTensorflow,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGoogleplay,
  SiGraphql,
  SiHuggingface,
  SiJavascript,
  SiJsonwebtokens,
  SiLangchain,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiRedux,
  SiScikitlearn,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiXcode,
  SiAppstore,
} from "react-icons/si";
import {
  TbAdjustments,
  TbApi,
  TbBinaryTree2,
  TbBrain,
  TbChartDots3,
  TbChartHistogram,
  TbDatabaseSearch,
  TbEye,
  TbLanguage,
  TbRobot,
  TbSparkles,
  TbTopologyStar3,
  TbVector,
} from "react-icons/tb";

type Skill = {
  name: string;
  icon: IconType;
};

type SkillGroup = {
  number: string;
  title: string;
  subtitle: string;
  skills: Skill[];
};

const skillGroups: SkillGroup[] = [
  {
    number: "01",
    title: "AI SYSTEMS",
    subtitle: "AGENTS / LLMS / RETRIEVAL",
    skills: [
      { name: "AI Agents", icon: TbRobot },
      { name: "RAG", icon: TbDatabaseSearch },
      { name: "LLMs", icon: TbBrain },
      { name: "Gen AI", icon: TbSparkles },
      { name: "Fine-Tuning", icon: TbAdjustments },
      { name: "LangChain", icon: SiLangchain },
      { name: "LangGraph", icon: TbBinaryTree2 },
      { name: "LangSmith", icon: TbChartDots3 },
      { name: "Hugging Face", icon: SiHuggingface },
      { name: "Vector Databases", icon: TbDatabaseSearch },
      { name: "Embeddings", icon: TbVector },
      { name: "Python", icon: SiPython },
    ],
  },
  {
    number: "02",
    title: "MACHINE LEARNING",
    subtitle: "ML / DL / VISION / NLP",
    skills: [
      { name: "Machine Learning", icon: TbChartHistogram },
      { name: "Deep Learning", icon: TbTopologyStar3 },
      { name: "NLP", icon: TbLanguage },
      { name: "Computer Vision", icon: TbEye },
      { name: "PyTorch", icon: SiPytorch },
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "Keras", icon: SiKeras },
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "OpenCV", icon: SiOpencv },
      { name: "spaCy", icon: SiSpacy },
      { name: "Pandas", icon: SiPandas },
      { name: "NumPy", icon: SiNumpy },
    ],
  },
  {
    number: "03",
    title: "MOBILE",
    subtitle: "IOS / ANDROID / CROSS-PLATFORM",
    skills: [
      { name: "Flutter", icon: SiFlutter },
      { name: "Dart", icon: SiDart },
      { name: "React Native", icon: SiReact },
      { name: "Android Studio", icon: SiAndroidstudio },
      { name: "Xcode", icon: SiXcode },
      { name: "Firebase", icon: SiFirebase },
      { name: "Redux", icon: SiRedux },
      { name: "Expo", icon: SiExpo },
      { name: "App Store", icon: SiAppstore },
      { name: "Google Play", icon: SiGoogleplay },
      { name: "Fastlane", icon: SiFastlane },
      { name: "REST APIs", icon: TbApi },
    ],
  },
  {
    number: "04",
    title: "BACKEND + DATA",
    subtitle: "SERVICES / APIS / DATABASES",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "FastAPI", icon: SiFastapi },
      { name: "Pydantic", icon: SiPydantic },
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Redis", icon: SiRedis },
      { name: "GraphQL", icon: SiGraphql },
      { name: "Prisma", icon: SiPrisma },
      { name: "Supabase", icon: SiSupabase },
      { name: "JWT Auth", icon: SiJsonwebtokens },
      { name: "Docker", icon: SiDocker },
    ],
  },
  {
    number: "05",
    title: "ENGINEERING TOOLS",
    subtitle: "CODE / DESIGN / DELIVERY",
    skills: [
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "CI/CD", icon: SiGithubactions },
      { name: "Figma", icon: SiFigma },
      { name: "Claude Code", icon: SiClaudecode },
      { name: "Cursor AI", icon: SiCursor },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Vite", icon: SiVite },
      { name: "Cloudflare", icon: SiCloudflare },
    ],
  },
];

function SkillTile({ skill, index }: { skill: Skill; index: number }) {
  const Icon = skill.icon;

  return (
    <li className="stack-skill">
      <span className="stack-skill-index">{String(index + 1).padStart(2, "0")}</span>
      <Icon className="stack-skill-icon" aria-hidden="true" />
      <strong>{skill.name}</strong>
    </li>
  );
}

export function SkillsSection() {
  const totalSkills = skillGroups.reduce((total, group) => total + group.skills.length, 0);

  return (
    <section className="stack-section" id="skills" aria-labelledby="skills-title">
      <header className="stack-heading">
        <div>
          <p>004 / TECH STACK</p>
          <span>{String(totalSkills).padStart(2, "0")} CORE TOOLS</span>
        </div>
        <h2 id="skills-title">Skills</h2>
        <p>THE TOOLS I USE TO BUILD, TRAIN, SHIP, AND SCALE PRODUCTS.</p>
      </header>

      <div className="stack-board">
        {skillGroups.map((group) => (
          <article className="stack-group" key={group.number}>
            <header>
              <span>{group.number}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.subtitle}</p>
              </div>
              <span>{String(group.skills.length).padStart(2, "0")}</span>
            </header>

            <ul>
              {group.skills.map((skill, index) => (
                <SkillTile skill={skill} index={index} key={skill.name} />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
