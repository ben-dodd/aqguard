import { useState } from "react";
import { useAtom } from "jotai";
import { isAuthorisedAtom, jobAtom } from "@/lib/atoms";
import { useJobs } from "@/lib/swr-hooks";
import { JobObject } from "@/lib/types";

function LoginScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [job, setJob] = useAtom(jobAtom);
  const [page, setPage] = useState(1);
  const [, setIsAuthorised] = useAtom(isAuthorisedAtom);
  const { jobs } = useJobs();

  // function handleJobCheck() {
  //   let currentJob = jobs?.filter(
  //     (j: JobObject) => j?.reference === job?.reference.toUpperCase()
  //   )[0];
  //   if (!currentJob) {
  //     setError("Job does not exist");
  //     setPin("");
  //   } else {
  //     setError("");
  //     setPage(1);
  //   }
  // }

  // function handlePinEntry(num: number) {
  //   setError("");
  //   if (pin?.length === 3) {
  //     // Final PIN number, do checks
  //     let currentJob = jobs?.filter(
  //       (j: JobObject) => j?.reference === job?.toUpperCase()
  //     )[0];
  //     if (currentJob?.pin === pin + `${num}`) {
  //       // Success!
  //       setIsAuthorised(true);
  //     } else {
  //       // Incorrect PIN
  //       setError("Incorrect PIN");
  //       setPin("");
  //     }
  //   } else {
  //     // Add number to PIN
  //     setPin(pin + `${num}`);
  //   }
  // }

  function handlePinEntry(num: number) {
    setError("");
    if (pin?.length === 3) {
      // Final PIN number, do checks
      let currentJob: JobObject = jobs?.filter((j: JobObject) => {
        console.log(j);
        console.log(pin + `${num}`);
        return j?.pin === pin + `${num}`;
      })[0];
      if (currentJob) {
        // Success!
        setJob(currentJob);
        setIsAuthorised(true);
        setPin("");
      } else {
        // Incorrect PIN
        setError("Incorrect PIN");
        setPin("");
      }
    } else {
      // Add number to PIN
      setPin(pin + `${num}`);
    }
  }

  return (
    <div className="px-8 flex flex-col text-green-600 justify-center">
      <div className="text-2xl font-bold pb-2 mt-16 mb-8 text-center">
        Enter PIN
      </div>
      <div className="grid gap-2 grid-rows-3 grid-cols-3 mt-2 text-3xl font-bold text-center text-white justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, null].map((num) =>
          num !== null ? (
            <div
              className="rounded bg-black py-4 hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
              onClick={() => handlePinEntry(num)}
            >
              {num}
            </div>
          ) : (
            <div />
          )
        )}
      </div>
      <div className="my-4 text-red-200">{error || ""}</div>
      <div className="text-white">{pin}</div>
    </div>
  );
}

export default LoginScreen;

// {page === 0 ? (
//   <>
//     <div className="text-2xl font-bold pb-2 mt-8">
//       Enter Job Reference
//     </div>
//     <input
//       className="text-xl text-black font-bold p-2 uppercase"
//       onChange={(e) => setJob(e.target.value)}
//       value={job}
//       autoFocus
//     />
//     <div className="my-4 text-red-200">{error || ""}</div>
//     <button
//       className="mt-2 bg-yellow-200 rounded-2xl text-black py-4 text-xl font-bold"
//       onClick={handleJobCheck}
//     >
//       NEXT
//     </button>
//   </>
// ) : (
