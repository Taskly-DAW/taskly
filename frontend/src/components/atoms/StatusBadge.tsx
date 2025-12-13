export default function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    Concluído: 'bg-blue-100 text-blue-700',
    'Em Andamento': 'bg-green-100 text-green-700',
    Atrasado: 'bg-red-100 text-red-700',
    'Não Iniciado': 'bg-gray-200 text-gray-700',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}
