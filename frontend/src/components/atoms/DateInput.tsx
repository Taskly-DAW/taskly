import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

export default function DateInput({ value, onChange }: any) {
  return (
    <div className="relative">
      <Input
        type="date"
        className="pl-10 w-[200px]"
        value={value}
        onChange={onChange}
      />
      <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
    </div>
  );
}
