import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignCenter, AlignLeft, AlignRight, Settings2 } from "lucide-react";
import type { Element } from "../../backend.d";
import { useEditor } from "../../contexts/EditorContext";
import { parsePadding } from "./elementDefaults";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value === "transparent" ? "#ffffff" : value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-border cursor-pointer p-0.5 bg-input"
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="transparent"
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs text-foreground font-mono">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  multiline = false,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      ) : (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-sm"
        />
      )}
    </div>
  );
}

function AlignField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <ToggleGroup
        type="single"
        value={value || "left"}
        onValueChange={(v) => v && onChange(v)}
        className="w-full"
      >
        <ToggleGroupItem value="left" className="flex-1 h-8">
          <AlignLeft size={13} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" className="flex-1 h-8">
          <AlignCenter size={13} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" className="flex-1 h-8">
          <AlignRight size={13} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function PaddingFields({
  value,
  onChange,
}: {
  value: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
}) {
  const pad = parsePadding(value);
  const update = (side: string, v: number) => onChange({ ...pad, [side]: v });
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">Padding</Label>
      <div className="grid grid-cols-2 gap-2">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <div key={side} className="space-y-0.5">
            <Label className="text-[10px] text-muted-foreground capitalize">
              {side}
            </Label>
            <Input
              type="number"
              min={0}
              max={120}
              value={pad[side]}
              onChange={(e) => update(side, Number(e.target.value))}
              className="h-7 text-xs font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function ElementFields({
  element,
  onChange,
}: {
  element: Element;
  onChange: (props: Record<string, unknown>) => void;
}) {
  let props: Record<string, any> = {};
  try {
    props = JSON.parse(element.propsJson || "{}");
  } catch {
    props = {};
  }

  const update = (key: string, value: unknown) => {
    onChange({ ...props, [key]: value });
  };

  const type = element.elementType;

  return (
    <div className="space-y-5">
      {/* Common: Background color */}
      {type !== "hero" && (
        <>
          <SectionTitle>Style</SectionTitle>
          <ColorField
            label="Background Color"
            value={props.bgColor || "transparent"}
            onChange={(v) => update("bgColor", v)}
          />
          <PaddingFields
            value={props.padding || {}}
            onChange={(v) => update("padding", v)}
          />
        </>
      )}

      <Separator />

      {/* Type-specific */}
      {type === "heading" && (
        <>
          <SectionTitle>Heading</SectionTitle>
          <TextField
            label="Text Content"
            value={props.content}
            multiline
            placeholder="Your heading text"
            onChange={(v) => update("content", v)}
          />
          <SliderField
            label="Font Size"
            value={props.fontSize || 32}
            min={16}
            max={96}
            unit="px"
            onChange={(v) => update("fontSize", v)}
          />
          <ColorField
            label="Text Color"
            value={props.color || "#111111"}
            onChange={(v) => update("color", v)}
          />
          <AlignField
            label="Alignment"
            value={props.textAlign || "left"}
            onChange={(v) => update("textAlign", v)}
          />
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Weight</Label>
            <ToggleGroup
              type="single"
              value={props.fontWeight || "700"}
              onValueChange={(v) => v && update("fontWeight", v)}
              className="w-full"
            >
              <ToggleGroupItem value="400" className="flex-1 h-8 text-xs">
                Regular
              </ToggleGroupItem>
              <ToggleGroupItem value="600" className="flex-1 h-8 text-xs">
                Semi
              </ToggleGroupItem>
              <ToggleGroupItem value="700" className="flex-1 h-8 text-xs">
                Bold
              </ToggleGroupItem>
              <ToggleGroupItem value="800" className="flex-1 h-8 text-xs">
                Extra
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </>
      )}

      {type === "paragraph" && (
        <>
          <SectionTitle>Paragraph</SectionTitle>
          <TextField
            label="Text Content"
            value={props.content}
            multiline
            placeholder="Your paragraph text"
            onChange={(v) => update("content", v)}
          />
          <SliderField
            label="Font Size"
            value={props.fontSize || 16}
            min={12}
            max={24}
            unit="px"
            onChange={(v) => update("fontSize", v)}
          />
          <ColorField
            label="Text Color"
            value={props.color || "#444444"}
            onChange={(v) => update("color", v)}
          />
          <AlignField
            label="Alignment"
            value={props.textAlign || "left"}
            onChange={(v) => update("textAlign", v)}
          />
          <SliderField
            label="Line Height"
            value={props.lineHeight || 1.7}
            min={1}
            max={3}
            step={0.1}
            onChange={(v) => update("lineHeight", v)}
          />
        </>
      )}

      {type === "image" && (
        <>
          <SectionTitle>Image</SectionTitle>
          <TextField
            label="Image URL"
            value={props.src}
            placeholder="https://example.com/image.jpg"
            onChange={(v) => update("src", v)}
          />
          <TextField
            label="Alt Text"
            value={props.alt}
            placeholder="Describe the image"
            onChange={(v) => update("alt", v)}
          />
          <SliderField
            label="Width"
            value={props.width || 100}
            min={10}
            max={100}
            unit="%"
            onChange={(v) => update("width", v)}
          />
          <SliderField
            label="Border Radius"
            value={props.borderRadius || 0}
            min={0}
            max={48}
            unit="px"
            onChange={(v) => update("borderRadius", v)}
          />
        </>
      )}

      {type === "button" && (
        <>
          <SectionTitle>Button</SectionTitle>
          <TextField
            label="Label"
            value={props.label}
            placeholder="Button text"
            onChange={(v) => update("label", v)}
          />
          <TextField
            label="Link URL"
            value={props.url}
            placeholder="https://example.com"
            onChange={(v) => update("url", v)}
          />
          <ColorField
            label="Background Color"
            value={props.bgColor || "#2563eb"}
            onChange={(v) => update("bgColor", v)}
          />
          <ColorField
            label="Text Color"
            value={props.textColor || "#ffffff"}
            onChange={(v) => update("textColor", v)}
          />
          <SliderField
            label="Border Radius"
            value={props.borderRadius || 8}
            min={0}
            max={48}
            unit="px"
            onChange={(v) => update("borderRadius", v)}
          />
          <AlignField
            label="Alignment"
            value={props.alignment || "left"}
            onChange={(v) => update("alignment", v)}
          />
        </>
      )}

      {type === "divider" && (
        <>
          <SectionTitle>Divider</SectionTitle>
          <ColorField
            label="Color"
            value={props.color || "#e5e7eb"}
            onChange={(v) => update("color", v)}
          />
          <SliderField
            label="Thickness"
            value={props.thickness || 1}
            min={1}
            max={16}
            unit="px"
            onChange={(v) => update("thickness", v)}
          />
          <SliderField
            label="Margin"
            value={props.margin || 0}
            min={0}
            max={80}
            unit="px"
            onChange={(v) => update("margin", v)}
          />
        </>
      )}

      {type === "card" && (
        <>
          <SectionTitle>Card</SectionTitle>
          <TextField
            label="Title"
            value={props.title}
            placeholder="Card title"
            onChange={(v) => update("title", v)}
          />
          <TextField
            label="Body Text"
            value={props.body}
            multiline
            placeholder="Card description"
            onChange={(v) => update("body", v)}
          />
          <ColorField
            label="Background Color"
            value={props.bgColor || "#ffffff"}
            onChange={(v) => update("bgColor", v)}
          />
          <SliderField
            label="Border Radius"
            value={props.borderRadius || 12}
            min={0}
            max={32}
            unit="px"
            onChange={(v) => update("borderRadius", v)}
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Box Shadow</Label>
            <Switch
              checked={!!props.shadow}
              onCheckedChange={(v) => update("shadow", v)}
            />
          </div>
        </>
      )}

      {type === "hero" && (
        <>
          <SectionTitle>Hero Content</SectionTitle>
          <TextField
            label="Headline"
            value={props.headline}
            placeholder="Your main headline"
            onChange={(v) => update("headline", v)}
          />
          <TextField
            label="Subheadline"
            value={props.subheadline}
            multiline
            placeholder="Supporting text"
            onChange={(v) => update("subheadline", v)}
          />
          <TextField
            label="Button Label"
            value={props.buttonLabel}
            placeholder="Call to action"
            onChange={(v) => update("buttonLabel", v)}
          />
          <TextField
            label="Button URL"
            value={props.buttonUrl}
            placeholder="https://example.com"
            onChange={(v) => update("buttonUrl", v)}
          />
          <Separator />
          <SectionTitle>Style</SectionTitle>
          <ColorField
            label="Background Color"
            value={props.bgColor || "#0f172a"}
            onChange={(v) => update("bgColor", v)}
          />
          <TextField
            label="Background Image URL"
            value={props.bgImage || ""}
            placeholder="https://example.com/bg.jpg"
            onChange={(v) => update("bgImage", v)}
          />
          <ColorField
            label="Text Color"
            value={props.textColor || "#ffffff"}
            onChange={(v) => update("textColor", v)}
          />
          <SliderField
            label="Min Height"
            value={props.minHeight || 480}
            min={200}
            max={900}
            unit="px"
            onChange={(v) => update("minHeight", v)}
          />
        </>
      )}

      {type === "two-columns" && (
        <>
          <SectionTitle>Two Columns</SectionTitle>
          <TextField
            label="Left Content"
            value={props.leftContent}
            multiline
            placeholder="Left column text"
            onChange={(v) => update("leftContent", v)}
          />
          <TextField
            label="Right Content"
            value={props.rightContent}
            multiline
            placeholder="Right column text"
            onChange={(v) => update("rightContent", v)}
          />
          <SliderField
            label="Column Gap"
            value={props.gap || 24}
            min={8}
            max={80}
            unit="px"
            onChange={(v) => update("gap", v)}
          />
        </>
      )}

      {type === "section" && (
        <>
          <SectionTitle>Section</SectionTitle>
          <TextField
            label="Content"
            value={props.content}
            multiline
            placeholder="Section content"
            onChange={(v) => update("content", v)}
          />
        </>
      )}
    </div>
  );
}

export function PropertiesPanel() {
  const { selectedElementId, elements, updateElementProps } = useEditor();
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <aside
      data-ocid="properties.panel"
      className="flex flex-col h-full bg-sidebar border-l border-border"
      style={{ width: 280 }}
    >
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Settings2 size={14} className="text-primary" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Properties
        </span>
      </div>

      {selectedElement ? (
        <ScrollArea className="flex-1">
          <div className="p-4">
            <ElementFields
              element={selectedElement}
              onChange={(props) =>
                updateElementProps(selectedElement.id, props)
              }
            />
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Settings2 size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/70">
              No element selected
            </p>
            <p className="text-xs text-muted-foreground">
              Click any element on the canvas to edit its properties
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
