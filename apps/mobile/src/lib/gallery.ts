/**
 * Registry of every @repo/ui component demo, grouped by risk tier for the
 * NativeWind v5 + Tailwind v4 migration audit. Drives the gallery index list
 * and per-screen titles. `slug` matches the route file in app/gallery/.
 */
export type GalleryEntry = { slug: string; title: string };

export type GalleryGroup = { tier: string; description: string; entries: GalleryEntry[] };

export const GALLERY: GalleryGroup[] = [
  {
    tier: "Tier 1 — Primitives",
    description: "Styling-only, lowest risk",
    entries: [
      { slug: "text", title: "Text" },
      { slug: "icon", title: "Icon" },
      { slug: "label", title: "Label" },
      { slug: "separator", title: "Separator" },
      { slug: "skeleton", title: "Skeleton" },
      { slug: "badge", title: "Badge" },
      { slug: "button", title: "Button" },
      { slug: "card", title: "Card" },
      { slug: "aspect-ratio", title: "Aspect Ratio" },
      { slug: "avatar", title: "Avatar" },
      { slug: "progress", title: "Progress" },
    ],
  },
  {
    tier: "Tier 2 — Inputs & stateful",
    description: "Interactive, controlled state",
    entries: [
      { slug: "input", title: "Input" },
      { slug: "textarea", title: "Textarea" },
      { slug: "checkbox", title: "Checkbox" },
      { slug: "switch", title: "Switch" },
      { slug: "radio-group", title: "Radio Group" },
      { slug: "toggle", title: "Toggle" },
      { slug: "toggle-group", title: "Toggle Group" },
      { slug: "tabs", title: "Tabs" },
      { slug: "collapsible", title: "Collapsible" },
      { slug: "accordion", title: "Accordion" },
      { slug: "alert", title: "Alert" },
      { slug: "theme-toggle", title: "Theme Toggle" },
    ],
  },
  {
    tier: "Tier 3 — Overlays",
    description: "Portals, gestures, positioning — highest risk",
    entries: [
      { slug: "dialog", title: "Dialog" },
      { slug: "alert-dialog", title: "Alert Dialog" },
      { slug: "popover", title: "Popover" },
      { slug: "tooltip", title: "Tooltip" },
      { slug: "hover-card", title: "Hover Card" },
      { slug: "dropdown-menu", title: "Dropdown Menu" },
      { slug: "context-menu", title: "Context Menu" },
      { slug: "menubar", title: "Menubar" },
      { slug: "select", title: "Select" },
    ],
  },
];
