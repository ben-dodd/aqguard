import { properties } from "@/lib/data-processing";
import { useAllLogs } from "@/lib/swr-hooks";
import { MappedLogObject } from "@/lib/types";
import { useEffect, useState } from "react";
import ParticleBackground from "react-particle-backgrounds";

export default function Particles() {
  const { logs, isLoading } = useAllLogs();
  const currentValues: MappedLogObject = logs ? logs[logs?.length - 1] : {};
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Object.entries(currentValues)
      ?.filter(([key, value]) => key?.includes("pmBand"))
      // ?.filter(([key, value]) => key === "pmBand1" || key === "pmBand10")
      ?.map(([key, value]) => ({
        key,
        upperLimit: properties?.[key]?.upperLimit * 6,
        lowerLimit: properties?.[key]?.lowerLimit * 6,
        value: value * 1000,
      }));
    console.log(newParticles);
    setParticles(newParticles);
  }, [currentValues]);

  // console.log(particles);

  return (
    <div className="relative w-full h-full bg-blue-900">
      {particles?.map((p) => (
        <div className="absolute w-full h-full">
          <ParticleBackground
            settings={{
              canvas: {
                useBouncyWalls: true,
              },
              particle: {
                particleCount: p?.value,
                color: "#f3f5b5",
                maxSize: p?.upperLimit,
                minSize: p?.lowerLimit,
              },
              velocity: {
                directionAngle: 180,
                directionAngleVariance: 180,
                minSpeed: 0.1,
                maxSpeed: 0.4,
              },
              opacity: {
                minOpacity: 0.4,
                maxOpacity: 0.9,
                opacityTransitionTime: 5000,
              },
            }}
          />
        </div>
      ))}
    </div>
  );
}
