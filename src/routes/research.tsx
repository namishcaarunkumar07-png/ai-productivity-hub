import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader } from "@/components/page-header";
import { generateResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste an article or enter a topic to get a clear summary, key insights and recommendations you can edit.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Summaries, key insights and recommendations from any topic or article.",
      },
    ],
  }),
  component: ResearchPage,
});

type Result = { summary: string; insights: string; recommendations: string };

function ResearchPage() {
  const generate = useServerFn(generateResearch);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!topic.trim()) {
      toast.error("Enter a topic or paste an article first.");
      return;
    }
    setLoading(true);
    try {
      const data = await generate({ data: { topic } });
      setResult({
        summary: data.summary,
        insights: data.insights.map((i) => `• ${i}`).join("\n"),
        recommendations: data.recommendations.map((r) => `• ${r}`).join("\n"),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(
      `Summary\n${result.summary}\n\nKey insights\n${result.insights}\n\nRecommendations\n${result.recommendations}`,
    );
    toast.success("Research copied to clipboard.");
  }

  return (
    <div>
      <PageHeader
        title="AI Research Assistant"
        description="Drop in a topic or a full article and get a plain-language summary with insights and next steps."
      />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Topic or article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic" className="sr-only">
              Topic or article
            </Label>
            <Textarea
              id="topic"
              rows={9}
              placeholder="e.g. 'The impact of hybrid work on team productivity' — or paste an entire article here."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button onClick={run} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Analysing…" : "Generate summary"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6 rounded-2xl shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Results</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={run} disabled={loading}>
                <RefreshCw className="size-4" /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                rows={6}
                value={result.summary}
                onChange={(e) => setResult({ ...result, summary: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insights">Key insights</Label>
              <Textarea
                id="insights"
                rows={6}
                value={result.insights}
                onChange={(e) => setResult({ ...result, insights: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                rows={6}
                value={result.recommendations}
                onChange={(e) => setResult({ ...result, recommendations: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              All three sections are editable before you copy them.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
