import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

export const RecentMentions = () => {
  const { t, language } = useLanguage();
  const mentions = [
    {
      id: 1,
      author: "Jan de Vries",
      platform: "X",
      content: "Geweldig om te zien dat de gemeente eindelijk werk maakt van groenvoorzieningen! 🌳",
      sentiment: "positive",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      topic: "groenvoorziening",
    },
    {
      id: 2,
      author: "Maria Janssen",
      platform: "Facebook",
      content: "Weer files in het centrum. Wanneer komt er een oplossing voor de verkeersproblemen?",
      sentiment: "negative",
      timestamp: new Date(Date.now() - 1000 * 60 * 32),
      topic: "verkeer",
    },
    {
      id: 3,
      author: "Peter Bakker",
      platform: "LinkedIn",
      content: "Mooie ontwikkelingen in de lokale economie. Trots op onze gemeente!",
      sentiment: "positive",
      timestamp: new Date(Date.now() - 1000 * 60 * 47),
      topic: "economie",
    },
    {
      id: 4,
      author: "Sophie Verhoeven",
      platform: "Instagram",
      content: "Leuk evenement afgelopen weekend! Meer van dit soort initiatieven graag 🎉",
      sentiment: "positive",
      timestamp: new Date(Date.now() - 1000 * 60 * 68),
      topic: "evenementen",
    },
    {
      id: 5,
      author: "Thomas van Dijk",
      platform: "X",
      content: "Parkeren is echt een ramp hier. Kan hier iets aan gedaan worden?",
      sentiment: "negative",
      timestamp: new Date(Date.now() - 1000 * 60 * 95),
      topic: "parkeren",
    },
  ];

  const sentimentColors = {
    positive: "bg-success/10 text-success border-success/20",
    negative: "bg-destructive/10 text-destructive border-destructive/20",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  const platformColors = {
    X: "bg-chart-1/10 text-chart-1",
    Facebook: "bg-chart-2/10 text-chart-2",
    LinkedIn: "bg-chart-3/10 text-chart-3",
    Instagram: "bg-chart-4/10 text-chart-4",
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{t("recentMentions")}</CardTitle>
        <CardDescription>{t("recentMentionsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentions.map((mention) => (
          <div key={mention.id} className="flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {mention.author.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{mention.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(mention.timestamp, { 
                      addSuffix: true, 
                      locale: language === "nl" ? nl : enUS 
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={platformColors[mention.platform as keyof typeof platformColors]}>
                    {mention.platform}
                  </Badge>
                  <Badge variant="outline" className={sentimentColors[mention.sentiment as keyof typeof sentimentColors]}>
                    {mention.sentiment === "positive" ? t("positive") : mention.sentiment === "negative" ? t("negative") : t("neutral")}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-foreground">{mention.content}</p>
              <Badge variant="secondary" className="text-xs">
                {mention.topic}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
