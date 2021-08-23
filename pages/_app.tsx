import "../styles/index.css";
import Nav from "@/components/nav";

function App({ Component, pageProps }) {
  return (
    <div className="w-screen">
      <Nav />
      <Component {...pageProps} />
    </div>
  );
}

export default App;
