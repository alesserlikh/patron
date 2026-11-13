import type { CSSProperties } from "react";

export function LightField({
  variant = "d1",
  style,
}: {
  variant?: string;
  style: CSSProperties;
}) {
  return <div aria-hidden="true" className={`lf ${variant}`} style={style} />;
}
