import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SACC',
};

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">SACC</h1>
        <p className="text-slate-600 mt-2">Sistema de Alertas Contábeis Cast</p>
        <p className="text-slate-500 text-sm mt-4">Carregando...</p>
      </div>
    </main>
  );
}
