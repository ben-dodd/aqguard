import "../styles/index.css";
import Nav from "@/components/nav";

function App({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default App;
