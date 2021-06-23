import Log from "./log";

function Logs({ logs }) {
  console.log(logs);
  if (logs) {
    return (
      <div>
        {logs.map((e) => (
          <div key={e.ID} className="py-2">
            <Log id={e.ID} date={e.ReceivedAt} message={e.Message} />
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default Logs;
