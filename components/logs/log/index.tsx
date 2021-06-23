import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import ButtonLink from "@/components/button-link";
import Button from "@/components/button";

function Log({ id, date, message }) {
  return (
    <div>
      <div className="flex items-center">
        <Link href={`/entry/${id}`}>
          <a className="font-bold py-2">{date}</a>
        </Link>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Log;
