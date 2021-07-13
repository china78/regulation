import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import { InputNumberRang, TimePickerRang, DateRang, EditSwitch } from './formComponents';
import { OptionItem, SelectItem } from '../data';

const { Item } = Form;
const { Option } = Select;

interface RenderFormProps {
  type: string;
  fieldName: any[];
  resultOption: any[];
  resultIndex: number;
  code: string;
}
export const MapRender: React.FC<RenderFormProps> = ({
  type,
  fieldName,
  resultOption,
  resultIndex,
  code,
}: RenderFormProps) => {
  const renderObj = {
    string: (
      <Item name={fieldName} label="字符固定值" rules={[{ required: true }]}>
        <Input placeholder="请输入字符固定值" />
      </Item>
    ),
    number: (
      <Item name={fieldName} label="数字固定值" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入数字固定值" style={{ width: '100%' }} />
      </Item>
    ),
    numberSection: (
      <Item name={fieldName} label="数字区间值" rules={[{ required: true }]}>
        <InputNumberRang />
      </Item>
    ),
    dateTimeSection: (
      <Item name={fieldName} label="时间区间值" rules={[{ required: true }]}>
        <DateRang showTime />
      </Item>
    ),
    dateTime: (
      <Item name={fieldName} label="时间值" rules={[{ required: true }]}>
        <DateRang showTime isSection={false} />
      </Item>
    ),
    date: (
      <Item name={fieldName} label="时间值" rules={[{ required: true }]}>
        <DateRang isSection={false} />
      </Item>
    ),
    dateSection: (
      <Item name={fieldName} label="时间区间值" rules={[{ required: true }]}>
        <DateRang />
      </Item>
    ),
    timeSection: (
      <Item name={fieldName} label="时间区间值" rules={[{ required: true }]}>
        <TimePickerRang />
      </Item>
    ),
    time: (
      <Item name={fieldName} label="时间值" rules={[{ required: true }]}>
        <TimePickerRang isSection={false} />
      </Item>
    ),
    boolean: (
      <Item name={fieldName} initialValue={false} label="布尔值" rules={[{ required: true }]}>
        <EditSwitch />
      </Item>
    ),
    enum: (
      <Item name={fieldName} label="枚举值" rules={[{ required: true }]}>
        <Select placeholder="请输入枚举值">
          {resultOption
            ?.find((item: OptionItem) => item.code === code)
            ?.options?.map((item: SelectItem, optionIndex: number) => {
              return (
                <Option value={item.value} key={`${resultIndex}_${optionIndex}`}>
                  {item?.label}
                </Option>
              );
            })}
        </Select>
      </Item>
    ),
  };
  return renderObj[type] || null;
};
