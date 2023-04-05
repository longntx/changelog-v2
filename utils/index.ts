type TRegConvertParams = {
  sourceString: string;
  bitBucketRepoLink: string;
  projectPrefix: string;
};
type TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
}: TRegConvertParams) => string;
export const regConvert: TRegConvert = ({
  sourceString,
  bitBucketRepoLink,
  projectPrefix,
}): string => {
  let m;
  let finalRes = '';
  const res: string[] = [];
  const regexVariables = generateDefaultVariables(projectPrefix);

  const layer0 = sourceString
    .replace(
      regexVariables.regex,
      `* [$1]$3 [PR#$6](` + bitBucketRepoLink.trim() + `$6)`,
    )
    .replace(regexVariables.regexMultilines, '\n')
    .replace(regexVariables.regexMergin, '');

  console.log('-> layer0', layer0);

  // tslint:disable-next-line:no-conditional-assignment
  while ((m = regexVariables.regexForReserve.exec(layer0)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexVariables.regexForReserve.lastIndex) {
      regexVariables.regexForReserve.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (match) {
        res.push(match);
      }
    });
  }

  res.sort((a: string, b: string) => {
    const extractNumber = (str: string) => {
      const match = /(-)([0-9]+)/gm.exec(str);
      return match ? Number(match[2]) : null;
    };

    const numA = extractNumber(a);
    const numB = extractNumber(b);

    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    return -1;
  });

  console.log('-> res', res);
  // res.reverse().map((element) => (finalRes += element + '\n'));
  // console.log('-> finalRes', finalRes);
  // return finalRes;
  return '';
};

const checkExist = (
  source: string,
  arrayToCheck: Array<string>,
  regexVariables: any,
): {
  exist: boolean;
  index: number;
  duplicate: string;
  result: string;
} => {
  let indexExistPR = -1;
  const regExp = regexVariables.regexToCheckDuplicate;
  regExp.lastIndex = 0;
  const subString = regExp.exec(source);
  if (subString && subString[1]) {
    indexExistPR = arrayToCheck.findIndex((value) =>
      value.includes(`[${subString[1]}]`),
    );
  }
  if (indexExistPR > -1) {
    return {
      exist: true,
      index: indexExistPR,
      duplicate: subString[1],
      result: subString[3],
    };
  }
  return {
    exist: false,
    index: -1,
    duplicate: '',
    result: '',
  };
};

const generateDefaultVariables = (projectPrefix: string) => {
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
