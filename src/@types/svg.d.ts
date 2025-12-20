type RenderSVGComponent = ((
  props?: React.SVGAttributes<SVGElement>,
) => SVGComponent) & { src: string };

declare module '*.svg' {
  const RenderSVGComponent: RenderSVGComponent;

  export default RenderSVGComponent;
}
