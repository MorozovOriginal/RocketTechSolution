import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Enhanced system error detection
    const isSystemError = error && (
      (error.message && (
        error.message.includes('getPage') ||
        error.message.includes('response timed out') ||
        error.message.includes('timeout after') ||
        error.message.includes('ChunkLoadError') ||
        error.message.includes('Loading chunk') ||
        /getPage\s*\(id:\s*\d+\)/.test(error.message)
      )) ||
      (error.name && (
        error.name.includes('ChunkLoadError') ||
        error.name.includes('TimeoutError')
      )) ||
      (error.toString && (
        error.toString().includes('getPage') ||
        error.toString().includes('timeout')
      ))
    );

    if (isSystemError) {
      console.warn('System error detected - not showing error boundary:', error.message || error.toString());
      return { hasError: false };
    }
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced system timeout detection
    const isSystemTimeout = error && (
      (error.message && (
        error.message.includes('getPage') ||
        error.message.includes('response timed out') ||
        error.message.includes('timeout after') ||
        /getPage\s*\(id:\s*\d+\)/.test(error.message)
      )) ||
      (error.toString && (
        error.toString().includes('getPage') ||
        error.toString().includes('timeout')
      ))
    );

    if (isSystemTimeout) {
      console.warn('System timeout detected in ErrorBoundary:', error.message || error.toString());
      return;
    }
    
    console.error('ErrorBoundary caught a user-facing error:', error, errorInfo);
    
    // Log additional details for debugging
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-[#BBFF2C] rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="text-[#040725] font-mono font-black text-2xl">!</div>
            </div>
            <h1 className="text-2xl font-bold text-[#040725] mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're experiencing technical difficulties. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#BBFF2C] text-[#040725] px-6 py-2 rounded-lg hover:bg-[#a3e024] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;