'use client';

import { useMemo, useState } from 'react';
import classNames from 'classnames';
import type { WorkflowResponse } from '@/lib/workflow';

interface FormState {
  topic: string;
  niche: string;
  persona: string;
  vibe: string;
  targetAudience: string;
  callToAction: string;
  duration: number;
}

const DEFAULT_FORM: FormState = {
  topic: 'How to automate a week of Shorts in 60 minutes',
  niche: 'Creator systems',
  persona: 'High-energy creative strategist',
  vibe: 'Punchy, kinetic, data-backed',
  targetAudience: 'Solo content creators hungry for growth',
  callToAction: 'Subscribe for daily AI workflows',
  duration: 55
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generationSummary = useMemo(() => {
    if (!workflow) return null;
    return [
      { label: 'Runtime', value: `${workflow.metadata.runtime}s` },
      { label: 'Hook', value: workflow.metadata.audienceHook },
      { label: 'Title', value: workflow.workflow.publishing.title },
      { label: 'Schedule', value: workflow.workflow.publishing.schedule }
    ];
  }, [workflow]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Failed to generate workflow.');
      }

      const payload = (await response.json()) as WorkflowResponse;
      setWorkflow(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      setWorkflow(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!workflow) return;
    await navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-10 md:flex-row md:gap-12 md:px-12">
      <div className="absolute inset-0 -z-10 blur-3xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-500/10 to-transparent" />
      </div>
      <section className="w-full max-w-md shrink-0 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg md:p-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/70">ShortForge</p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
            AI Workflow Generator for YouTube Shorts
          </h1>
          <p className="text-sm text-white/70">
            Feed the system your concept and it returns a full-stack automation plan―hooks, script beats, assets,
            editing timeline, and publishing checklist.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Topic" hint="The one-liner you want to turn into a short.">
            <textarea
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
              rows={2}
              value={form.topic}
              onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Niche">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
                value={form.niche}
                onChange={(event) => setForm((prev) => ({ ...prev, niche: event.target.value }))}
              />
            </FormField>
            <FormField label="Persona">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
                value={form.persona}
                onChange={(event) => setForm((prev) => ({ ...prev, persona: event.target.value }))}
              />
            </FormField>
          </div>
          <FormField label="Tone / Vibe">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
              value={form.vibe}
              onChange={(event) => setForm((prev) => ({ ...prev, vibe: event.target.value }))}
            />
          </FormField>
          <FormField label="Target Audience">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
              value={form.targetAudience}
              onChange={(event) => setForm((prev) => ({ ...prev, targetAudience: event.target.value }))}
            />
          </FormField>
          <FormField label="Call To Action">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10"
              value={form.callToAction}
              onChange={(event) => setForm((prev) => ({ ...prev, callToAction: event.target.value }))}
            />
          </FormField>
          <FormField label={`Duration Target (${form.duration}s)`} hint="Shorts cap at 60 seconds.">
            <input
              type="range"
              min={35}
              max={65}
              value={form.duration}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, duration: Number.parseInt(event.target.value, 10) }))
              }
              className="w-full accent-cyan-300"
            />
          </FormField>
          {error && <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={classNames(
              'group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition',
              'hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-cyan-200/80 focus:ring-offset-2 focus:ring-offset-slate-950',
              loading && 'opacity-70'
            )}
          >
            {loading ? 'Generating…' : 'Forge Workflow'}
            <span className="transition group-hover:translate-x-1">↗</span>
          </button>
          {workflow && (
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-accent hover:text-accent"
            >
              {copied ? 'Copied JSON ✓' : 'Copy JSON Blueprint'}
            </button>
          )}
        </form>
      </section>

      <section className="flex-1 space-y-6 pb-20">
        {workflow ? (
          <>
            <OverviewPanel summary={generationSummary ?? []} metadata={workflow.metadata.summary} />
            <WorkflowSections data={workflow} />
          </>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}

function FormField({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-white/90">
      <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        {label}
        {hint && <span className="font-normal text-[0.65rem] uppercase tracking-[0.3em] text-white/40">{hint}</span>}
      </p>
      {children}
    </label>
  );
}

function OverviewPanel({ summary, metadata }: { summary: { label: string; value: string }[]; metadata: string }) {
  return (
    <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Launch Snapshot</h2>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Automation Feed</p>
      </header>
      <dl className="grid gap-3 sm:grid-cols-2">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-black/20 p-3 text-white/80 shadow-inner shadow-white/5"
          >
            <dt className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">{item.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm leading-relaxed text-white/70">{metadata}</p>
    </article>
  );
}

function WorkflowSections({ data }: { data: WorkflowResponse }) {
  const workflowData = data.workflow;
  return (
    <div className="space-y-6">
      <SectionCard
        title="Automation Pipeline"
        description="Full-stack chain — from ideation through publishing. Each step includes tooling guidance and prompts ready for your agents."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {workflowData.automationPipeline.map((step) => (
            <div key={step.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                <span>{step.label}</span>
                <span>{step.ownership}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{step.tool}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">{step.prompt}</p>
              <p className="mt-3 text-xs text-white/50">{step.notes}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Segment Blueprint"
        description="Turn-by-turn script beats with visual, motion, and sound design directives."
      >
        <div className="space-y-4">
          {workflowData.contentSegments.map((segment) => (
            <div key={segment.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 md:p-5">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                  {segment.label}
                </span>
                <span className="text-xs font-semibold text-white/70">
                  {segment.timestamp} · {segment.duration}s
                </span>
              </header>
              <p className="mt-3 text-base font-semibold text-white">{segment.narration}</p>
              <div className="mt-4 grid gap-4 text-xs text-white/70 md:grid-cols-3">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">On-screen</p>
                  <ul className="mt-1 space-y-1">
                    {segment.onScreenText.map((line) => (
                      <li key={line} className="rounded-lg bg-white/5 px-2 py-1 text-white/80">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Visuals</p>
                  <ul className="mt-1 space-y-1">
                    {segment.visuals.map((visual) => (
                      <li key={visual} className="rounded-lg bg-white/5 px-2 py-1 text-white/80">
                        {visual}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Motion</p>
                    <p className="rounded-lg bg-white/5 px-2 py-1 text-white/80">{segment.motion}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Sound</p>
                    <p className="rounded-lg bg-white/5 px-2 py-1 text-white/80">{segment.soundDesign}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Audio Direction"
        description="Voice, pacing, and music prompts ready for your synthetic voice stack."
      >
        <ul className="space-y-2 text-sm text-white/80">
          <li>
            <strong className="text-white">Voice:</strong> {workflowData.audioPlan.voiceProfile}
          </li>
          <li>
            <strong className="text-white">Pacing:</strong> {workflowData.audioPlan.pacing}
          </li>
          <li>
            <strong className="text-white">Emphasis:</strong> {workflowData.audioPlan.emphasisBeats.join(' · ')}
          </li>
          <li>
            <strong className="text-white">Music Prompt:</strong> {workflowData.audioPlan.musicPrompt}
          </li>
        </ul>
      </SectionCard>

      <SectionCard
        title="Asset Stack"
        description="Visual identity, overlays, and b-roll prompts your agents can auto-generate."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-sm text-white/80">
            <p>
              <strong className="text-white">Palette:</strong> {workflowData.assetChecklist.colorPalette.join(' · ')}
            </p>
            <p>
              <strong className="text-white">Fonts:</strong> {workflowData.assetChecklist.fonts.join(' + ')}
            </p>
            <p>
              <strong className="text-white">Overlays:</strong>{' '}
              {workflowData.assetChecklist.overlays.join(' • ')}
            </p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p>
              <strong className="text-white">B-roll Prompts:</strong>
            </p>
            <ul className="space-y-1 text-xs text-white/70">
              {workflowData.assetChecklist.brollPrompts.map((prompt) => (
                <li key={prompt} className="rounded-lg bg-white/5 px-2 py-1">
                  {prompt}
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/70">
              <strong className="text-white">SFX:</strong> {workflowData.assetChecklist.sfxLibrary.join(' · ')}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Timeline Blocks"
        description="Drop these markers into your editor for instant structure."
      >
        <div className="space-y-3">
          {workflowData.editingTimeline.map((block) => (
            <div key={block.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{block.label}</span>
                <span className="rounded-lg bg-black/40 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                  {block.start}s → {block.end}s
                </span>
              </header>
              <p className="mt-2 text-xs text-white/60">{block.instructions}</p>
              <p className="mt-2 text-xs text-white/60">
                <strong className="text-white">Shot:</strong> {block.shotType}
              </p>
              <p className="text-xs text-white/60">
                <strong className="text-white">Overlay:</strong> {block.overlay}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Publishing Package"
        description="Metadata and QA to ship confidently."
      >
        <div className="space-y-3 text-sm text-white/80">
          <p>
            <strong className="text-white">Title:</strong> {workflowData.publishing.title}
          </p>
          <div>
            <strong className="text-white">Description:</strong>
            <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-black/40 p-3 text-xs leading-relaxed text-white/70">
              {workflowData.publishing.description}
            </pre>
          </div>
          <p>
            <strong className="text-white">Hashtags:</strong> {workflowData.publishing.hashtags.join(' ')}
          </p>
          <p>
            <strong className="text-white">Schedule:</strong> {workflowData.publishing.schedule}
          </p>
          <p>
            <strong className="text-white">Thumbnail Concept:</strong> {workflowData.publishing.thumbnailConcept}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="QA Checklist" description="Final gate before you push live.">
        <ul className="list-disc space-y-2 pl-6 text-sm text-white/70">
          {workflowData.qaChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/60">{description}</p>
      </header>
      {children}
    </article>
  );
}

function EmptyState() {
  const bullets = [
    'Blueprint your Shorts pipeline in under 10 seconds.',
    'Generate hook, script beats, voice, and b-roll prompts automatically.',
    'Copy/paste-ready prompts for your favorite AI tools.',
    'Designed for Vercel deployment — zero backend configuration.'
  ];

  return (
    <article className="flex h-full flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
      <h2 className="font-display text-2xl font-semibold text-white">Plug in a topic & watch the workflow assemble.</h2>
      <p className="mt-3 text-sm">
        Enter your next Short idea to spin up a complete automation map, tailored to your persona and audience.
      </p>
      <ul className="mt-6 space-y-2 text-sm leading-relaxed">
        {bullets.map((item) => (
          <li key={item} className="rounded-2xl border border-white/5 bg-black/40 px-4 py-2">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
