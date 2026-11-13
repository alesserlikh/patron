import { imageDimensions } from "@/content/patron/ui";
import Image from "next/image";

// Shared geometry keeps both image halves synchronized, including their crop.
export function AnimatedLens({
  image,
  position = "50% 50%",
  eager = false,
}: {
  image: string;
  position?: string;
  eager?: boolean;
}) {
  return (
    <>
      {(["l", "r"] as const).map((side) => (
        <span className={`lh ${side}`} key={side}>
          <Image
            src={image}
            alt=""
            width={imageDimensions[image]?.width ?? 2000}
            height={imageDimensions[image]?.height ?? 1125}
            unoptimized
            loading={eager ? "eager" : "lazy"}
            style={{ objectPosition: position }}
          />
        </span>
      ))}
    </>
  );
}
