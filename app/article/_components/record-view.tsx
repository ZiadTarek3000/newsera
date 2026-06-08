"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/actions/history";

export default function RecordView({ articleId }: { articleId: string }) {
  useEffect(() => {
    recordView(articleId).catch(() => {});
  }, [articleId]);
  return null;
}
