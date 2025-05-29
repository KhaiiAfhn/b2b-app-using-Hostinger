import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-4 py-2 bg-primary text-primary-foreground shadow-sm">
        {/* Navigation or Logo */}
      </header>
      <main className="flex-1 flex flex-col px-2 sm:px-4 max-w-screen-md w-full mx-auto">
        {children}
      </main>
      <footer className="px-4 py-2 text-xs text-center text-muted bg-muted">
        {/* Footer content */}
      </footer>
    </div>
  );
}