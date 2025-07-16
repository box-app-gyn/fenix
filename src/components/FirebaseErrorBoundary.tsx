import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FirebaseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔥 Firebase Error Boundary capturou um erro:', error);
    console.error('📋 Stack trace:', errorInfo);

    // Filtrar erros de carteira (MetaMask, TronLink, etc.)
    if (error.message.includes('ethereum')
        || error.message.includes('MetaMask')
        || error.message.includes('TronLink')
        || error.message.includes('TronWeb')) {
      console.log('🔗 Erro de carteira detectado - ignorando...');
      return;
    }

    // Filtrar erros de propriedades undefined
    if (error.message.includes('Cannot read properties of undefined')) {
      console.log('📊 Erro de dados não carregados - ignorando...');
      return;
    }

    // Para outros erros, mostrar a UI de erro
    this.setState({ hasError: true, error });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-xl font-bold mb-2">Ops! Algo deu errado</h1>
            <p className="text-gray-400 mb-4">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="cursor-pointer text-pink-400 hover:text-pink-300">
                  Ver detalhes do erro
                </summary>
                <pre className="text-xs text-gray-500 mt-2 p-2 bg-gray-900 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                🔄 Tentar Novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                🔄 Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
