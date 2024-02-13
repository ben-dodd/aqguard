import { useAtom } from 'jotai'
import { isAuthorisedAtom, jobAtom } from '@/lib/atoms'
import Link from 'next/link'
import ButtonLink from '@/components/button-link'
import { CSVLink } from 'react-csv'
import {
  getLastUpdated,
  isDeviceConnected,
  properties,
} from '@/lib/data-processing'
import { useAllLogs } from '@/lib/swr-hooks'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function Nav() {
  const { logs, isLoading } = useAllLogs()
  const lastUpdated = getLastUpdated(logs)
  const [isAuthorised] = useAtom(isAuthorisedAtom)
  const [job] = useAtom(jobAtom)
  // const data = useMemo(
  //   () => (isLoading ? [] : logs?.map((log) => Object.values(log)) || []),
  //   [logs, isLoading]
  // )
  const headers = useMemo(
    () =>
      Object.values(properties)?.map((p) => ({
        label: p?.label,
        key: p?.accessor,
      })),
    []
  )
  // console.log(data)
  console.log(headers)
  return (
    <nav>
      <div className="bg-green-400 p-2 sm:flex sm:justify-between sm:items-center w-full pr-8">
        <div>
          <Link href="/" legacyBehavior>
            <div className="flex p-2 items-center">
              <div
                className={`max-w-xs ${
                  isDeviceConnected(lastUpdated) ? '' : 'opacity-50'
                }`}
              >
                <img
                  src={'/img/AQGuard.png'}
                  width={40}
                  height={40}
                  alt="K2 Environmental Ltd"
                />
              </div>
              <div className="font-bold text-white text-xl pl-2">
                K2 Air Quality Monitor
              </div>
            </div>
          </Link>
          <div className={`text-sm text-white`}>{`DEVICE IS ${
            isDeviceConnected(lastUpdated) ? '' : 'NOT '
          }CONNECTED // LAST UPDATED: ${lastUpdated || 'N/A'}`}</div>
        </div>
        <div className="flex border-t border-gray-200 pt-2 sm:border-none">
          <ButtonLink href="/" className="">
            Dashboard
          </ButtonLink>
          <ButtonLink href="/current/table" className="mx-2">
            Current Values
          </ButtonLink>
          {/* <ButtonLink href="/particles" className="mr-2">
            Particles
          </ButtonLink> */}
          <ButtonLink href="/trends" className="mr-2">
            Charts
          </ButtonLink>
          <CSVLink
            className={`bg-white p-2 rounded uppercase text-sm font-bold text-center`}
            data={logs}
            headers={headers}
            filename={`k2-aqguard-data-${dayjs().format('YYYY-MM-DD')}.csv`}
            target="_blank"
          >
            {isLoading ? 'LOADING...' : 'DOWNLOAD DATA'}
          </CSVLink>
        </div>
      </div>
    </nav>
  )
}
