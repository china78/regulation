export interface GetFanctor {
  businessDivision: string[];
  scope: any;
  tenant: number;
}

export interface OptionItem {
  label: string;
  type: string;
  options?: SelectItem[];
  code: string;
}

export interface EditRuleProps {
  /** 规则类型 */
  category: string;
  /** 领域 */
  domain: string;
  /** 规则库-模块 */
  sceneCode: string;
  /** 结果类型 */
  resultOption: OptionItem[];
  /** 规则集名称 */
  ruleSetName: string;
  /** 提交 */
  onSubmit: ({ ruleName: string }) => void;
  /** 取消 */
  onCancel: () => void;
  /** 规则名称 */
  ruleName?: string;
  /** 规则库-模块字典对应type */
  sceneCodeTable: string;
  /** 规则类型字典对应type */
  categoryTable: string;
  /** 基础信息扩展Dom */
  basicDom?: any[];
  /** 是否是触碰型 */
  touchType?: boolean;
  /** 抛出form对象 */
  getForm?: (ruleForm: any) => void;
}

export interface EditDecisionsProps {
  /** 规则类型 */
  category: string;
  /** 领域 */
  domain: string;
  /** 规则库-模块 */
  sceneCode: string;
  /** 规则集名称 */
  ruleSetName: string;
  /** 提交 */
  onSubmit: () => void;
  /** 取消 */
  onCancel: () => void;
  /** 规则名称 */
  ruleName?: string;
  sceneCodeTable: string;
  categoryTable: string;
}

export interface SelectItem {
  label: string;
  value: number;
}

export interface OptionData {
  label: string;
  value: string;
}

export interface DetailProps {
  /** 规则类型 */
  category: string;
  /** 领域 */
  domain: string;
  /** 规则库-模块 */
  sceneCode: string;
  /** 规则集名称 */
  ruleSetName: string;
  /** 规则名称 */
  ruleName: string;
  /** 结果类型 */
  resultOption: OptionItem[];
  sceneCodeTable: string;
  categoryTable: string;
  /** 基础信息扩展Dom */
  detailDom?: any[];
}

export interface RuleProps {
  /** 渲染类型 */
  type: "editRule" | "detailRule" | "editDecisions" | "detailDecisions";
  /** 规则类型 */
  category: string;
  /** 领域 */
  domain: string;
  /** 规则库-模块 */
  sceneCode: string;
  /** 规则集名称 */
  ruleSetName: string;
  /** 规则名称 */
  ruleName?: string;
  /** 结果类型 */
  resultOption?: OptionItem[];
  /** 提交 */
  onSubmit?: () => void;
  /** 取消 */
  onCancel?: () => void;
}

export interface Domains {
  value: string;
  label: string;
}