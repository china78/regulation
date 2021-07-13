import React from "react";
import {
  Switch,
  InputNumber,
  Row,
  Col,
  Form,
  DatePicker,
  TimePicker,
} from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/zh_CN";

const fullWidth = { width: "100%" };
/** Switch */
interface EditSwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}
export const EditSwitch: React.FC<EditSwitchProps> = ({
  value = false,
  onChange,
}: EditSwitchProps) => {
  return (
    <Switch
      checked={value}
      onChange={(c) => {
        if (onChange) {
          onChange(c);
        }
      }}
    />
  );
};

interface InputNumberRangProps {
  value?: string;
  onChange?: (value: string) => void;
}
export const InputNumberRang: React.FC<InputNumberRangProps> = ({
  value,
  onChange,
}: InputNumberRangProps) => {
  const [form] = Form.useForm();
  let min;
  let max;
  if (value) {
    const valueList = value.split(",");
    min = parseInt(valueList[0], 10) || 0;
    max = parseInt(valueList[1], 10) || 0;
  } else {
    min = 0;
    max = 0;
    if (onChange) {
      onChange("0,0");
    }
  }
  form.setFieldsValue({
    min,
    max,
  });
  return (
    <Form
      form={form}
      onValuesChange={() => {
        form.validateFields().then((res) => {
          if (onChange) {
            onChange(`${res.min},${res.max}`);
          }
        });
      }}
    >
      <Row gutter={8}>
        <Col span={10}>
          <Form.Item name="min" style={{ margin: 0 }}>
            <InputNumber style={fullWidth} value={min} />
          </Form.Item>
        </Col>
        <Col span={4} style={{ textAlign: "center", lineHeight: "32px" }}>
          ~
        </Col>
        <Col span={10}>
          <Form.Item name="max" style={{ margin: 0 }}>
            <InputNumber style={fullWidth} value={max} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

interface DateRangProps {
  value?: string;
  isSection?: boolean;
  showTime?: boolean;
  onChange?: (value: string) => void;
  setFieldsValue?: any;
}
export const DateRang: React.FC<DateRangProps> = ({
  value,
  onChange,
  showTime = false,
  isSection = true,
  setFieldsValue
}: DateRangProps) => {
  if (isSection) {
    const values: any = [];
    if (value) {
      const valueList = value;
      values[0] = moment(valueList[0]);
      values[1] = moment(valueList[1]);
    }
    return (
      <DatePicker.RangePicker
        locale={locale}
        showTime={showTime}
        value={values}
        placeholder={["请选择开始时间", "请选择结束时间"]}
        style={fullWidth}
        onChange={(_, dateString: string[]) => {
          console.log('dateString: ', dateString)
          if (dateString[0] !== '' && dateString[1] !== '') {
            setFieldsValue({
              validity: [
                dateString[0],
                dateString[1]
              ],
            });
          } else {
            setFieldsValue({
              validity: "",
            });
          }
        }}
      />
    );
  }
  return (
    <DatePicker
      locale={locale}
      value={value ? moment(value) : null}
      showTime={showTime}
      placeholder="请选择时间"
      style={fullWidth}
      onChange={(_, dateString: string) => {
        if (onChange) {
          onChange(dateString);
        }
      }}
    />
  );
};

interface TimePickerRangProps {
  value?: string;
  isSection?: boolean;
  onChange?: (value: string) => void;
}
export const TimePickerRang: React.FC<TimePickerRangProps> = ({
  value,
  onChange,
  isSection = true,
}: TimePickerRangProps) => {
  if (isSection) {
    const values: any = [];
    if (value) {
      const valueList = value.split(",");
      values[0] = moment(valueList[0], "HH:mm:ss");
      values[1] = moment(valueList[1], "HH:mm:ss");
    }
    return (
      <TimePicker.RangePicker
        locale={locale}
        style={fullWidth}
        value={values}
        onChange={(_, dateString: string[]) => {
          if (dateString[0] && dateString[1]) {
            if (onChange) {
              onChange(dateString.join(","));
            }
          } else if (onChange) {
            onChange("");
          }
        }}
      />
    );
  }
  return (
    <TimePicker
      locale={locale}
      style={fullWidth}
      value={value ? moment(value, "HH:mm:ss") : null}
      onChange={(_, dateString: string) => {
        if (onChange) {
          onChange(dateString);
        }
      }}
    />
  );
};
