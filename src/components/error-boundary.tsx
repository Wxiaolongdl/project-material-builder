"use client";

import React from "react";
import { logClientError } from "@/lib/error-logger";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  projectId?: string | null;
  route: string;
  featureKey?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    void logClientError({
      projectId: this.props.projectId,
      route: this.props.route,
      featureKey: this.props.featureKey ?? "react_render",
      errorType: "react_error_boundary",
      error,
      severity: "high",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-[24px] border border-rose-100 bg-white/80 p-6 text-sm text-zinc-600 shadow-sm">
          页面部分内容加载异常，错误摘要已匿名记录。请刷新页面或提交反馈。
        </div>
      );
    }

    return this.props.children;
  }
}
