import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, SentimentData } from "@/lib/api";

export const SentimentChart = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const sentimentData = await api.getSentiment();
        setData(sentimentData);
      } catch (error) {
        console.error("Failed to fetch sentiment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  const chartData = data.map((item) => ({
    dag: t(item.day as any),
    positief: item.positive,
    neutraal: item.neutral,
    negatief: item.negative,
  }));

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{t("sentimentAnalysis")}</CardTitle>
          <CardDescription>{t("sentimentDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[220px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("sentimentAnalysis")}</CardTitle>
        <CardDescription>{t("sentimentDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
