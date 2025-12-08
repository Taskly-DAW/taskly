import { Button } from "@/components/ui/button";
import DateInput from "../atoms/DateInput";
import SelectBox from "../atoms/SelectBox";
import { RotateCcw, DownloadIcon } from "lucide-react";

export default function FiltersRow({
  startDate, endDate,
  onStart, onEnd,
  projectFilter, userFilter, statusFilter,
  setProjectFilter, setUserFilter, setStatusFilter,
  resetFilters
}: any) {

  return (
    <div className="flex flex-wrap items-end gap-6">

      {/* INICIO */}
      <div className="flex flex-col">
        <p className="font-medium mb-1">Início</p>
        <DateInput value={startDate} onChange={onStart} />
      </div>

      {/* FIM */}
      <div className="flex flex-col">
        <p className="font-medium mb-1">Fim</p>
        <DateInput value={endDate} onChange={onEnd} />
      </div>

      {/* PROJETO */}
      <div className="flex flex-col">
        <p className="font-medium mb-1">Projeto</p>
        <SelectBox
          placeholder="Todos os Projetos"
          items={["Projeto Alpha", "Projeto Beta", "Projeto Gamma", "Projeto Delta"]}
          onChange={setProjectFilter}
        />
      </div>

      {/* USUARIO */}
      <div className="flex flex-col">
        <p className="font-medium mb-1">Usuário</p>
        <SelectBox
          placeholder="Todos os Usuários"
          items={["João Silva","Maria Oliveira","Pedro Souza","Ana Lima","Carlos Alberto"]}
          onChange={setUserFilter}
        />
      </div>

      {/* STATUS */}
      <div className="flex flex-col">
        <p className="font-medium mb-1">Status</p>
        <SelectBox
          placeholder="Todos os Status"
          items={["Concluído","Em Andamento","Atrasado","Não Iniciado"]}
          onChange={setStatusFilter}
        />
      </div>

      {/* BOTOES */}
      <div className="flex items-center gap-3 pb-1">
        <Button className="bg-blue-600 hover:bg-blue-700">Gerar Relatório</Button>
        <Button variant="outline"><DownloadIcon className="w-4 h-4" /></Button>
        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
