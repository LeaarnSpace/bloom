declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

// Matches Next's StaticImageData (next/image-types) for static image imports.
declare module "*.png" {
  const image: { src: string; width: number; height: number; blurDataURL?: string };
  export default image;
}
