import { Card, CardContent } from "@/components/ui/card";
import FiltersRow from "@/components/molecules/FiltersRow";

export default function ReportFiltersCard(props: any) {
  return (
    <Card className="mb-10 shadow-sm">
      <CardContent className="pt-6">
        <FiltersRow {...props} />
      </CardContent>
    </Card>
  );
}
