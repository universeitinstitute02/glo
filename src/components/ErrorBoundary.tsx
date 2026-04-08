"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if ((this as any).state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-3xl font-serif font-bold text-slate-900">Something went wrong</h2>
          <p className="mb-8 max-w-md text-slate-500">
            We're sorry for the inconvenience. An unexpected error occurred. 
            {(this as any).state.error?.message && (
              <span className="block mt-2 text-xs font-mono text-slate-400">
                {(this as any).state.error.message.startsWith('{') ? 'Database Error' : (this as any).state.error.message}
              </span>
            )}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-full bg-brand-rose px-8 py-4 font-bold text-white shadow-lg shadow-brand-rose/20 transition-all hover:bg-rose-500 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-5 w-5" /> Refresh Page
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
