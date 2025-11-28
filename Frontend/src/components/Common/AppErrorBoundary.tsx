import React, { Component, ReactNode } from "react";
import ErrorScreen from "./ErrorScreen";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by AppErrorBoundary:", error, info);
    // Optionally send to logging service like Sentry
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload(); // or navigate home if using React Router
  };

  handleCancel = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/"; // redirect to home
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          label={this.state.error?.message || "Something went wrong."}
          onRetry={this.handleRetry}
          onCancel={this.handleCancel}
        />
      );
    }

    return this.props.children;
  }
}
