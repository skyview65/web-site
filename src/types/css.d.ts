import "csstype";

declare module "csstype" {
  interface Properties {
    /** Allow CSS custom properties (e.g. --ac, --rv-delay) in style objects */
    [index: `--${string}`]: string | number | undefined;
  }
}
