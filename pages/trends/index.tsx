import Skeleton from 'react-loading-skeleton'
import Container from '@/components/container'
import Select from 'react-select'

import { useAllLogs } from '@/lib/swr-hooks'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'
import { dateTimeFormat, properties } from '@/lib/data-processing'
import { useState } from 'react'
import { MappedLogObject } from '@/lib/types'

export default function Trends() {
  const { logs, isLoading } = useAllLogs()
  const [period, setPeriod] = useState('all')
  const [chart, setChart] = useState('tempHum')
  const [custom1, setCustom1] = useState(null)
  const [custom2, setCustom2] = useState(null)
  const filteredLogs =
    period === 'all'
      ? logs
      : period === 'month'
      ? logs?.filter((l: MappedLogObject) =>
          dayjs()
            .subtract(1, 'month')
            .isBefore(dayjs(l?.isoDate, dateTimeFormat))
        )
      : period === 'week'
      ? logs?.filter((l: MappedLogObject) =>
          dayjs()
            .subtract(1, 'week')
            .isBefore(dayjs(l?.isoDate, dateTimeFormat))
        )
      : period === '3day'
      ? logs?.filter((l: MappedLogObject) =>
          dayjs().subtract(3, 'day').isBefore(dayjs(l?.isoDate, dateTimeFormat))
        )
      : period === 'day'
      ? logs?.filter((l: MappedLogObject) =>
          dayjs().subtract(1, 'day').isBefore(dayjs(l?.isoDate, dateTimeFormat))
        )
      : period === 'hour'
      ? logs?.filter((l: MappedLogObject) =>
          dayjs()
            .subtract(1, 'hour')
            .isBefore(dayjs(l?.isoDate, dateTimeFormat))
        )
      : logs
  const aqOptions = Object.values(properties).map((p) => ({
    value: p?.accessor,
    label: p?.label,
  }))
  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div className="flex w-full border-t border-gray-200 pt-2 sm:border-none">
        <button
          className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
            chart === 'tempHum'
              ? 'bg-red-300 hover:bg-red-200'
              : 'bg-white hover:bg-gray-200'
          }`}
          onClick={() => setChart('tempHum')}
        >
          Temp/Humidity
        </button>
        <button
          className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
            chart === 'co2PM'
              ? 'bg-red-300 hover:bg-red-200'
              : 'bg-white hover:bg-gray-200'
          }`}
          onClick={() => setChart('co2PM')}
        >
          CO2/PM10
        </button>
        <button
          className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
            chart === 'vocHum'
              ? 'bg-red-300 hover:bg-red-200'
              : 'bg-white hover:bg-gray-200'
          }`}
          onClick={() => setChart('vocHum')}
        >
          VOC/Humidity
        </button>
        <button
          className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
            chart === 'pm'
              ? 'bg-red-300 hover:bg-red-200'
              : 'bg-white hover:bg-gray-200'
          }`}
          onClick={() => setChart('pm')}
        >
          PM
        </button>
        <button
          className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
            chart === 'custom'
              ? 'bg-red-300 hover:bg-red-200'
              : 'bg-white hover:bg-gray-200'
          }`}
          onClick={() => setChart('custom')}
        >
          Custom
        </button>
      </div>
      {chart === 'custom' && (
        <div className="flex py-4 max-w-md">
          <Select
            options={aqOptions}
            className="w-1/2"
            onChange={(e) => setCustom1(e.value)}
          />
          <Select
            options={aqOptions}
            className="w-1/2 mx-2"
            onChange={(e) => setCustom2(e.value)}
          />
        </div>
      )}
      <div className="flex w-full border-t border-gray-200 pt-2 sm:border-none">
        {[
          { label: 'All Time', key: 'all' },
          { label: 'Last Month', key: 'month' },
          { label: 'Last Week', key: 'week' },
          { label: 'Last 3 Days', key: '3day' },
          { label: 'Last 24 Hrs', key: 'day' },
          { label: 'Last Hour', key: 'hour' },
        ]?.map((button) => (
          <button
            className={`mr-2 border p-2 rounded uppercase text-sm font-bold text-center ${
              period === button?.key
                ? 'bg-green-300 hover:bg-green-200'
                : 'bg-white hover:bg-gray-200 '
            }`}
            onClick={() => setPeriod(button?.key)}
          >
            {button?.label}
          </button>
        ))}
      </div>
      {chart === 'tempHum' && (
        <div className="py-4">
          <div className="text-center w-full font-bold text-xl pb-4">
            <span style={{ color: '#a02222' }}>Temperature</span> and{' '}
            <span style={{ color: '#1d92a8' }}>Humidity</span>
          </div>
          <ResponsiveContainer width="95%" aspect={3}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
                <Label value="Time (10min intervals)" position="insideBottom" />
              </XAxis>
              <YAxis yAxisId="temperature">
                <Label
                  value={`Temperature`}
                  angle={-90}
                  position={'insideLeft'}
                  offset={10}
                />
              </YAxis>
              <YAxis yAxisId="relativeHumidity" orientation="right">
                <Label
                  value={`Humidity`}
                  angle={-90}
                  position={'insideRight'}
                  offset={10}
                />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="temperature"
                stroke="#a02222"
                strokeWidth={1}
                dot={false}
              />
              <Line
                yAxisId="relativeHumidity"
                type="monotone"
                dataKey="relativeHumidity"
                stroke="#1d92a8"
                strokeWidth={1}
                dot={false}
              />
              {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {chart === 'co2PM' && (
        <div className="py-4">
          <div className="text-center w-full font-bold text-xl pb-4">
            <span style={{ color: '#a0d000' }}>
              CO<sub>2</sub>
            </span>{' '}
            and <span style={{ color: '#e90050' }}>PM10</span>
          </div>
          <ResponsiveContainer width="95%" aspect={3}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
                <Label value="Time (10min intervals)" position="insideBottom" />
              </XAxis>
              <YAxis yAxisId="co2">
                <Label
                  value={`CO2 (ppm)`}
                  angle={-90}
                  position={'insideLeft'}
                  offset={10}
                />
              </YAxis>
              <YAxis yAxisId="pm10" orientation="right">
                <Label
                  value={`PM10 (µg/m3)`}
                  angle={-90}
                  position={'insideRight'}
                  offset={10}
                />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Line
                yAxisId="co2"
                type="monotone"
                dataKey="co2"
                stroke="#a0d000"
                strokeWidth={1}
                dot={false}
              />
              <Line
                yAxisId="pm10"
                type="monotone"
                dataKey="pm10"
                stroke="#e90050"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {chart === 'vocHum' && (
        <div className="py-4">
          <div className="text-center w-full font-bold text-xl pb-4">
            <span style={{ color: '#a0d000' }}>VOC</span> and{' '}
            <span style={{ color: '#e90050' }}>Humidity</span>
          </div>
          <ResponsiveContainer width="95%" aspect={3}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
                <Label value="Time (10min intervals)" position="insideBottom" />
              </XAxis>
              <YAxis yAxisId="vocPPB">
                <Label
                  value={`VOC (ppb)`}
                  angle={-90}
                  position={'insideLeft'}
                  offset={10}
                />
              </YAxis>
              <YAxis yAxisId="relativeHumidity" orientation="right">
                <Label
                  value={`Humidity (%)`}
                  angle={-90}
                  position={'insideRight'}
                  offset={10}
                />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Line
                yAxisId="vocPPB"
                type="monotone"
                dataKey="vocPPB"
                stroke="#a0d000"
                strokeWidth={1}
                dot={false}
              />
              <Line
                yAxisId="relativeHumidity"
                type="monotone"
                dataKey="relativeHumidity"
                stroke="#e90050"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {chart === 'pm' && (
        <div className="py-4">
          <div className="text-center w-full font-bold text-xl pb-4">
            Particulate Matter
          </div>
          <ResponsiveContainer width="90%" aspect={3}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
                <Label value="Time (10min intervals)" position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label
                  value={`PM (µg/m³)`}
                  angle={-90}
                  position={'insideLeft'}
                  offset={10}
                />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Legend verticalAlign="top" height={36} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pm1"
                stroke="#a00000"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#f0c000"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pm4"
                stroke="#00a0f0"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#00a000"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {chart === 'custom' && (
        <div className="py-4">
          <div className="text-center w-full font-bold text-xl pb-4">
            <span style={{ color: '#a0d000' }}>
              {properties[custom1]?.label}
            </span>{' '}
            and{' '}
            <span style={{ color: '#e90050' }}>
              {properties[custom2]?.label}
            </span>
          </div>
          <ResponsiveContainer width="95%" aspect={3}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
                <Label value="Time (10min intervals)" position="insideBottom" />
              </XAxis>
              <YAxis yAxisId="custom1">
                <Label
                  value={`${properties[custom1]?.label} (${properties[custom1]?.units})`}
                  angle={-90}
                  position={'insideLeft'}
                  offset={10}
                />
              </YAxis>
              <YAxis yAxisId="custom2" orientation="right">
                <Label
                  value={`${properties[custom2]?.label} (${properties[custom2]?.units})`}
                  angle={-90}
                  position={'insideRight'}
                  offset={10}
                />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Line
                yAxisId="custom1"
                type="monotone"
                dataKey={custom1}
                stroke="#a0d000"
                strokeWidth={1}
                dot={false}
              />
              <Line
                yAxisId="custom2"
                type="monotone"
                dataKey={custom2}
                stroke="#e90050"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Container>
  )
}

function formatXDate(tickItem) {
  return dayjs(tickItem, dateTimeFormat).format('D/MM, h:mma')
}
