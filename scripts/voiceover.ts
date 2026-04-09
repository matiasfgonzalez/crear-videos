/**
 * Optional: ElevenLabs voiceover generation
 *
 * Call generateVoiceover() per step to produce .mp3 files
 * that Remotion's <Audio> component picks up at render time.
 *
 * Usage: set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in .env
 */
import * as fs from 'fs';
import * as path from 'path';
import { log } from './logger.js';
import { ensureDir } from './utils.js';

interface VoiceoverOptions {
  text: string;
  outputDir: string;
  filename: string;
  voiceId?: string;
  apiKey?: string;
  modelId?: string;
}

/**
 * Generate a voiceover .mp3 for a given text using ElevenLabs API.
 * Returns the path to the generated file, or null if skipped.
 */
export async function generateVoiceover(opts: VoiceoverOptions): Promise<string | null> {
  const apiKey = opts.apiKey ?? process.env.ELEVENLABS_API_KEY;
  const voiceId = opts.voiceId ?? process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || apiKey === 'your_api_key_here') {
    log.warn('ElevenLabs API key not configured — skipping voiceover');
    return null;
  }

  if (!voiceId) {
    log.warn('ElevenLabs voice ID not configured — skipping voiceover');
    return null;
  }

  log.info(`  🎙  Generating voiceover: "${opts.text.slice(0, 50)}..."`);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const body = {
    text: opts.text,
    model_id: opts.modelId ?? 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    log.error(`ElevenLabs API error ${response.status}: ${errorText}`);
    return null;
  }

  ensureDir(opts.outputDir);
  const filePath = path.join(opts.outputDir, opts.filename);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  log.success(`  🎙  Voiceover saved: ${opts.filename}`);
  return filePath;
}

/**
 * Generate voiceovers for all frames that have narration text.
 * Places .mp3 files in outputDir/audio/.
 */
export async function generateAllVoiceovers(
  frames: Array<{ stepName: string; narration?: string; filename: string }>,
  outputDir: string
): Promise<Record<string, string>> {
  const audioDir = path.join(outputDir, 'audio');
  const audioMap: Record<string, string> = {};

  for (const frame of frames) {
    if (!frame.narration) continue;

    const audioFilename = frame.filename.replace('.png', '.mp3');
    const result = await generateVoiceover({
      text: frame.narration,
      outputDir: audioDir,
      filename: audioFilename,
    });

    if (result) {
      audioMap[frame.filename] = `audio/${audioFilename}`;
    }
  }

  return audioMap;
}
