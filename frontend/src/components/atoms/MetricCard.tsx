import { Card, CardContent } from '@/components/ui/card';

export default function MetricCard({ label, value }: any) {
  return (
    <Card className="shadow-sm">
      <CardContent className="text-center py-6">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
