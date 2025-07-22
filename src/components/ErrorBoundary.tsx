// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';


interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🧨 Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">⚠️ Algo deu errado. Tente novamente mais tarde.</div>;
    }

    return this.props.children;
  }
}
