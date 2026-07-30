import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Without this, a render error unmounts the whole tree and the visitor gets a
 * blank page with nothing to act on. Show the failure and a way out instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Something broke</p>
        <h1 className="mt-6 max-w-xl text-2xl sm:text-3xl" style={{ color: '#E1E0CC' }}>
          This page failed to load.
        </h1>
        <p className="mt-4 max-w-md text-xs text-gray-400 sm:text-sm">
          Reloading usually fixes it. If it keeps happening, the details below help us find
          the cause.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full bg-primary px-5 py-2 text-sm font-medium text-black"
        >
          Reload the page
        </button>
        <pre className="mt-8 max-w-xl overflow-x-auto text-left text-[10px] text-gray-500">
          {error.message}
        </pre>
      </div>
    )
  }
}
