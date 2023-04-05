type TRegConvertParams = {
  sourceString: string;
  bitBucketRepoLink: string;
  projectPrefix: string;
};
type TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
}: TRegConvertParams) => string | undefined;
export const regConvert: TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
}) => {
  const regexVariables = generateDefaultVariables(projectPrefix);

  const modifiedSourceString = getModifiedSourceString(
    sourceString,
    bitBucketRepoLink,
    regexVariables,
  );
  const res = processMatches(
    modifiedSourceString,
    regexVariables.regexForReserve,
  );

  return generateFinalRes(res);
};

function extractNumber(str: string) {
  const match = /(-)([0-9]+)/gm.exec(str);
  return match ? Number(match[2]) : null;
}

function generateFinalRes(res: string[]) {
  const regex = /(CMD-[0-9]+)/g;
  const uniqueArr = Array.from(
    new Set(res.map((ele) => ele.match(regex)?.[0])),
  );

  return uniqueArr.reduce((finalRes, ticket) => {
    const groupPrs = res.filter((item) => item.includes(`[${ticket}]`));
    if (groupPrs.length <= 1) return `${finalRes}${groupPrs[0].trim()}\n`;

    const [, ...cloneGroupPRs] = groupPrs;
    const arrayPrUrls = cloneGroupPRs
      .reverse()
      .map((item) => item.match(/\[PR#.+\)/)?.[0] || '');

    return `${finalRes}${groupPrs[0].trim()}, ${arrayPrUrls
      .join(', ')
      .trim()}\n`;
  }, '');
}

function getModifiedSourceString(
  sourceString: string,
  bitBucketRepoLink: string,
  regexVariables: TRegex,
) {
  console.log('-> bitBucketRepoLink', bitBucketRepoLink);
  return sourceString
    .replace(
      regexVariables.regex,
      `* [$1]$3 [PR#$6](${bitBucketRepoLink.trim()}$6)`,
    )
    .replace(regexVariables.regexMultilines, '\n')
    .replace(regexVariables.regexMergin, '');
}

function processMatches(str: string, regexForReserve: any) {
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
  };
};
