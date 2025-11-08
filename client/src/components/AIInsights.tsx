import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AIInsights = () => {
  const { t } = useLanguage();
  const insights = [
    {
      icon: AlertCircle,
      title: t("trafficIssue"),
      priority: "high",
      description: t("trafficDescription"),
      advice: t("trafficAdvice"),
    },
    {
      icon: TrendingUp,
      title: t("positiveDevelopment"),
      priority: "medium",
      description: t("positiveDescription"),
      advice: t("positiveAdvice"),
    },
    {
      icon: Users,
      title: t("youthEngagement"),
      priority: "medium",
      description: t("youthDescription"),
      advice: t("youthAdvice"),
    },
  ];

  const priorityColors = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-success/10 text-success border-success/20",
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              {t("aiInsightsTitle")}
            </CardTitle>
            <CardDescription>{t("aiInsightsDescription")}</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            {t("exportFullReport")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Alert key={index} className="border-l-4">
              <Icon className="h-4 w-4" />
              <div className="ml-2 flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <AlertDescription className="font-semibold">{insight.title}</AlertDescription>
                  <Badge variant="outline" className={priorityColors[insight.priority as keyof typeof priorityColors]}>
                    {insight.priority === "high" ? t("highPriority") : t("mediumPriority")}
                  </Badge>
                </div>
                <AlertDescription className="mb-2 text-sm">{insight.description}</AlertDescription>
                <AlertDescription className="rounded-md bg-secondary/50 p-3 text-sm">
                  <strong className="text-foreground">{t("recommendation")}:</strong> {insight.advice}
                </AlertDescription>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
