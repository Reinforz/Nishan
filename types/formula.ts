export interface IFormulaArgsPropertyType {
  type: "property",
  id: string,
  result_type: IFormulaResultType,
  name: string
}

export interface IFormulaArgsConstantType {
  type: "constant",
  result_type: IFormulaResultType,
  value: string
  value_type: IFormulaValueType
}

export type TFormulaArgs = IFormulaArgsPropertyType | IFormulaArgsConstantType;

export interface IFormulaArgsPropertyType {
  type: "property",
  id: string,

}

export type IFormulaName = "if" | "equal";
export type IFormulaResultType = "number" | "checkbox" | "text";
export type IFormulaType = "function" | "property" | "constant";
export type IFormulaValueType = "number" | "string";

export interface IFormula {
  args: TFormulaArgs[],
  name: IFormulaName,
  result_type: IFormulaResultType,
  type: IFormulaType
}