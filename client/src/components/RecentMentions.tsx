import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Mention } from "@/lib/api";

export const RecentMentions = () => {
  const { t, language } = useLanguage();
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentions = async () => {
      try {
        const data = await api.getMentions();
        setMentions(data);
      } catch (error) {
        console.error("Failed to fetch mentions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentions();
  }, []);

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

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{t("recentMentions")}</CardTitle>
          <CardDescription>{t("recentMentionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse text-muted-foreground text-center py-8">Loading mentions...</div>
        </CardContent>
      </Card>
    );
  }

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
                    {formatDistanceToNow(new Date(mention.timestamp), { 
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
