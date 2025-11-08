import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { arrayToCSV, downloadFile } from "@/lib/utils";

export const DashboardExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch all dashboard data
      const [metrics, sentiment, topics, sources, mentions, insights] = await Promise.allSettled([
        api.getMetrics(),
        api.getSentiment(),
        api.getTopics(),
        api.getSources().catch(() => []),
        api.getMentions().catch(() => []),
        api.getInsights().catch(() => []),
      ]);

      // Build CSV content with multiple sheets (sections)
      const csvSections: string[] = [];
      const timestamp = new Date().toISOString().split("T")[0];

      // Metrics section
      if (metrics.status === "fulfilled" && metrics.value.length > 0) {
        csvSections.push("=== METRICS ===");
        csvSections.push(arrayToCSV(metrics.value, ["title", "value", "change", "trend", "icon", "color"]));
        csvSections.push("");
      }

      // Sentiment section
      if (sentiment.status === "fulfilled" && sentiment.value.length > 0) {
        csvSections.push("=== SENTIMENT DATA ===");
        csvSections.push(arrayToCSV(sentiment.value, ["day", "positive", "neutral", "negative"]));
        csvSections.push("");
      }

      // Topics section
      if (topics.status === "fulfilled" && topics.value.length > 0) {
        csvSections.push("=== TOPICS ===");
        csvSections.push(arrayToCSV(topics.value, ["text", "count", "sentiment"]));
        csvSections.push("");
      }

      // Sources section
      if (sources.status === "fulfilled" && Array.isArray(sources.value) && sources.value.length > 0) {
        csvSections.push("=== SOURCES ===");
        csvSections.push(arrayToCSV(sources.value, ["name", "value", "color"]));
        csvSections.push("");
      }

      // Mentions section
      if (mentions.status === "fulfilled" && Array.isArray(mentions.value) && mentions.value.length > 0) {
        csvSections.push("=== RECENT MENTIONS ===");
        csvSections.push(arrayToCSV(mentions.value, ["id", "author", "platform", "content", "sentiment", "timestamp", "topic"]));
        csvSections.push("");
      }

      // Insights section
      if (insights.status === "fulfilled" && Array.isArray(insights.value) && insights.value.length > 0) {
        csvSections.push("=== AI INSIGHTS ===");
        csvSections.push(arrayToCSV(insights.value, ["icon", "title", "priority", "description", "advice"]));
        csvSections.push("");
      }

      // Combine all sections
      const csvContent = csvSections.join("\n");

      // Download the file
      const filename = `dashboard-export-${timestamp}.csv`;
      downloadFile(csvContent, filename);
    } catch (error) {
      console.error("Failed to export dashboard data:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleExportData}
      disabled={isExporting}
      title="Export dashboard data"
    >
      {isExporting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Download className="h-5 w-5" />
      )}
    </Button>
  );
};

