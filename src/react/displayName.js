export default function(Component) {
  return Component
    ? Component.displayName ||
        Component.name ||
        (Component.type && Component.type.displayName
          ? Component.type.displayName
          : null) ||
        (Component.type && Component.type.name ? Component.type.name : null) ||
        (typeof Component === "string" && Component.length > 0
          ? Component
          : "Unknown")
    : null;
}
