import React from "react";
import ReactDOM from "react-dom";
import Regulation from "../src/index";
import { Form, Input, Descriptions } from "antd";

function Demo() {
  const testProps = {
    category: "40",
    categoryTable: "insurance_rulSet_ruleBase",
    domain: "product",
    resultOption: [
      {
        label: "这是个数字",
        type: "number",
        code: "1",
      },
      {
        label: "这是个数字区间值",
        type: "numberSection",
        code: "2",
      },
      {
        label: "这是个time时间区间值",
        type: "timeSection",
        code: "3",
      },
      {
        label: "这是个date时间区间值",
        type: "dateSection",
        code: "4",
      },
      {
        label: "这是个datetime时间区间值",
        type: "dateTimeSection",
        code: "5",
      },
      {
        label: "这是个time值",
        type: "time",
        code: "6",
      },
      {
        label: "这是个date值",
        type: "date",
        code: "7",
      },
      {
        label: "这是个datetime值",
        type: "dateTime",
        code: "8",
      },
      {
        label: "这是个字符",
        type: "string",
        code: "9",
      },
      {
        label: "这是个布尔值",
        type: "boolean",
        code: "10",
      },
      {
        label: "这是个枚举值类型",
        type: "enum",
        code: "11",
        options: [
          {
            label: "枚举值1-1",
            value: 1,
          },
          {
            label: "枚举值1-2",
            value: 2,
          },
          {
            label: "枚举值1-3",
            value: 3,
          },
        ],
      },
    ],
    ruleSetName: "R173000",
    rulesVersionId: "PF_1_21_000007",
    sceneCode: "calculatePriceRule",
    sceneCodeTable: "insurance_rulSet_ruleType",
    type: "editRule",
    ruleName: "2",
    basicDom: [
      <Form.Item name="cs1" label="测试1" rules={[{ required: true }]}>
        <Input />
      </Form.Item>,
      <Form.Item name="cs1" label="测试2" rules={[{ required: true }]}>
        <Input />
      </Form.Item>,
      <Form.Item name="cs3" label="测试3" rules={[{ required: true }]}>
        <Input />
      </Form.Item>,
    ],
  };

  const testProps2 = {
    category: "40",
    categoryTable: "insurance_rulSet_ruleBase",
    domain: "product",
    resultOption: [
      {
        label: "这是个数字",
        type: "number",
        code: "1",
      },
      {
        label: "这是个数字区间值",
        type: "numberSection",
        code: "2",
      },
      {
        label: "这是个time时间区间值",
        type: "timeSection",
        code: "3",
      },
      {
        label: "这是个date时间区间值",
        type: "dateSection",
        code: "4",
      },
      {
        label: "这是个datetime时间区间值",
        type: "dateTimeSection",
        code: "5",
      },
      {
        label: "这是个time值",
        type: "time",
        code: "6",
      },
      {
        label: "这是个date值",
        type: "date",
        code: "7",
      },
      {
        label: "这是个datetime值",
        type: "dateTime",
        code: "8",
      },
      {
        label: "这是个字符",
        type: "string",
        code: "9",
      },
      {
        label: "这是个布尔值",
        type: "boolean",
        code: "10",
      },
      {
        label: "这是个枚举值类型",
        type: "enum",
        code: "11",
        options: [
          {
            label: "枚举值1-1",
            value: 1,
          },
          {
            label: "枚举值1-2",
            value: 2,
          },
          {
            label: "枚举值1-3",
            value: 3,
          },
        ],
      },
    ],
    ruleSetName: "R173000",
    rulesVersionId: "PF_1_21_000007",
    sceneCode: "calculatePriceRule",
    sceneCodeTable: "insurance_rulSet_ruleType",
    type: "detailRule",
    ruleName: "2",
    detailDom: [
      <Descriptions.Item label="测试1">测试1</Descriptions.Item>,
      <Descriptions.Item label="测试2">测试2</Descriptions.Item>,
      <Descriptions.Item label="测试3">测试3</Descriptions.Item>,
    ],
  };

  return (
    <div>
      <Regulation {...testProps} />
    </div>
  );
}

ReactDOM.render(<Demo />, document.getElementById("root"));
