import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Copy, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader } from "@/components/page-header";
import { generateEmail } from "@/lib/ai.functions";
import { readSettings, type Settings } from "@/lib/settings";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate a professional email from a recipient, purpose and key points, in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a few notes into a polished professional email with AI.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = Settings["defaultTone"];

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTone(readSettings().defaultTone);
  }, []);

  async function run() {
    if (!purpose.trim() && !keyPoints.trim()) {
      toast.error("Add a purpose or some key information first.");
      return;
    }
    setLoading(true);
    try {
      const result = await generate({
        data: { recipient, purpose, keyPoints, tone },
      });
      setOutput(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard.");
  }

  return (
    <div>
      <PageHeader
        title="Smart Email Generator"
        description="Describe who you're writing to and what matters — get a ready-to-send email you can edit freely."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah, Head of Operations"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Subject / purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a deadline extension"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key information</Label>
              <Textarea
                id="keyPoints"
                rows={6}
                placeholder="Bullet points, dates, numbers, anything that must be mentioned."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Your email</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={run} disabled={loading || !output}>
                <RefreshCw className="size-4" /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={18}
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated email will appear here — fully editable."
              className="resize-y font-normal"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              The output is editable. Adjust anything before sending.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
