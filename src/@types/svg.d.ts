type RenderSVGComponent = (
  props?: React.SVGAttributes<SVGElement>,
) => SVGComponent;

declare module '*.svg' {
  const RenderSVGComponent: RenderSVGComponent = () => SVGComponent;

  export default RenderSVGComponent;
}
