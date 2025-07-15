// Utilitários para detectar e resolver problemas de carregamento

export interface LoadIssue {
  type: 'layout' | 'stylesheet' | 'script' | 'csp' | 'sourcemap';
  message: string;
  severity: 'warning' | 'error';
  timestamp: number;
}

export class LoadMonitor {
  private issues: LoadIssue[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.monitorLayoutIssues();
    this.monitorCSPIssues();
    this.monitorSourceMapIssues();
  }

  private monitorLayoutIssues() {
    // Monitorar layout shifts
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && (entry as any).value > 0.1) {
              this.addIssue({
                type: 'layout',
                message: `Layout shift detectado: ${(entry as any).value.toFixed(3)}`,
                severity: 'warning',
                timestamp: Date.now()
              });
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('⚠️ Não foi possível monitorar layout shifts:', error);
      }
    }
  }

  private monitorCSPIssues() {
    // Monitorar violações de CSP
    document.addEventListener('securitypolicyviolation', (event) => {
      this.addIssue({
        type: 'csp',
        message: `Violação de CSP: ${event.violatedDirective} - ${event.blockedURI}`,
        severity: 'error',
        timestamp: Date.now()
      });
    });
  }

  private monitorSourceMapIssues() {
    // Interceptar erros de source map
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('source map') || message.includes('.map')) {
        this.addIssue({
          type: 'sourcemap',
          message: `Erro de source map: ${message}`,
          severity: 'warning',
          timestamp: Date.now()
        });
      }
      originalError.apply(console, args);
    };
  }

  private addIssue(issue: LoadIssue) {
    this.issues.push(issue);
    console.warn(`🚨 ${issue.type.toUpperCase()}: ${issue.message}`);
  }

  public getIssues(): LoadIssue[] {
    return [...this.issues];
  }

  public getLoadTime(): number {
    return Date.now() - this.startTime;
  }

  public hasIssues(): boolean {
    return this.issues.length > 0;
  }

  public getIssuesByType(type: LoadIssue['type']): LoadIssue[] {
    return this.issues.filter(issue => issue.type === type);
  }

  public clearIssues(): void {
    this.issues = [];
  }
}

// Função para verificar se há problemas de carregamento
export const checkLoadIssues = (): {
  hasIssues: boolean;
  issues: LoadIssue[];
  loadTime: number;
  recommendations: string[];
} => {
  const monitor = new LoadMonitor();
  const issues = monitor.getIssues();
  const loadTime = monitor.getLoadTime();
  const recommendations: string[] = [];

  // Análise de problemas
  if (loadTime > 3000) {
    recommendations.push('Tempo de carregamento alto - considere otimizar recursos');
  }

  const layoutIssues = issues.filter(i => i.type === 'layout');
  if (layoutIssues.length > 0) {
    recommendations.push('Layout shifts detectados - verifique CSS crítico');
  }

  const cspIssues = issues.filter(i => i.type === 'csp');
  if (cspIssues.length > 0) {
    recommendations.push('Violações de CSP - verifique política de segurança');
  }

  const sourcemapIssues = issues.filter(i => i.type === 'sourcemap');
  if (sourcemapIssues.length > 0) {
    recommendations.push('Erros de source map - verifique configuração do Vite');
  }

  return {
    hasIssues: issues.length > 0,
    issues,
    loadTime,
    recommendations
  };
};

// Função para detectar problemas específicos
export const detectSpecificIssues = (): {
  quirksMode: boolean;
  hasCSP: boolean;
  hasSourceMaps: boolean;
  layoutForced: boolean;
} => {
  const quirksMode = document.compatMode === 'BackCompat';
  const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const hasSourceMaps = document.querySelectorAll('script[src*=".map"]').length > 0;
  const layoutForced = document.readyState === 'loading' && document.body.children.length > 0;

  return {
    quirksMode,
    hasCSP,
    hasSourceMaps,
    layoutForced
  };
}; 