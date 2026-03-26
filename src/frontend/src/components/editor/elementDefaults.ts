export const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  heading: {
    content: "Your Heading",
    fontSize: 32,
    color: "#111111",
    textAlign: "left",
    fontWeight: "700",
    bgColor: "transparent",
    padding: { top: 20, right: 32, bottom: 20, left: 32 },
  },
  paragraph: {
    content:
      "Write your paragraph text here. This is a sample paragraph to get you started.",
    fontSize: 16,
    color: "#444444",
    textAlign: "left",
    lineHeight: 1.7,
    bgColor: "transparent",
    padding: { top: 12, right: 32, bottom: 12, left: 32 },
  },
  image: {
    src: "",
    alt: "Beautiful image",
    width: 100,
    borderRadius: 0,
    bgColor: "transparent",
    padding: { top: 16, right: 32, bottom: 16, left: 32 },
  },
  button: {
    label: "Get Started",
    bgColor: "#2563eb",
    textColor: "#ffffff",
    borderRadius: 8,
    url: "#",
    alignment: "left",
    bgContainer: "transparent",
    padding: { top: 16, right: 32, bottom: 16, left: 32 },
  },
  divider: {
    color: "#e5e7eb",
    thickness: 1,
    margin: 24,
    bgColor: "transparent",
    padding: { top: 8, right: 32, bottom: 8, left: 32 },
  },
  card: {
    title: "Feature Card",
    body: "A concise description of this feature or content block.",
    bgColor: "#ffffff",
    borderRadius: 12,
    shadow: true,
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
  },
  hero: {
    headline: "Build Beautiful Websites",
    subheadline:
      "Create stunning websites without writing a single line of code. Drag, drop, and launch.",
    bgColor: "#0f172a",
    bgImage: "",
    textColor: "#ffffff",
    buttonLabel: "Start Building",
    buttonUrl: "#",
    minHeight: 480,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  "two-columns": {
    bgColor: "transparent",
    gap: 24,
    leftContent: "Left column content goes here.",
    rightContent: "Right column content goes here.",
    padding: { top: 32, right: 32, bottom: 32, left: 32 },
  },
  section: {
    bgColor: "#f8fafc",
    content: "Add your section content here.",
    padding: { top: 48, right: 32, bottom: 48, left: 32 },
  },
};

export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function parsePadding(padding: unknown): Padding {
  if (padding && typeof padding === "object") {
    const p = padding as Record<string, unknown>;
    return {
      top: Number(p.top) || 0,
      right: Number(p.right) || 0,
      bottom: Number(p.bottom) || 0,
      left: Number(p.left) || 0,
    };
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
