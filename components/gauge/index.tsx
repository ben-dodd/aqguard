import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";

function Gauge({ value, min, max, label, units }) {
  const innerRadius = 0.7;
  const outerRadius = 1;
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;
  const cornerRadius = 0;
  const backgroundArc = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(cornerRadius)();

  const percentScale = scaleLinear().domain([min, max]).range([0, 1]);
  const percent = percentScale(value);
  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);
  const valueAngle = angleScale(percent);
  const filledArc = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(valueAngle)
    .cornerRadius(cornerRadius)();
  const h = 360 * percent; // change hue depending on level
  return (
    <div className="flex flex-col items-center p-4">
      <svg width="9em" viewBox={[-1, -1, 2, 1].join(" ")}>
        <path d={backgroundArc} fill="hsl(120,50%,70%)" />
        <path d={filledArc} fill={`hsl(${h},50%,20%)`} />
      </svg>
      <div className="text-4xl font-bold">{value.toFixed(2)}</div>
      <div className="text-gray-600">{label}</div>
      <div className="font-light text-sm">{units}</div>
    </div>
  );
}

export default Gauge;
