import { Input, Select, InputNumber } from 'antd';
import { InputNumberRang, TimePickerRang, DateRang, EditSwitch } from './addFormComponents';
import React from 'react';

const { Option } = Select;

// 因子所带符号转渲染
export const operatorMap = {
  equal: '=',
  not_equal: '!=',
  like: '相似',
  not_like: '不相似',
  starts_with: '以此开头',
  ends_with: '以此结尾',
  is_not_empty: '不为空',
  is_empty: '为空',
  less: '<',
  less_or_equal: '<=',
  greater: '>',
  greater_or_equal: '>=',
  between: '区间内',
  not_between: '区间外',
  select_any_in: '存在于',
  select_not_any_in: '不存在于',
  select_equals: '=',
  select_not_equals: '!=',
};
// 关系符映射
export const relationMap = {
  '||': '或',
  '&&': '与',
};
interface RenderFormProps {
  operatorType: string;
  fanctorType: string;
  preferWidgets: string;
  value?: any;
  onChange?: (value: any) => void;
  fieldSettings: any;
}
export const OperatorValueCom: React.FC<RenderFormProps> = ({
  operatorType,
  fanctorType,
  preferWidgets,
  value,
  onChange,
  fieldSettings,
}) => {
  const renderOneItem = [
    'equal',
    'not_equal',
    'like',
    'not_like',
    'starts_with',
    'ends_with',
    'less',
    'less_or_equal',
    'greater',
    'greater_or_equal',
    'select_any_in',
    'select_not_any_in',
    'select_equals',
    'select_not_equals',
  ];
  const renderTwoItem = ['between', 'not_between'];
  if (fanctorType === 'text') {
    if (renderOneItem.includes(operatorType)) {
      return (
        <Input
          placeholder="请输入字符固定值"
          onChange={(e) => {
            if (onChange) {
              onChange([e.target.value]);
            }
          }}
          value={value?.[0]}
        />
      );
    }
  }
  if (fanctorType === 'number') {
    if (renderOneItem.includes(operatorType)) {
      return (
        <InputNumber
          placeholder="请输入数字固定值"
          style={{ width: '100%' }}
          onChange={(v) => {
            if (onChange) {
              onChange([v]);
            }
          }}
          value={value?.[0]}
        />
      );
    }
    if (renderTwoItem.includes(operatorType)) {
      return <InputNumberRang onChange={onChange} value={value} />;
    }
  }
  if (fanctorType === 'date') {
    if (renderOneItem.includes(operatorType)) {
      return <DateRang isSection={false} onChange={onChange} value={value} />;
    }
    if (renderTwoItem.includes(operatorType)) {
      return <DateRang onChange={onChange} value={value} />;
    }
  }
  if (fanctorType === 'time') {
    if (renderOneItem.includes(operatorType)) {
      return <TimePickerRang isSection={false} onChange={onChange} value={value} />;
    }
    if (renderTwoItem.includes(operatorType)) {
      return <TimePickerRang onChange={onChange} value={value} />;
    }
  }
  if (fanctorType === 'datetime') {
    if (renderOneItem.includes(operatorType)) {
      return <DateRang showTime isSection={false} onChange={onChange} value={value} />;
    }
    if (renderTwoItem.includes(operatorType)) {
      return <DateRang showTime onChange={onChange} value={value} />;
    }
  }
  if (fanctorType === 'boolean') {
    if (renderOneItem.includes(operatorType)) {
      return <EditSwitch onChange={onChange} value={value} />;
    }
  }
  if (fanctorType === 'select') {
    if (preferWidgets[0] === 'select') {
      return (
        <Select
          placeholder="请输入枚举值"
          onChange={(v) => {
            if (onChange) {
              onChange([v]);
            }
          }}
          value={value?.[0]}
        >
          {fieldSettings?.listValues?.map((item: { value: string; title: string }) => (
            <Option value={item.title}>{item.value}</Option>
          ))}
        </Select>
      );
    }
    if (preferWidgets[0] === 'multiselect') {
      return (
        <Select placeholder="请输入枚举值" mode="multiple" onChange={onChange} value={value}>
          {fieldSettings?.listValues?.map((item: { value: string; title: string }) => (
            <Option value={item.title}>{item.value}</Option>
          ))}
        </Select>
      );
    }
  }
  return null;
};
