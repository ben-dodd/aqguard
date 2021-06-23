function Container({ className = "", children }) {
  return (
    <div className={"container mx-auto px-8 text-xl " + className}>
      {children}
    </div>
  );
}

export default Container;
