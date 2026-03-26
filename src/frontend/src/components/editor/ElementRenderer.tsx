import { cn } from "@/lib/utils";
import { GripVertical, ImageIcon, Trash2 } from "lucide-react";
import type { Element } from "../../backend.d";
import { parsePadding } from "./elementDefaults";

interface ElementRendererProps {
  element: Element;
  index: number;
  isSelected: boolean;
  isEditing: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDragStart?: (e: React.MouseEvent) => void;
}

function parseProps(propsJson: string): Record<string, any> {
  try {
    return JSON.parse(propsJson || "{}");
  } catch {
    return {};
  }
}

function ElementContent({
  elementType,
  props,
}: {
  elementType: string;
  props: Record<string, any>;
}) {
  const pad = parsePadding(props.padding);
  const paddingStyle = {
    paddingTop: pad.top,
    paddingRight: pad.right,
    paddingBottom: pad.bottom,
    paddingLeft: pad.left,
  };
  const containerStyle = {
    backgroundColor:
      props.bgColor && props.bgColor !== "transparent"
        ? props.bgColor
        : undefined,
    ...paddingStyle,
  };

  switch (elementType) {
    case "heading":
      return (
        <div style={containerStyle}>
          <h2
            style={{
              fontSize: props.fontSize || 32,
              color: props.color || "#111111",
              textAlign: (props.textAlign as any) || "left",
              fontWeight: props.fontWeight || "700",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {props.content || "Heading"}
          </h2>
        </div>
      );

    case "paragraph":
      return (
        <div style={containerStyle}>
          <p
            style={{
              fontSize: props.fontSize || 16,
              color: props.color || "#444444",
              textAlign: (props.textAlign as any) || "left",
              lineHeight: props.lineHeight || 1.7,
              margin: 0,
            }}
          >
            {props.content || "Paragraph text"}
          </p>
        </div>
      );

    case "image":
      return (
        <div style={containerStyle}>
          {props.src ? (
            <img
              src={props.src}
              alt={props.alt || ""}
              style={{
                width: `${props.width || 100}%`,
                borderRadius: props.borderRadius || 0,
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: `${props.width || 100}%`,
                aspectRatio: "16/9",
                background: "#f1f5f9",
                border: "2px dashed #cbd5e1",
                borderRadius: props.borderRadius || 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "#94a3b8",
              }}
            >
              <ImageIcon size={32} />
              <span style={{ fontSize: 14 }}>Add image URL in properties</span>
            </div>
          )}
        </div>
      );

    case "button": {
      const align = props.alignment || "left";
      const justifyMap: Record<string, string> = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return (
        <div
          style={{
            ...containerStyle,
            display: "flex",
            justifyContent: justifyMap[align] || "flex-start",
          }}
        >
          <a
            href={props.url || "#"}
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-block",
              backgroundColor: props.bgColor || "#2563eb",
              color: props.textColor || "#ffffff",
              borderRadius: props.borderRadius || 8,
              padding: "12px 28px",
              fontWeight: "600",
              fontSize: 15,
              textDecoration: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {props.label || "Button"}
          </a>
        </div>
      );
    }

    case "divider":
      return (
        <div style={containerStyle}>
          <hr
            style={{
              border: "none",
              borderTop: `${props.thickness || 1}px solid ${
                props.color || "#e5e7eb"
              }`,
              margin: `${props.margin || 0}px 0`,
            }}
          />
        </div>
      );

    case "card":
      return (
        <div style={{ ...paddingStyle }}>
          <div
            style={{
              backgroundColor: props.bgColor || "#ffffff",
              borderRadius: props.borderRadius || 12,
              padding: "24px 28px",
              boxShadow: props.shadow
                ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)"
                : "none",
              border: "1px solid #f1f5f9",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111827",
                margin: "0 0 8px 0",
              }}
            >
              {props.title || "Card Title"}
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {props.body || "Card body text"}
            </p>
          </div>
        </div>
      );

    case "hero": {
      const heroStyle: React.CSSProperties = {
        backgroundColor: props.bgColor || "#0f172a",
        color: props.textColor || "#ffffff",
        minHeight: props.minHeight || 480,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 48px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      };
      if (props.bgImage) {
        heroStyle.backgroundImage = `url(${props.bgImage})`;
      }
      return (
        <div style={heroStyle}>
          {props.bgImage && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              textAlign: "center",
              maxWidth: 680,
            }}
          >
            <h1
              style={{
                fontSize: 52,
                fontWeight: "800",
                color: props.textColor || "#ffffff",
                margin: "0 0 16px 0",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {props.headline || "Hero Headline"}
            </h1>
            <p
              style={{
                fontSize: 18,
                color: props.textColor || "#ffffff",
                opacity: 0.85,
                margin: "0 0 32px 0",
                lineHeight: 1.6,
              }}
            >
              {props.subheadline || "Hero subheadline"}
            </p>
            {props.buttonLabel && (
              <a
                href={props.buttonUrl || "#"}
                onClick={(e) => e.preventDefault()}
                style={{
                  display: "inline-block",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderRadius: 8,
                  padding: "14px 32px",
                  fontWeight: "700",
                  fontSize: 16,
                  textDecoration: "none",
                }}
              >
                {props.buttonLabel}
              </a>
            )}
          </div>
        </div>
      );
    }

    case "two-columns":
      return (
        <div style={containerStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: props.gap || 24,
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: 24,
                minHeight: 120,
                color: "#475569",
                fontSize: 14,
              }}
            >
              {props.leftContent || "Left column"}
            </div>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: 24,
                minHeight: 120,
                color: "#475569",
                fontSize: 14,
              }}
            >
              {props.rightContent || "Right column"}
            </div>
          </div>
        </div>
      );

    case "section":
      return (
        <div style={containerStyle}>
          <div
            style={{
              minHeight: 80,
              color: "#475569",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {props.content || "Section content"}
          </div>
        </div>
      );

    default:
      return (
        <div
          style={{
            padding: 16,
            background: "#fef3c7",
            color: "#92400e",
            fontSize: 13,
          }}
        >
          Unknown element: {elementType}
        </div>
      );
  }
}

export function ElementRenderer({
  element,
  index,
  isSelected,
  isEditing,
  onSelect,
  onDelete,
  onDragStart,
}: ElementRendererProps) {
  const props = parseProps(element.propsJson);

  if (!isEditing) {
    return <ElementContent elementType={element.elementType} props={props} />;
  }

  return (
    <div
      data-ocid={`element.item.${index + 1}`}
      className={cn(
        "canvas-element relative group border-2 border-transparent transition-all duration-150 cursor-pointer",
        isSelected && "border-primary",
        !isSelected && "hover:border-border",
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect?.();
      }}
    >
      {/* Drag handle */}
      <div
        className="element-controls drag-handle absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center z-10 bg-card/80 backdrop-blur-sm"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDragStart?.(e);
        }}
      >
        <GripVertical size={14} className="text-muted-foreground" />
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          type="button"
          className="element-controls absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground rounded p-1 hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete element"
        >
          <Trash2 size={12} />
        </button>
      )}

      {/* Element type badge */}
      {isSelected && (
        <div className="absolute top-2 left-8 z-10 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-medium uppercase tracking-wider">
          {element.elementType}
        </div>
      )}

      <div className="pl-6">
        <ElementContent elementType={element.elementType} props={props} />
      </div>
    </div>
  );
}
