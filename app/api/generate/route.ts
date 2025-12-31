import { NextResponse } from 'next/server';
import { buildWorkflow, GenerationInput } from '@/lib/workflow';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<GenerationInput>;
    const input: GenerationInput = {
      topic: payload.topic ?? '',
      niche: payload.niche ?? '',
      persona: payload.persona ?? '',
      vibe: payload.vibe ?? '',
      targetAudience: payload.targetAudience ?? '',
      callToAction: payload.callToAction ?? '',
      duration: typeof payload.duration === 'number' ? payload.duration : 55
    };

    if (!input.topic.trim()) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const workflow = buildWorkflow(input);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Failed to generate workflow', error);
    return NextResponse.json(
      { error: 'Failed to generate workflow. Please try again.' },
      { status: 500 }
    );
  }
}
