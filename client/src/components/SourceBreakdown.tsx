import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

export const SourceBreakdown = () => {
  const { t } = useLanguage();
  const data = [
    { name: "X (Twitter)", value: 3245, color: "hsl(var(--chart-1))" },
    { name: "Facebook", value: 2891, color: "hsl(var(--chart-2))" },
    { name: "Instagram", value: 2456, color: "hsl(var(--chart-4))" },
    { name: "LinkedIn", value: 1678, color: "hsl(var(--chart-3))" },
    { name: "Nieuwssites", value: 1432, color: "hsl(var(--chart-5))" },
    { name: "Overig", value: 1145, color: "hsl(var(--muted))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sourcesTitle")}</CardTitle>
        <CardDescription>{t("sourcesDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
