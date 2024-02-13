import '../styles/index.css'
import Nav from '@/components/nav'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

function App({ Component, pageProps }) {
  dayjs.extend(customParseFormat)
  dayjs.extend(utc)
  dayjs.extend(tz)
  return (
    <div className="w-screen h-screen">
      <Nav />
      <Component {...pageProps} />
    </div>
  )
}

export default App
