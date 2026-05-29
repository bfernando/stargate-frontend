'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ApiErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold text-ink">Something went wrong</p>
        <p className="max-w-sm text-sm text-slate-500">{error.message}</p>
        <Button onClick={this.reset}>Try again</Button>
      </div>
    );
  }
}
