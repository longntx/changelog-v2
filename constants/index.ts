export enum RESULT_TYPES {
  FOR_DEV = 1,
  FOR_PO = 2,
}

export type TResultType = keyof typeof RESULT_TYPES;
