type RenderSVGComponent = (
  props?: React.SVGAttributes<SVGElement>,
) => SVGComponent;

declare module '*.svg' {
  const RenderSVGComponent: RenderSVGComponent;

  export default RenderSVGComponent;
}
