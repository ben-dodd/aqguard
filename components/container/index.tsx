function Container({ className = "", children }) {
  return (
    <div className={"mx-auto px-2 text-gray-800 " + className}>{children}</div>
  );
}

export default Container;
