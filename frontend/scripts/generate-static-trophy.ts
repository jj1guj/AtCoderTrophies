import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import TrophyFrame from '../src/components/TrophyFrame/TrophyFrame';
import UserInfo from '../src/components/UserInfo/UserInfo';
import {
  DEFAULT_MARGIN_H,
  DEFAULT_MARGIN_W,
  DEFAULT_MAX_COLUMN,
  DEFAULT_MAX_ROW,
  DEFAULT_NO_BACKGROUND,
  DEFAULT_NO_FRAME,
  DEFAULT_PANEL_SIZE,
  DEFAULT_THEME,
} from '../src/constants/default-values';
import { COLORS } from '../src/styles/background-themes';
import AtCoderProblemsAPIClient from '../src/utils/AtCoderProblemsAPIClient/atCoderProblemsAPIClient';

const DEFAULT_OUTPUT_PATH = '../site/atcoder/jj1guj.svg';

function readNumber(name: string, fallback: number): number {
  const value = process.env[name];

  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a number.`);
  }

  return parsed;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];

  if (value === undefined || value === '') {
    return fallback;
  }

  return value === 'true';
}

async function main(): Promise<void> {
  const userName = process.env.ATCODER_USERNAME ?? 'jj1guj';
  const themeName = process.env.TROPHY_THEME ?? DEFAULT_THEME;
  const theme = COLORS[themeName] ?? COLORS.default;
  const outputPath = path.resolve(
    process.cwd(),
    process.env.TROPHY_OUTPUT_PATH ?? DEFAULT_OUTPUT_PATH,
  );

  const atCoderProblemsAPIClient = new AtCoderProblemsAPIClient(userName);
  await atCoderProblemsAPIClient.readAPI();

  if (!atCoderProblemsAPIClient.isValidUserName()) {
    throw new Error(`Could not load statistics for ${userName}.`);
  }

  const trophyFrame = new TrophyFrame(
    [],
    [],
    readNumber('TROPHY_MAX_COLUMN', DEFAULT_MAX_COLUMN),
    readNumber('TROPHY_MAX_ROW', DEFAULT_MAX_ROW),
    DEFAULT_PANEL_SIZE,
    readNumber('TROPHY_MARGIN_W', DEFAULT_MARGIN_W),
    readNumber('TROPHY_MARGIN_H', DEFAULT_MARGIN_H),
    readBoolean('TROPHY_NO_BACKGROUND', DEFAULT_NO_BACKGROUND),
    readBoolean('TROPHY_NO_FRAME', DEFAULT_NO_FRAME),
  );

  const svg = trophyFrame.render(new UserInfo(atCoderProblemsAPIClient), theme).trimStart();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${svg}\n`, 'utf8');

  console.log(`Generated ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
