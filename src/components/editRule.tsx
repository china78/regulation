import React, { useState, useEffect } from 'react';
import { Form, Col, Input, Row, Card, Collapse, Select, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { addRule, updateRule, queryRule, selectByType, enabledRule } from '../service';
import { EditRuleProps, OptionItem, Domains } from '../data';
import { domains, dictTypes } from './Constant';
import { MapRender } from './mapRender';
import moment from 'moment';
import { DateRang } from './formComponents';
import './index.css';
import { domainList, domainMap } from './domainList';
import RuleMain from './RuleMain';
import { EditSwitch } from './formComponents';

const { Item } = Form;
const { Panel } = Collapse;
const { Option } = Select;

const formLayoutTop = {
  xl: { span: 8 },
  xxl: { span: 8 },
  lg: { span: 10 },
  md: { span: 10 },
  sm: 24,
  xs: 24,
};

const formLayoutLeft = {
  xl: { span: 6 },
  xxl: { span: 6 },
  lg: { span: 6 },
  md: { span: 6 },
  sm: 24,
  xs: 24,
};

const hideStyle = {
  display: 'none',
};

const formField = {
  category: {
    name: 'category',
    label: '二级分类',
    rules: [{ required: true }],
  },
  ruleSetName: {
    name: 'ruleSetName',
    label: '规则集名称',
    // rules: [{ required: true }],
  },
  domain: {
    name: 'domain',
    label: '领域',
    rules: [{ required: true }],
  },
  sceneCode: {
    name: 'sceneCode',
    label: '一级分类',
    rules: [{ required: true }],
  },
  ruleName: {
    name: 'ruleName',
    label: '规则名称',
    rules: [{ required: true }],
  },
  validity: {
    name: 'validity',
    label: '规则有效期',
  },
  labelList: {
    name: 'labelList',
  },
};

const valueTypeEnum = {
  string: '字符固定值',
  number: '数字固定值',
  numberSection: '数字区间值',
  time: '时间值',
  date: '时间值',
  dateTime: '时间值',
  timeSection: '时间区间值',
  dateSection: '时间区间值',
  dateTimeSection: '时间区间值',
  boolean: '布尔值',
  enum: '枚举值',
};

const EditRule: React.FC<EditRuleProps> = (props) => {
  const {
    domain,
    sceneCode,
    category,
    ruleSetName,
    resultOption,
    onSubmit,
    onCancel,
    ruleName,
    sceneCodeTable,
    categoryTable,
    basicDom,
    touchType,
    getForm,
  } = props;
  console.log('props: ', props)

  const [form] = Form.useForm();
  const { setFieldsValue, getFieldsValue } = form;
  const [activeKey, setActiveKey] = useState<any>([]);
  const [resultArray, setResultArray] = useState<number[]>([]);
  const [haveArgs, setHaveArgs] = useState<boolean>(false);
  const [dictList, setDictList] = useState<any>([]);
  const [oneLevel, setOneLevel] = useState<any>([]);
  const [twoLevel, setTwoLevel] = useState<any>([]);
  const [domainHandle, setDomainHandle] = useState<string>('');
  const [categoryHandle, setCategoryHandle] = useState<string>('');
  const [sceneCodeHandle, setSceneCodeHandle] = useState<string>('');

  // 格式化
  const formatProData = (dictData: any, options?: any, which?: number): any => {
    const proData = dictData.map(v => ({
      value: v.code || (options?.value && v[options?.value]),
      label: v.value || (options?.label && v[options?.label])
    }))
    console.log('一级数据: ', proData)
    which === 1 ? setOneLevel(proData) : setTwoLevel(proData)
  }

  // 依据一级value获取二级数据
  const getProDataByParent = (
    type: string,
    parentCode: string,
    status?: any
  ) => {
    if (dictList) {
      const item = dictList.filter((v) => v.type === type);
      if (item.length > 0) {
        const { list } = item[0];
        const dictData = list.filter((i) => i.parentCode === parentCode);
        const proData: any = formatProData(dictData, { status }, 2);
        return proData;
      }
    }
    return null;
  }
  // 先拉取全量数据 再获取一级数据
  const fetchOneLevelData = async (type: string, parentCode: string, status?: any) => {
    const { data } = await selectByType({ types: dictTypes })
    if (data && data.length > 0) {
      const dictList: any[] = [];
      data.forEach((elem: any) => {
        const { type, typeName, list } = elem;
        dictList.push({
          type,
          typeName,
          list,
        });
      });
      setDictList(dictList)
      console.log('全量数据: ', dictList)
      const item = dictList.filter((v) => v.type === type);
      if (item.length > 0) {
        const { list } = item[0];
        const dictData = list.filter((i) => i.parentCode === parentCode);
        const proData: any = formatProData(dictData, { status }, 1);
        return proData;
      }
    }
  }

  // 一级下拉的onChange事件
  const oneLevelOnChange = (value: string) => {
    console.log('一级选中value:', value)
    setSceneCodeHandle(value)
    getProDataByParent('buss_category', value);
  }

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        try {
          if (!values.fieldList) {
            message.error('请设置返回结果');
            return;
          }
          if (values.labelList.length === 0) {
            message.error('请配置相关规则');
            return;
          }
          console.log('values:::: ', values);
          let attributes;
          // 如果是数组的话
          if (values?.validity === '' || values?.validity === undefined) {
            attributes = [
              {
                name: 'date-effective',
                value: '',
              },
              { name: 'date-expires', value: '' },
            ];
          } else if (values?.validity?.constructor == Array) {
            attributes = [
              {
                name: 'date-effective',
                value: values?.validity?.[0],
              },
              { name: 'date-expires', value: values?.validity?.[1] },
            ];
          } else {
            // 是字符串
            if (values?.validity?.split(',')[0] && values?.validity?.split(',')[1]) {
              attributes = [
                {
                  name: 'date-effective',
                  value: values?.validity?.split(',')[0],
                },
                { name: 'date-expires', value: values?.validity?.split(',')[1] },
              ];
            }
          }

          const rparam = {
            domain: domain || values.domain,
            sceneCode: sceneCode || values.sceneCode,
            category: category || values.category,
            ruleSetName,
            startTime: attributes[0].value,
            endTime: attributes[1].value,
            rules: [
              {
                ruleName: values?.ruleName,
                // attributes,
                lhs: {
                  labelList: values?.labelList,
                },
                rhs: {
                  actions: [
                    {
                      fieldList: values?.fieldList ? Object.values(values?.fieldList) : undefined,
                    },
                  ],
                },
              },
            ],
          };
          console.log('rparam: ', rparam);

          const doEnabledRule = async () => {
            const { status } = await enabledRule({
              domain: rparam.domain,
              sceneCode: rparam.sceneCode,
              ruleNames: [values?.ruleName]
            })
            status === 1 ? message.success('生效成功') : message.error('生效失败')
            // callback 提醒外部组件
            getForm({
              feedBack: true
            })
          }

          if (ruleName) {
            updateRule(rparam).then(() => {
              message.success('修改成功');
              onSubmit?.({ ...values });
              // 让规则生效
              doEnabledRule()
            });
          } else {
            addRule(rparam).then(() => {
              message.success('新增成功');
              onSubmit?.({ ...values });
              // 让规则生效
              doEnabledRule()
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        // 将不符合rules的展开
        error?.errorFields?.forEach((item: { errors: string[]; name: string[] }) => {
          item.name.forEach((nameString: string) => {
            if (nameString === 'value' || nameString === 'field' || nameString === 'valueType') {
              const errorKey = item?.name[1];
              setActiveKey((tempActiveKey: string[]) => _.uniq(tempActiveKey.concat(errorKey)));
            }
          });
        });
      });
  };

  const changeResultName = (value: string, resultItem: string) => {
    const typeValue = resultOption.find((item: OptionItem) => item.code === value)?.type;
    const formvalue = {
      fieldList: {
        [resultItem]: {
          valueType: typeValue,
          value: undefined,
          resultSuperposition: false,
        },
      },
    };
    setFieldsValue(formvalue);
  };

  useEffect(() => {
    if (domain && sceneCode && category) {
      setHaveArgs(true)
    }
    // if (ruleSetName && resultOption?.length) {
    setFieldsValue({
      domain: domainList?.find((item: any) => item.value === domainMap[domain])?.label || domain,
      ruleSetName,
      ruleName,
    });
    selectByType({ types: [sceneCodeTable] }).then((res: any) => {
      console.log('一级分类: ', res)
      setFieldsValue({
        sceneCode:
          res?.data?.[0]?.list?.find((item: any) => item?.code === sceneCode?.toString())
            ?.value || sceneCode,
      });
    });
    selectByType({ types: [categoryTable] }).then((res: any) => {
      setFieldsValue({
        category:
          res?.data?.[0]?.list?.find((item: any) => item?.code === category?.toString())?.value ||
          category,
      });
    });
    if (ruleName) {
      // 传了ruleName则为修改
      queryRule({
        domain,
        sceneCode,
        category,
        ruleName,
        ruleSetName,
      }).then((res) => {
        // 回填详情
        if (res?.data?.rules) {
          const tempResultArray: any = [];
          const tempFieldList: any = res?.data?.rules
            ?.find((item: any) => item.editable === 1)
            ?.rhs?.actions[0]?.fieldList?.map((item: any) => {
              const randomKey = Math.random();
              tempResultArray.push(randomKey);
              return item;
            });
          setResultArray(tempResultArray);
          setActiveKey(tempResultArray);

          // 返回结果部分
          const formvalue = {
            fieldList: {},
          };
          tempResultArray.forEach((item: any, index: number) => {
            formvalue.fieldList[item] = {
              valueType: tempFieldList[index].valueType,
              value: tempFieldList[index].value,
              field: tempFieldList[index].field,
              resultSuperposition: tempFieldList[index].resultSuperposition || false,
            };
          });

          // 有initValue则覆盖掉
          resultOption.forEach((resultItem: any) => {
            if (resultItem.initValue) {
              Object.entries(formvalue.fieldList)?.forEach(([fieldKey, fieldItem]: any) => {
                if (fieldItem.field === resultItem.code) {
                  formvalue.fieldList[fieldKey] = {
                    value: resultItem.initValue,
                    field: resultItem.code,
                    valueType: resultItem.type,
                  };
                }
              });
            }
          });

          setFieldsValue({
            validity: [
              moment(res?.data?.rules?.find((item: any) => item.editable === 1).startTime).format(
                'YYYY-MM-D hh:mm:ss',
              ),
              moment(res?.data?.rules?.find((item: any) => item.editable === 1).endTime).format(
                'YYYY-MM-D hh:mm:ss',
              ),
            ],
            labelList: res?.data?.rules?.find((item: any) => item.editable === 1)?.lhs?.labelList,
            ...formvalue,
          });
        }
      });
    }
    // }
    // 不管传不传参数, 都获取一级分类数据
    fetchOneLevelData('buss_category', '-1')
  }, [
    domain,
    sceneCode,
    category,
    ruleSetName,
    resultOption,
    onSubmit,
    onCancel,
    ruleName,
    sceneCodeTable,
    categoryTable,
  ]);

  useEffect(() => {
    getForm && getForm({ ruleForm: form });
  }, [getForm]);

  const onChange = (operatKey: string | string[]) => {
    setActiveKey(operatKey);
  };
  return (
    <Form form={form} layout="vertical" onFinish={() => onFinish()}>
      <Card
        title="规则信息"
        extra={
          <>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                onCancel();
              }}
            >
              取消
            </Button>
            <Button onClick={() => form.submit()} type="primary">
              提交
            </Button>
          </>
        }
      >
        <Row gutter={24}>
          {/* 领域 */}
          <Col {...formLayoutTop}>
            <Item {...formField.domain}>
              <Select
                placeholder={`请选择${formField.domain?.label}`}
                disabled={haveArgs}
                onChange={(values: string) => setDomainHandle(values)}
              >
                {
                  domains.map((item: Domains, index: number) => (
                    <Option value={item.value} key={index}>
                      {item?.label}
                    </Option>
                  ))
                }
              </Select>
            </Item>
          </Col>
          {/* 一级分类-规则库模块 */}
          <Col {...formLayoutTop}>
            <Item {...formField.sceneCode}>
              <Select
                value={sceneCode}
                placeholder={`请选择${formField.sceneCode?.label}`}
                disabled={haveArgs}
                onChange={oneLevelOnChange}
              >
                {
                  oneLevel.map((item: any, index: number) => (
                    <Option value={item.value} key={index}>
                      {item?.label}
                    </Option>
                  ))
                }
              </Select>
            </Item>
          </Col>
          {/* 二级分类-规则类型 */}
          <Col {...formLayoutTop}>
            <Item {...formField.category}>
              <Select
                placeholder={`请选择${formField.category?.label}`}
                disabled={haveArgs}
                onChange={(values: string) => setCategoryHandle(values)}
              >
                {
                  twoLevel.map((item: any, index: number) => (
                    <Option value={item.value} key={index}>
                      {item?.label}
                    </Option>
                  ))
                }
              </Select>
            </Item>
          </Col>
          <Col {...formLayoutTop} style={hideStyle}>
            <Item {...formField.ruleSetName}>
              <Input placeholder={`请输入${formField.ruleSetName?.label}`} />
            </Item>
          </Col>
          <Col {...formLayoutTop}>
            <Item {...formField.ruleName}>
              <Input placeholder={`请输入${formField.ruleName?.label}`} disabled={!!ruleName} />
            </Item>
          </Col>
          <Col {...formLayoutTop}>
            <Item {...formField.validity}>
              <DateRang showTime setFieldsValue={setFieldsValue} />
            </Item>
          </Col>
          {basicDom?.map((item: any) => (
            <Col {...formLayoutTop}>{item}</Col>
          ))}
        </Row>
      </Card>
      <Card title="规则主体" style={{ marginTop: '20px', marginBottom: '80px' }}>
        <p className="card-child-title">
          <span className="card-child-title-border" />
          <span className="card-content">规则设置</span>
        </p>
        <div style={{ marginBottom: '24px' }}>
          <Item {...formField.labelList}>
            <RuleMain
              domain={domainMap[domain] || domainMap[domainHandle]}
              sceneCode={sceneCode || sceneCodeHandle}
              category={category || categoryHandle}
            />
          </Item>
        </div>

        {/* 结果设置 如果是触碰型 结果设置不展示 */}
        <div style={{ display: touchType ? 'none' : 'block' }}>
          <p className="card-child-title">
            <span className="card-child-title-border" />
            <span className="card-content">结果设置</span>
          </p>
          {resultArray?.length > 0 && (
            <Collapse activeKey={activeKey} onChange={onChange}>
              {resultArray.map((resultItem: any, resultIndex: number) => (
                <Panel
                  header={`结果${resultIndex}`}
                  key={resultItem}
                  extra={
                    <a
                      onClick={() => {
                        resultArray.splice(resultIndex, 1);
                        setResultArray(resultArray);
                      }}
                    >
                      删除
                  </a>
                  }
                >
                  <Row gutter={24}>
                    <Col {...formLayoutLeft}>
                      <Item
                        name={['fieldList', `${resultItem}`, 'field']}
                        label="返回结果名称"
                        rules={[{ required: true }]}
                      >
                        <Select
                          placeholder="请选择返回结果名称"
                          onChange={(v: string) => changeResultName(v, resultItem)}
                        >
                          {resultOption.map((item: OptionItem, index: number) => (
                            <Option value={item.code} key={`${item}_${index}`}>
                              {item?.label}
                            </Option>
                          ))}
                        </Select>
                      </Item>
                    </Col>
                    <Col {...formLayoutLeft}>
                      <Item
                        name={['fieldList', `${resultItem}`, 'valueType']}
                        label="返回值类型"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="请选择返回值类型" disabled>
                          {Object.keys(valueTypeEnum).map((item: any, index: number) => {
                            return (
                              <Option value={item} key={`${item}_${index}`}>
                                {valueTypeEnum[item]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Item>
                    </Col>
                    <Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        JSON.stringify(prevValues) !== JSON.stringify(currentValues)
                      }
                    >
                      {() => {
                        const type = getFieldsValue()?.fieldList?.[resultItem]?.valueType;
                        if (!type) {
                          return null;
                        }
                        const fieldName = ['fieldList', `${resultItem}`, 'value'];
                        return (
                          <Col {...formLayoutLeft}>
                            <MapRender
                              type={type}
                              fieldName={fieldName}
                              resultOption={resultOption}
                              resultIndex={resultIndex}
                              code={getFieldsValue().fieldList[resultItem]?.field}
                            />
                          </Col>
                        );
                      }}
                    </Item>
                    <Col {...formLayoutLeft}>
                      <Item
                        name={['fieldList', `${resultItem}`, 'resultSuperposition']}
                        label="是否可累加"
                        rules={[{ required: true }]}
                        initialValue={false}
                      >
                        <EditSwitch />
                      </Item>
                    </Col>
                  </Row>
                </Panel>
              ))}
            </Collapse>
          )}

          <Button
            type="dashed"
            onClick={() => {
              const randomKey = Math.random();
              setResultArray(resultArray.concat([randomKey]));
              setActiveKey(activeKey.concat([randomKey]));
            }}
            style={{ width: '100%', marginTop: '20px' }}
          >
            <PlusOutlined /> 新增
        </Button>
        </div>
        {/* 结果设置  */}
      </Card>
    </Form>
  );
};

export default EditRule;
