import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MessageSquare, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MetricsOverview = () => {
  const { t } = useLanguage();
  const metrics = [
    {
      title: t("totalMentions"),
      value: "12,847",
      change: "+15.2%",
      trend: "up",
      icon: MessageSquare,
      color: "text-chart-1",
    },
    {
      title: t("activeCitizens"),
      value: "3,421",
      change: "+8.1%",
      trend: "up",
      icon: Users,
      color: "text-chart-2",
    },
    {
      title: t("positiveSentiment"),
      value: "64%",
      change: "-3.2%",
      trend: "down",
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      title: t("engagementRate"),
      value: "42%",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={metric.trend === "up" ? "text-success" : "text-destructive"}>
                  {metric.change}
                </span>
                <span className="ml-1">{t("vsPreviousWeek")}</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
