export enum RESULT_TYPES {
  FOR_DEV = 2,
  FOR_PO = 3,
}

export type TResultType = keyof typeof RESULT_TYPES;
