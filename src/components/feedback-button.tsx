"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "@/components/feedback-modal";
import { Button } from "@/components/ui/button";

type FeedbackButtonProps = {
  projectId?: string | null;
  excerpt?: string;
};

export function FeedbackButton({ projectId, excerpt }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-[0_18px_50px_rgba(15,118,110,0.22)]"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="size-4" />
        反馈问题
      </Button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} projectId={projectId} excerpt={excerpt} />
    </>
  );
}
