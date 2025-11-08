import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Topic } from "@/lib/api";

export const TopicsWordCloud = () => {
  const { t } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await api.getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const getSizeClass = (count: number) => {
    if (count > 200) return "text-xl";
    if (count > 150) return "text-lg";
    if (count > 100) return "text-base";
    if (count > 75) return "text-sm";
    return "text-xs";
  };

  const getColorClass = (sentiment: string) => {
    if (sentiment === "positive") return "text-success";
    if (sentiment === "negative") return "text-destructive";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("topicsTitle")}</CardTitle>
          <CardDescription>{t("topicsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 min-h-[180px]">
            <div className="animate-pulse text-muted-foreground">Loading topics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("topicsTitle")}</CardTitle>
        <CardDescription>{t("topicsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 min-h-[180px]">
          {topics.map((topic) => (
            <Badge
              key={topic.text}
              variant="outline"
              className={`${getSizeClass(topic.count)} ${getColorClass(topic.sentiment)} cursor-pointer border-0 bg-secondary/50 px-2 py-1 font-medium transition-all hover:scale-105 hover:bg-secondary`}
            >
              {topic.text}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
