import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader } from "@/components/page-header";
import { generateSchedule } from "@/lib/ai.functions";
import { readSettings, type Settings } from "@/lib/settings";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Enter tasks with deadlines and durations to get a prioritised daily or weekly schedule you can edit.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn a messy task list into a prioritised daily or weekly schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

type TaskRow = { id: string; title: string; deadline: string; duration: string };
type ScheduleItem = {
  title: string;
  slot: string;
  priority: "High" | "Medium" | "Low";
  note: string;
};

const newRow = (): TaskRow => ({
  id: crypto.randomUUID(),
  title: "",
  deadline: "",
  duration: "",
});

const priorityStyles: Record<ScheduleItem["priority"], string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-primary/10 text-primary border-primary/20",
  Low: "bg-muted text-muted-foreground border-border",
};

function PlannerPage() {
  const generate = useServerFn(generateSchedule);
  const [rows, setRows] = useState<TaskRow[]>([newRow()]);
  const [range, setRange] = useState<Settings["defaultRange"]>("Daily");
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRange(readSettings().defaultRange);
  }, []);

  function patchRow(id: string, patch: Partial<TaskRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function patchItem(index: number, patch: Partial<ScheduleItem>) {
    setSchedule((prev) =>
      prev ? prev.map((item, i) => (i === index ? { ...item, ...patch } : item)) : prev,
    );
  }

  async function run() {
    const tasks = rows
      .filter((r) => r.title.trim())
      .map((r) => ({ title: r.title, deadline: r.deadline, duration: r.duration }));
    if (tasks.length === 0) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      const result = await generate({ data: { tasks, range } });
      setSchedule(result.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Task Planner"
        description="List what needs doing. The planner weighs urgency and importance, then lays out a schedule you can adjust."
      />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Your tasks</CardTitle>
          <Tabs value={range} onValueChange={(v) => setRange(v as Settings["defaultRange"])}>
            <TabsList>
              <TabsTrigger value="Daily">Daily</TabsTrigger>
              <TabsTrigger value="Weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]">
              <div className="space-y-1.5">
                {index === 0 && <Label className="text-xs">Task</Label>}
                <Input
                  placeholder="e.g. Finish Q3 report"
                  value={row.title}
                  onChange={(e) => patchRow(row.id, { title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                {index === 0 && <Label className="text-xs">Deadline</Label>}
                <Input
                  placeholder="e.g. Friday"
                  value={row.deadline}
                  onChange={(e) => patchRow(row.id, { deadline: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                {index === 0 && <Label className="text-xs">Duration</Label>}
                <Input
                  placeholder="e.g. 2h"
                  value={row.duration}
                  onChange={(e) => patchRow(row.id, { duration: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove task"
                  onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setRows((prev) => [...prev, newRow()])}>
              <Plus className="size-4" /> Add task
            </Button>
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Planning…" : `Generate ${range.toLowerCase()} schedule`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {schedule && (
        <Card className="mt-6 rounded-2xl shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">{range} schedule</CardTitle>
            <Button variant="outline" size="sm" onClick={run} disabled={loading}>
              <RefreshCw className="size-4" /> Regenerate
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedule.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className={priorityStyles[item.priority]}>
                    {item.priority}
                  </Badge>
                  <Input
                    value={item.slot}
                    onChange={(e) => patchItem(index, { slot: e.target.value })}
                    className="h-8 w-40 text-xs"
                    aria-label="Time slot"
                  />
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => patchItem(index, { title: e.target.value })}
                  className="mt-3 border-0 bg-transparent px-0 text-base font-medium shadow-none focus-visible:ring-0"
                  aria-label="Task title"
                />
                <Input
                  value={item.note}
                  onChange={(e) => patchItem(index, { note: e.target.value })}
                  placeholder="Note"
                  className="mt-1 border-0 bg-transparent px-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0"
                  aria-label="Note"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Every field above is editable — tweak the plan to fit your day.
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
