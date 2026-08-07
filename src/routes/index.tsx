import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, BookOpen, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A guest-friendly AI workspace: write emails, prioritise tasks and summarise research in seconds.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Write emails, prioritise tasks and summarise research with AI. No signup needed.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email",
    description: "Turn a few notes into a polished, on-tone professional email.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "Task Planner",
    description: "Prioritise your tasks into a clear daily or weekly schedule.",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "Research Assistant",
    description: "Summarise a topic or article into insights and recommendations.",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Welcome to your AI workspace"
        description="Three focused assistants for the everyday writing, planning and reading work. No account, nothing saved — everything stays in this browser session."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="h-full rounded-2xl border-border shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <tool.icon className="size-5" />
                </span>
                <CardTitle className="mt-4 text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Disclaimer />
      </div>
    </div>
  );
}
