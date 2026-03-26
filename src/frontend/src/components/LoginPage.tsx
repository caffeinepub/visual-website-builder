import { Button } from "@/components/ui/button";
import { Layers, Layout, Palette, Zap } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Layout,
    title: "Drag & Drop Builder",
    desc: "Assemble pages visually with pre-built components",
  },
  {
    icon: Palette,
    title: "Live Customization",
    desc: "Edit colors, fonts, and layout in real time",
  },
  {
    icon: Zap,
    title: "Instant Preview",
    desc: "See exactly how your site looks before publishing",
  },
];

export function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 80% at 50% -20%, oklch(0.87 0.24 128 / 0.3), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.87 0.24 128 / 0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-md w-full mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-2">
            <Layers size={28} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight">
              WebCraft
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Build beautiful websites without code
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Login button */}
        <Button
          className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2"
          onClick={login}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            "Sign in to Continue"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Uses Internet Identity — your privacy-first web3 login
        </p>

        <div className="text-center mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
