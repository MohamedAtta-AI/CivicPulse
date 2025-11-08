import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const TopicsWordCloud = () => {
  const { t } = useLanguage();
  const topics = [
    { text: "verkeer", count: 245, sentiment: "negative" },
    { text: "groenvoorziening", count: 189, sentiment: "positive" },
    { text: "veiligheid", count: 167, sentiment: "neutral" },
    { text: "parkeren", count: 156, sentiment: "negative" },
    { text: "onderwijs", count: 142, sentiment: "positive" },
    { text: "afval", count: 128, sentiment: "neutral" },
    { text: "evenementen", count: 115, sentiment: "positive" },
    { text: "fietspaden", count: 98, sentiment: "positive" },
    { text: "winkels", count: 87, sentiment: "neutral" },
    { text: "jeugd", count: 76, sentiment: "positive" },
    { text: "bereikbaarheid", count: 72, sentiment: "negative" },
    { text: "speeltuinen", count: 65, sentiment: "positive" },
  ];

  const getSizeClass = (count: number) => {
    if (count > 200) return "text-3xl";
    if (count > 150) return "text-2xl";
    if (count > 100) return "text-xl";
    if (count > 75) return "text-lg";
    return "text-base";
  };

  const getColorClass = (sentiment: string) => {
    if (sentiment === "positive") return "text-success";
    if (sentiment === "negative") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("topicsTitle")}</CardTitle>
        <CardDescription>{t("topicsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          {topics.map((topic) => (
            <Badge
              key={topic.text}
              variant="outline"
              className={`${getSizeClass(topic.count)} ${getColorClass(topic.sentiment)} cursor-pointer border-0 bg-secondary/50 px-3 py-2 font-medium transition-all hover:scale-110 hover:bg-secondary`}
            >
              {topic.text}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
