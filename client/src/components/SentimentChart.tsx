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
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="dag" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Bar dataKey="positief" fill="hsl(var(--chart-3))" name={t("positive")} />
            <Bar dataKey="neutraal" fill="hsl(var(--chart-1))" name={t("neutral")} />
            <Bar dataKey="negatief" fill="hsl(var(--destructive))" name={t("negative")} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
