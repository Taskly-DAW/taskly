import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, PieChart } from "lucide-react";

export default function ChartSwitcher({ chartType, setChartType }: any) {
  return (
    <div className="flex gap-2">
      <Button variant={chartType === "bar" ? "default" : "outline"} onClick={() => setChartType("bar")}>
        <BarChart3 className="w-4 h-4 mr-1" /> Barras
      </Button>

      <Button variant={chartType === "line" ? "default" : "outline"} onClick={() => setChartType("line")}>
        <LineChart className="w-4 h-4 mr-1" /> Linha
      </Button>

      <Button variant={chartType === "pie" ? "default" : "outline"} onClick={() => setChartType("pie")}>
        <PieChart className="w-4 h-4 mr-1" /> Pizza
      </Button>
    </div>
  );
}
