import Nav from "@/components/nav";

function Container({ className = "", children }) {
  return (
    <>
      <Nav />
      <div className={"container mx-auto px-8 " + className}>{children}</div>
    </>
  );
}

export default Container;
