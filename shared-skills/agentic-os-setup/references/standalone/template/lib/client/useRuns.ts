"use client";

import { useEffect, useState } from "react";
import { subscribeRuns, type ClientRun } from "./runs-store";

export function useRuns(): ClientRun[] {
  const [runs, setRuns] = useState<ClientRun[]>([]);
  useEffect(() => subscribeRuns(setRuns), []);
  return runs;
}
