import StatusBadge from '../atoms/StatusBadge';

export default function TasksTable({ tasks }: any) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b">
          <th className="py-3">Nome da Tarefa</th>
          <th>Projeto</th>
          <th>Atribuído a</th>
          <th>Data de Vencimento</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task: any, index: number) => (
          <tr key={index} className="border-b">
            <td className="py-3">{task.nome}</td>
            <td>{task.projeto}</td>
            <td>{task.usuario}</td>
            <td>{task.vencimento}</td>
            <td>
              <StatusBadge status={task.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
