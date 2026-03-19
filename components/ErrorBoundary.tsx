import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import '../styles/ErrorBoundary.css';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-wrapper">
                    <div className="error-boundary-content">
                        <div className="error-icon-container">
                            <AlertTriangle size={64} className="text-red-500" strokeWidth={1.5} />
                        </div>

                        <h1 className="error-title">Oops! Something went wrong</h1>

                        <p className="error-message">
                            We're sorry, but an unexpected error occurred while loading this page.
                            Our team has been notified.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="error-details">
                                <p className="error-details-title">Error Details (Dev Only):</p>
                                <code className="error-stack">{this.state.error.message}</code>
                            </div>
                        )}

                        <div className="error-actions">
                            <button
                                onClick={this.handleReset}
                                className="btn-retry"
                            >
                                <RotateCcw size={18} />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="btn-home"
                            >
                                <Home size={18} />
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
