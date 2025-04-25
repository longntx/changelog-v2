import { RESULT_TYPES } from '@/constants';

type TRegConvertParams = {
  sourceString: string;
  bitBucketRepoLink: string;
  projectPrefix: string;
  type: number;
};
type TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
  type,
}: TRegConvertParams) => string | undefined;

export const regConvert: TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
  type,
}) => {
  const regexVariables = generateDefaultVariables(projectPrefix);

  const modifiedSourceString = getModifiedSourceString(
    sourceString,
    bitBucketRepoLink,
    regexVariables,
    type,
  );
  const res = processMatches(
    modifiedSourceString,
    type === RESULT_TYPES.FOR_DEV
      ? regexVariables.regexForReserve
      : regexVariables.regexTitleOnly,
  );

  const reg = new RegExp(`(${projectPrefix.trim()}-[0-9]+)`, 'g');

  return generateFinalRes(res, reg, type === RESULT_TYPES.FOR_DEV);
};

function extractNumber(str: string) {
  const match = /(-)([0-9]+)/gm.exec(str);
  return match ? Number(match[2]) : null;
}

function generateFinalRes(res: string[], regex: RegExp, join: boolean) {
  const uniqueArr = Array.from(
    new Set(res.map((ele) => ele.match(regex)?.[0])),
  );

  return uniqueArr.reduce((finalRes, ticket) => {
    const groupPrs = res.filter((item) => item.includes(`[${ticket}]`));
    if (join) {
      if (groupPrs.length <= 1) return `${finalRes}${groupPrs[0].trim()}\n`;
      const [, ...cloneGroupPRs] = groupPrs;
      const arrayPrUrls = cloneGroupPRs
        .reverse()
        .map((item) => item.match(/\[PR#.+\)/)?.[0] || '');

      return `${finalRes}${groupPrs[0].trim()}, ${arrayPrUrls
        .join(', ')
        .trim()}\n`;
    }
    return `${finalRes}${groupPrs[0].trim()}\n`;
  }, '');
}

function getModifiedSourceString(
  sourceString: string,
  bitBucketRepoLink: string,
  regexVariables: TRegex,
  type: number,
) {
  const additionalString =
    type === RESULT_TYPES.FOR_DEV
      ? ` [PR#$6](${bitBucketRepoLink.trim()}$6)`
      : '';
  return sourceString
    .replace(regexVariables.regex, `* [$1]$3${additionalString}`)
    .replaceAll(regexVariables.regexMultilines, '\n')
    .replaceAll(regexVariables.regexMergin, '');
}

function processMatches(str: string, regexForReserve: RegExp) {
  let m;
  const res: string[] = [];

  while ((m = regexForReserve.exec(str)) !== null) {
    if (m.index === regexForReserve.lastIndex) regexForReserve.lastIndex++;
    // @ts-ignore
    m.forEach((match) => match && res.push(match));
  }

  return res.sort((a, b) => {
    const numA = extractNumber(a);
    const numB = extractNumber(b);
    return numA !== null && numB !== null ? numA - numB : -1;
  });
}

type TRegex = {
  regexForReserve: RegExp;
  regexToCheckDuplicate: RegExp;
  regex: RegExp;
  regexMultilines: RegExp;
  regexMergin: RegExp;
  regexTitleOnly: RegExp;
};

const generateDefaultVariables = (projectPrefix: string): TRegex => {
  return {
    regex: new RegExp(
      `(${projectPrefix.trim()}-([0-9]*)):(.*)((.|\\s)*?- #([0-9]*))(.*)`,
      'gm',
    ),
    regexMultilines: /\s\s\s+/gm,
    regexMergin: /^(Merged in)(.*)(.|\s)*/gm,
    regexForReserve: /^\*.*\)/gm,
    regexToCheckDuplicate: new RegExp(
      `(${projectPrefix.trim()}-[0-9]*)(.*)(\\[PR.*\\))`,
      'gm',
    ),
    regexTitleOnly: /\*.+/gm,
  };
};

export function parseDailyReport(text: string) {
  // Split the text into lines
  const lines = text.trim().split('\n');

  // Initialize result array
  const result = [];

  // Skip the header row (first line) and process data rows
  for (let i = 1; i < lines.length; i++) {
    // Split the line by commas, trimming whitespace
    const columns = lines[i].split(',').map((col) => col.trim());

    // Ensure the row has enough columns (at least Key and Summary)
    if (columns.length >= 3) {
      const key = columns[1]; // Key is in the second column
      const parent = columns[2];
      const summary = columns[3]; // Summary is in the third column
      const status = columns[4]; // Status is in the fourth column

      // Only add valid entries (non-empty key and summary)
      if (key && summary) {
        result.push(
          `- Parent: ${parent} -> Sub-Task: ${key}: ${summary} (${status})`,
        );
      }
    }
  }

  // Join the results with newlines
  return result.join('\n');
}
