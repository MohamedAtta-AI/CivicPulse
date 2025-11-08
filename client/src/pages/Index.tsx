import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsOverview } from "@/components/MetricsOverview";
import { SentimentChart } from "@/components/SentimentChart";
import { TopicsWordCloud } from "@/components/TopicsWordCloud";
import { SourceBreakdown } from "@/components/SourceBreakdown";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [userRole] = useState<"admin" | "editor" | "reader">("admin");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} />
      
      {/* Banner Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden relative">
        <img 
          src="/Rijswijk_BG.jpg" 
          alt="Rijswijk Street Scene" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("pageTitle")}</h2>
          <p className="text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>



        <div className="flex gap-6 items-stretch">

        <div className="w-96 h-[600px] flex flex-col">
            <div className="sticky top-6 w-full h-full max-h-full">
              <ChatSidebar />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <MetricsOverview />
            
            <div className="grid gap-6 lg:grid-cols-3">
              <SentimentChart />
              <TopicsWordCloud />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
