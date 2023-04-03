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
  let finalRes = "";
  const res: string[] = [];
  const regexVariables = generateDefaultVariables(projectPrefix);

  const layer0 = sourceString
    .replace(
      regexVariables.regex,
      `* [$1]$3 [PR#$6](` + bitBucketRepoLink.trim() + `$6)`
    )
    .replace(regexVariables.regexMultilines, "\n")
    .replace(regexVariables.regexMergin, "");
  console.log(layer0);
  // tslint:disable-next-line:no-conditional-assignment
  // while ((m = regexVariables.regexForReserve.exec(layer0)) !== null) {
  //   // This is necessary to avoid infinite loops with zero-width matches
  //   if (m.index === regexVariables.regexForReserve.lastIndex) {
  //     regexVariables.regexForReserve.lastIndex++;
  //   }
  //
  //   // The result can be accessed through the `m`-variable.
  //   m.forEach((match, groupIndex) => {
  //     if (match) {
  //       if (res.length === 0) {
  //         res.push(match);
  //       } else {
  //         const temp = this.checkExist(match, res, regexVariables);
  //         if (temp && temp.exist) {
  //           res[temp.index] += ", " + temp.result;
  //         } else {
  //           res.push(match);
  //         }
  //       }
  //     }
  //   });
  // }
  // res.reverse().map((element) => (finalRes += element + "\n"));
  // return finalRes;
  return "";
};

const generateDefaultVariables = (projectPrefix: string) => {
  return {
    regex: new RegExp(
      `(${projectPrefix.trim()}-([0-9]*)):(.*)((.|\\s)*?- #([0-9]*))(.*)`,
      "gm"
    ),
    regexMultilines: /\s\s\s+/gm,
    regexMergin: /^(Merge in)(.*)(.|\s)*/gm,
    regexForReserve: /^\*.*\)/gm,
    regexToCheckDuplicate: new RegExp(
      `(${projectPrefix.trim()}-[0-9]*)(.*)(\\[PR.*\\))`,
      "gm"
    ),
  };
};
