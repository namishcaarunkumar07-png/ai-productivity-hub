import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader } from "@/components/page-header";
import { useSettings, type Settings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your default email tone, default schedule view and appearance. Preferences stay in your browser.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Default tone, schedule view and appearance for your AI workspace.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update } = useSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Preferences are stored in this browser only. Nothing is sent to a server or linked to an account."
      />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Applied as defaults across the tools.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Label htmlFor="tone">Default email tone</Label>
              <p className="text-sm text-muted-foreground">Pre-selected in Smart Email.</p>
            </div>
            <Select
              value={settings.defaultTone}
              onValueChange={(v) => update({ defaultTone: v as Settings["defaultTone"] })}
            >
              <SelectTrigger id="tone" className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Label htmlFor="range">Default schedule view</Label>
              <p className="text-sm text-muted-foreground">Pre-selected in Task Planner.</p>
            </div>
            <Select
              value={settings.defaultRange}
              onValueChange={(v) => update({ defaultRange: v as Settings["defaultRange"] })}
            >
              <SelectTrigger id="range" className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div>
              <Label htmlFor="dark">Dark mode</Label>
              <p className="text-sm text-muted-foreground">Switch to a low-light interface.</p>
            </div>
            <Switch
              id="dark"
              checked={settings.darkMode}
              onCheckedChange={(checked) => update({ darkMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
