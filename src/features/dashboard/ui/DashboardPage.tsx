import { useAuth } from '../../../shared/hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-slate-900">Panelss</h1>
      <p className="text-base text-slate-700">Bienvenido{user ? `, ${user.username}` : ''}.</p>
    </div>
  );
}
