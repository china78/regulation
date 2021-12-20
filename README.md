

### 请求拦截配置

```
config/initialState.ts

import { request } from 'umi';
import { setRuleRequest } from '@lnpm/lampui-regulation';
setRuleRequest(request);

```

### 页面引用

```
import RuleCom from '@lnpm/lampui-regulation';

const testEdit = {
  category: '40',
  categoryTable: 'insurance_rulSet_ruleBase',
  domain: 'product',
  resultOption: [
    {
      label: '这是个数字',
      type: 'number',
      code: '1',
    },
  ],
  ruleSetName: 'R173000',
  rulesVersionId: 'PF_1_21_000007',
  sceneCode: 'calculatePriceRule',
  sceneCodeTable: 'insurance_rulSet_ruleType',
  type: 'editRule',
}

<RuleCom {...testEdit}/>;
```

### 参数

| 字段名称       | 字段含义                           | 是否必填 | 备注                                                       |
| -------------- | ---------------------------------- | -------- | ---------------------------------------------------------- |
| domain         | 领域                               | Y        | domain                                                     |
| sceneCode      | 规则库-模块                        | Y        |                                                            |
| category       | 规则类型                           | Y        |                                                            |
| ruleSetName    | 规则集名称                         | Y        |                                                            |
| resultOption   | 返回结果数组                       | Y        | 各域自己定义需要的返回结果 格式案例详见下 resultOption     |
| type           | 组件使用类型                       | Y        | editRule ｜ detailRule                                     |
| onSubmit       | 点击提交回调                       | N        | (ruleName)=>ruleName 点击提交，调用接口成功后触发          |
｜ touchType     ｜ 是否为触碰型                       ｜ N       |     boolean                                                  |
| onCancel       | 点击取消回调                       | N        | 点击取消后触发                                             |
| ruleName       | 规则名称                           | N        | 新增不传，编辑、详情时必填                                 |
| sceneCodeTable | 规则库-模块在基础代码中对应的 type | N        |                                                            |
| categoryTable  | 规则类型在基础代码中对应的 type    | N        |                                                            |
| basicDom       | 编辑态 Dom 元素                    | N        | [<Form.Item/>,<Form.Item/>],渲染至新增、编辑的规则基础信息 |
| detailDom      | 详情态 Dom 元素                    | N        | [<Description.Item/>,<Description.Item/>] 渲染至详情       |

### domain

| 域名       | 参数             |
| ---------- | ---------------- |
| 安全域     | risk             |
| 支付结算域 | payment          |
| 账务域     | accounts         |
| 交易域     | 4                |
| 产品域     | product          |
| 标的域     | insuredobject    |
| 履约域     | agrmt-execution  |
| 承保域     | undertake        |
| 批改域     | endorse          |
| 营销域     | promotion        |
| 合约域     | contract         |
| 单证域     | document         |
| 客户接触域 | customer-contact |
| 客户域     | customer         |
| 合作开放域 | cooperation      |
| 运营支撑域 | aboss            |
| 保单服务域 | policy           |

### resultTemp

```
resultOption: [
    {
      label: '这是个数字',
      type: 'number',
      code: '1',
    },
    {
      label: '这是个数字区间值',
      type: 'numberSection',
      code: '2',
    },
    {
      label: '这是个time时间区间值',
      type: 'timeSection',
      code: '3',
    },
    {
      label: '这是个date时间区间值',
      type: 'dateSection',
      code: '4',
    },
    {
      label: '这是个datetime时间区间值',
      type: 'dateTimeSection',
      code: '5',
    },
    {
      label: '这是个time值',
      type: 'time',
      code: '6',
    },
    {
      label: '这是个date值',
      type: 'date',
      code: '7',
    },
    {
      label: '这是个datetime值',
      type: 'dateTime',
      code: '8',
    },
    {
      label: '这是个字符',
      type: 'string',
      code: '9',
    },
    {
      label: '这是个布尔值',
      type: 'boolean',
      code: '10',
    },
    {
      label: '这是个枚举值类型',
      type: 'enum',
      code: '11',
      options: [
        {
          label: '枚举值1-1',
          value: 1,
        },
        {
          label: '枚举值1-2',
          value: 2,
        },
        {
          label: '枚举值1-3',
          value: 3,
        },
      ],
    },
  ],
```

### 本地调试 proxy

```
'/api/xfhy2imdhhpabl1h': {
  target: 'http://xfhy2imdhhpabl1h.hzfin.antapigw.aliyuncs.com',
  changeOrigin: true,
  pathRewrite: { '^/api/xfhy2imdhhpabl1h': '' },
},

'/api/ae1xvra1rzeprwey': {
  target: 'http://ae1xvra1rzeprwey.hzfin.antapigw.aliyuncs.com',
  changeOrigin: true,
  pathRewrite: { '^/api/ae1xvra1rzeprwey': '' },
},

'/api/splqphgufd2onz0q': {
  target: 'http://splqphgufd2onz0q.hzfin.antapigw.aliyuncs.com',
  changeOrigin: true,
  pathRewrite: { '^/api/splqphgufd2onz0q': '' },
},

'/api/rnsrurz27dxccseu': {
  target: 'http://rnsrurz27dxccseu.hzfin.antapigw.aliyuncs.com',
  changeOrigin: true,
  pathRewrite: { '^/api/rnsrurz27dxccseu': '' },
},

'/api/avikpnkaqkytc2kl': {
  target: 'http://avikpnkaqkytc2kl.hzfin.antapigw.aliyuncs.com',
  changeOrigin: true,
  pathRewrite: { '^/api/avikpnkaqkytc2kl': '' },
},
```
