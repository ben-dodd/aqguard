import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { JobObject } from "@/lib/types";

export const isAuthorisedAtom = atom<boolean>(true);
export const jobAtom = atomWithStorage<JobObject>("aqGuard", null);
