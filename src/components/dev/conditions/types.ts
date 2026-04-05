export interface ValidationRule {
  field: string;
  rule: string;
  when?: string;
}

export interface DataField {
  field: string;
  type: string;
  example?: string;
  unique?: boolean;
  required?: boolean;
  default?: string | number | boolean;
}

export interface PageCondition {
  page: string;
  path: string;
  description?: string;
  requirements: string[];
  validations: ValidationRule[];
  flow: string[];
  dataModel: DataField[];
}
