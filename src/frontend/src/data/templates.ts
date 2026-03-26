export interface TemplateElement {
  elementType: string;
  propsJson: Record<string, unknown>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  elements: TemplateElement[];
}

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start from scratch with an empty canvas.",
    icon: "Square",
    elements: [],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Hero section, feature highlights, and a call-to-action.",
    icon: "Rocket",
    elements: [
      {
        elementType: "hero",
        propsJson: {
          headline: "Launch Your Idea Today",
          subheadline:
            "The fastest way to build beautiful websites without writing code. Drag, drop, and go live in minutes.",
          bgColor: "#0f172a",
          bgImage: "",
          textColor: "#ffffff",
          buttonLabel: "Get Started Free",
          buttonUrl: "#",
          minHeight: 500,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        elementType: "section",
        propsJson: {
          bgColor: "#f8fafc",
          content: "Why choose us?",
          padding: { top: 48, right: 32, bottom: 48, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "⚡ Blazing Fast",
          body: "Deploy in seconds with our optimized infrastructure. No configuration required.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "🎨 Fully Customizable",
          body: "Every pixel under your control. Adjust colors, fonts, spacing and more.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "📈 Built to Scale",
          body: "From personal projects to enterprise solutions — grows with your needs.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "button",
        propsJson: {
          label: "Start Building Now →",
          bgColor: "#2563eb",
          textColor: "#ffffff",
          borderRadius: 8,
          url: "#",
          alignment: "center",
          bgContainer: "transparent",
          padding: { top: 24, right: 32, bottom: 8, left: 32 },
        },
      },
      {
        elementType: "divider",
        propsJson: {
          color: "#e5e7eb",
          thickness: 1,
          margin: 24,
          bgColor: "transparent",
          padding: { top: 8, right: 32, bottom: 8, left: 32 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "© 2026 Your Company. All rights reserved. Built with love and great coffee.",
          fontSize: 14,
          color: "#9ca3af",
          textAlign: "center",
          lineHeight: 1.7,
          bgColor: "transparent",
          padding: { top: 12, right: 32, bottom: 24, left: 32 },
        },
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work, skills, and experience.",
    icon: "Briefcase",
    elements: [
      {
        elementType: "heading",
        propsJson: {
          content: "Hi, I'm Alex Rivera 👋",
          fontSize: 40,
          color: "#111111",
          textAlign: "left",
          fontWeight: "700",
          bgColor: "transparent",
          padding: { top: 48, right: 48, bottom: 8, left: 48 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "I'm a product designer and frontend engineer based in San Francisco. I craft intuitive interfaces that users love and that drive real business outcomes.",
          fontSize: 18,
          color: "#555555",
          textAlign: "left",
          lineHeight: 1.8,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 24, left: 48 },
        },
      },
      {
        elementType: "divider",
        propsJson: {
          color: "#e5e7eb",
          thickness: 1,
          margin: 16,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 8, left: 48 },
        },
      },
      {
        elementType: "two-columns",
        propsJson: {
          bgColor: "transparent",
          gap: 32,
          leftContent:
            "[Photo] A professional headshot or project showcase image would appear here.",
          rightContent:
            "Skills & Expertise:\n• UI/UX Design (Figma, Sketch)\n• React & TypeScript\n• Design Systems\n• User Research\n• Motion & Animation\n• Node.js & GraphQL",
          padding: { top: 32, right: 48, bottom: 32, left: 48 },
        },
      },
      {
        elementType: "section",
        propsJson: {
          bgColor: "#f8fafc",
          content: "Selected Work",
          padding: { top: 48, right: 48, bottom: 48, left: 48 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "Design System — Acme Corp",
          body: "Built a comprehensive design system used by 40+ engineers across 3 products, reducing design-dev handoff time by 60%.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "Mobile Rebrand — FinFlow App",
          body: "Led end-to-end redesign of a fintech mobile app, improving user retention by 34% and app store rating from 3.2 to 4.7.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
    ],
  },
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Clean article layout with title, metadata, and rich body.",
    icon: "FileText",
    elements: [
      {
        elementType: "heading",
        propsJson: {
          content: "The Future of Web Design: AI-Assisted Interfaces",
          fontSize: 36,
          color: "#111111",
          textAlign: "left",
          fontWeight: "700",
          bgColor: "transparent",
          padding: { top: 48, right: 48, bottom: 8, left: 48 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content: "March 12, 2026  ·  By Jordan Chen  ·  8 min read",
          fontSize: 14,
          color: "#9ca3af",
          textAlign: "left",
          lineHeight: 1.5,
          bgColor: "transparent",
          padding: { top: 4, right: 48, bottom: 16, left: 48 },
        },
      },
      {
        elementType: "divider",
        propsJson: {
          color: "#e5e7eb",
          thickness: 1,
          margin: 16,
          bgColor: "transparent",
          padding: { top: 4, right: 48, bottom: 16, left: 48 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "We're at an inflection point in how digital interfaces are created. The convergence of large language models, generative design tools, and no-code platforms is rewriting the rules of who can build for the web — and how fast they can do it.",
          fontSize: 18,
          color: "#333333",
          textAlign: "left",
          lineHeight: 1.8,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 16, left: 48 },
        },
      },
      {
        elementType: "image",
        propsJson: {
          src: "",
          alt: "Abstract visualization of AI-generated web design",
          width: 100,
          borderRadius: 8,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 16, left: 48 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "For decades, building a website required either a developer, a designer, or a hefty budget for both. Then drag-and-drop builders democratized creation for non-technical users. Now, AI is taking this even further — not just letting you assemble pre-built blocks, but generating entire layouts, suggesting copy, and optimizing for conversion on the fly.\n\nThe question isn't whether AI will change web design. It already has. The question is: what does this mean for the professionals who've built careers in this space?",
          fontSize: 16,
          color: "#444444",
          textAlign: "left",
          lineHeight: 1.8,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 16, left: 48 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "The designers who thrive won't be the ones who resist these tools — they'll be the ones who master them, using AI to amplify their creative vision rather than replace it. The future belongs to the collaborators.",
          fontSize: 16,
          color: "#555555",
          textAlign: "left",
          lineHeight: 1.8,
          bgColor: "#f8fafc",
          padding: { top: 24, right: 48, bottom: 24, left: 48 },
        },
      },
    ],
  },
  {
    id: "about-me",
    name: "About Me",
    description: "Personal brand page with bio, story, and highlights.",
    icon: "User",
    elements: [
      {
        elementType: "hero",
        propsJson: {
          headline: "I Build Things That Matter",
          subheadline:
            "Engineer · Maker · Coffee Enthusiast. Based in Austin, TX — working with teams worldwide.",
          bgColor: "#1a1a2e",
          bgImage: "",
          textColor: "#ffffff",
          buttonLabel: "See My Work",
          buttonUrl: "#",
          minHeight: 420,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        elementType: "paragraph",
        propsJson: {
          content:
            "I've spent the last decade building software that helps people solve real problems. From scrappy startups to Fortune 500 companies, I bring the same energy and attention to detail to everything I work on.",
          fontSize: 17,
          color: "#444444",
          textAlign: "center",
          lineHeight: 1.8,
          bgColor: "transparent",
          padding: { top: 48, right: 80, bottom: 24, left: 80 },
        },
      },
      {
        elementType: "two-columns",
        propsJson: {
          bgColor: "transparent",
          gap: 32,
          leftContent:
            "My Story\n\nI started coding at 14, building terrible websites for school projects. By college, I was freelancing. After a few agency years and a stint at a hypergrowth startup, I went indie in 2021 — and never looked back.",
          rightContent:
            "What I Value\n\n• Shipping fast, iterating faster\n• Clear communication over clever code\n• Design that serves real humans\n• Open source & giving back\n• Work-life integration, not balance",
          padding: { top: 32, right: 48, bottom: 32, left: 48 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "Want to work together?",
          body: "I'm currently taking on select consulting projects. If you have an interesting problem and the right mindset, let's talk — hello@example.com",
          bgColor: "#0f172a",
          borderRadius: 16,
          shadow: true,
          padding: { top: 40, right: 40, bottom: 40, left: 40 },
        },
      },
    ],
  },
  {
    id: "product-page",
    name: "Product Page",
    description: "Showcase a product with features, description, and CTA.",
    icon: "ShoppingBag",
    elements: [
      {
        elementType: "hero",
        propsJson: {
          headline: "Introducing NovaPen Pro",
          subheadline:
            "The world's first pressure-adaptive stylus. 8192 levels of precision. 16 hours battery. Designed for creators who refuse to compromise.",
          bgColor: "#18181b",
          bgImage: "",
          textColor: "#ffffff",
          buttonLabel: "Order Now — $149",
          buttonUrl: "#",
          minHeight: 480,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        elementType: "two-columns",
        propsJson: {
          bgColor: "transparent",
          gap: 40,
          leftContent:
            "[Product Image] High-resolution photo of NovaPen Pro against a neutral background, showing its sleek matte-black finish and precision tip.",
          rightContent:
            "NovaPen Pro\n\nAfter 3 years of research with professional illustrators, animators, and architects, we built the stylus that gets out of your way and lets you focus on creating.\n\nThe adaptive pressure engine reads your hand speed and adjusts sensitivity in real time — resulting in strokes that feel completely natural.",
          padding: { top: 48, right: 48, bottom: 32, left: 48 },
        },
      },
      {
        elementType: "button",
        propsJson: {
          label: "Add to Cart — $149",
          bgColor: "#18181b",
          textColor: "#ffffff",
          borderRadius: 8,
          url: "#",
          alignment: "left",
          bgContainer: "transparent",
          padding: { top: 8, right: 48, bottom: 32, left: 48 },
        },
      },
      {
        elementType: "divider",
        propsJson: {
          color: "#e5e7eb",
          thickness: 1,
          margin: 16,
          bgColor: "transparent",
          padding: { top: 8, right: 48, bottom: 8, left: 48 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "🖊️ 8192 Pressure Levels",
          body: "Industry-leading pressure sensitivity means every subtle variation in your stroke is captured with perfect fidelity.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "🔋 16-Hour Battery",
          body: "Work through full creative sessions without interruption. 30-minute quick charge gets you back to 80% when you need it.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
      {
        elementType: "card",
        propsJson: {
          title: "📐 Zero Parallax",
          body: "The tip aligns perfectly with the cursor at every angle. What you see is exactly what you draw, every single time.",
          bgColor: "#ffffff",
          borderRadius: 12,
          shadow: true,
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
        },
      },
    ],
  },
];
