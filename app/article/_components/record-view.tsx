"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/actions/history";

/** Fire-and-forget: records a view (and reading history for signed-in users). */
export default function RecordView({ articleId }: { articleId: string }) {
  useEffect(() => {
    recordView(articleId).catch(() => {});
  }, [articleId]);
  return null;
}
