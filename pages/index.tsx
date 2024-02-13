import Skeleton from 'react-loading-skeleton'
import Container from '@/components/container'
import { useAllLogs } from '@/lib/swr-hooks'
import Gauge from '@/components/gauge'
import { MappedLogObject } from '@/lib/types'

export default function CurrentData() {
  const { logs, isLoading } = useAllLogs()
  const currentValues: MappedLogObject = logs ? logs[logs?.length - 1] : {}

  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Gauge
          value={currentValues?.temperature || 0}
          min={-20}
          max={50}
          label="Temperature"
          units="C°"
        />
        <Gauge
          value={currentValues?.relativeHumidity || 0}
          min={0}
          max={100}
          label="Humidity"
          units="%"
        />
        <Gauge
          value={currentValues?.co2 || 0}
          min={0}
          max={1000}
          label="CO₂"
          units="ppm"
        />
        <Gauge
          value={currentValues?.vocPPB || 0}
          min={0}
          max={2000}
          label="VOC"
          units="ppb"
        />
        <Gauge
          value={currentValues?.cn || 0}
          min={0}
          max={100}
          label="PM Count"
          units="P/cm³"
        />
        <Gauge
          value={currentValues?.pm1 || 0}
          min={0}
          max={100}
          label="PM₁"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm25 || 0}
          min={0}
          max={100}
          label="PM₂.₅"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm4 || 0}
          min={0}
          max={100}
          label="PM₄"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm10 || 0}
          min={0}
          max={100}
          label="PM₁₀"
          units="µg/m³"
        />
      </div>
    </Container>
  )
}
