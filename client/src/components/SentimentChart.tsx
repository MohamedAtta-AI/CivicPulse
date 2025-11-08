import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

export const SentimentChart = () => {
  const { t, language } = useLanguage();
  const data = [
    { dag: t("monday"), positief: 45, neutraal: 30, negatief: 25 },
    { dag: t("tuesday"), positief: 52, neutraal: 28, negatief: 20 },
    { dag: t("wednesday"), positief: 48, neutraal: 32, negatief: 20 },
    { dag: t("thursday"), positief: 61, neutraal: 25, negatief: 14 },
    { dag: t("friday"), positief: 55, neutraal: 30, negatief: 15 },
    { dag: t("saturday"), positief: 40, neutraal: 35, negatief: 25 },
    { dag: t("sunday"), positief: 38, neutraal: 37, negatief: 25 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("sentimentAnalysis")}</CardTitle>
        <CardDescription>{t("sentimentDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
            <XAxis 
              dataKey="dag" 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="square"
            />
            <Bar 
              dataKey="positief" 
              fill="hsl(142, 71%, 45%)" 
              name={t("positive")}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="neutraal" 
              fill="hsl(var(--chart-1))" 
              name={t("neutral")}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="negatief" 
              fill="hsl(var(--destructive))" 
              name={t("negative")}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
