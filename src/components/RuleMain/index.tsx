import React, { useEffect, useState } from 'react';
import { getFactor } from '../../service';
import './index.less';
import { Button, Input, Form, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { guid } from '../../utils';
import { operatorMap, OperatorValueCom, relationMap } from './operatorMap';

const { Item } = Form;
const { Option } = Select;

const formField = {
  fanctorOperator: {
    name: 'fanctorOperator',
  },
  fanctorValue: {
    name: 'fanctorValue',
  },
  searchWords: {
    name: 'searchWords',
  },
};
interface RuleMainProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  /** 规则类型 */
  category: string;
  domain: string;
  /** 规则库 */
  sceneCode: string;
  /** 是否为详情模式 */
  detail?: boolean;
}

const RuleMain: React.FC<RuleMainProps> = ({
  value = [],
  onChange,
  domain,
  category,
  sceneCode,
  detail,
}) => {
  const [config, setConfig] = useState({}); // 所有因子
  const [fanctorList, setFanctorList] = useState({}); // 展示的因子
  const [operatingFanctor, setOperatingFanctor] = useState(''); // 正在操作的因子
  const [dragingCard, setDragingCard] = useState<any>(); // 正在拖动的卡片
  const [ruleContentList, setRuleContentList] = useState<any>([]); // 规则配置的内容
  const [form] = Form.useForm();
  const { getFieldsValue, setFieldsValue } = form;
  console.log('domain: ', domain)
  console.log('sceneCode: ', sceneCode)
  console.log('category: ', category)
  // 输入输出数据转换
  const transData = (v: any, transType: string) => {
    const result = v.map((item: any, index: number) => {
      const { type, value: p, valueType, factorCode, operator, compareType, isFunction } = item;
      const rParam = {
        type,
        value: p,
        valueType,
        factorCode,
        operator,
        compareType,
        isFunction,
      };
      if (transType === 'output') {
        return rParam;
      }
      if (transType === 'input') {
        return {
          ...rParam,
          uId: guid(),
          sort: index,
        };
      }
      return null;
    });
    return result;
  };

  useEffect(() => {
    if (domain && category && sceneCode) {
      getFactor({
        businessDivision: [sceneCode, category],
        scope: domain,
        tenant: 1,
      }).then((res) => {
        setConfig(res?.data || {});
        setFanctorList(res?.data || {});
      });
    }
  }, [domain, category, sceneCode]);

  useEffect(() => {
    if (value && JSON.stringify(transData(ruleContentList, 'output')) !== JSON.stringify(value)) {
      setRuleContentList(transData(value, 'input'));
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(transData(ruleContentList, 'output'));
    }
  }, [ruleContentList]);

  const standardOperator = [
    'equal',
    'not_equal',
    'less',
    'less_or_equal',
    'greater',
    'greater_or_equal',
    'select_equals',
    'select_not_equals',
  ];

  // 过滤符合查找条件的因子
  const mapFanctorList = () => {
    const temp = {};
    Object.entries(config).forEach(([key, v]: any) => {
      if (v?.label.includes(getFieldsValue().searchWords) || !getFieldsValue().searchWords) {
        temp[key] = v;
      }
    });
    setFanctorList(temp);
  };

  // 添加规则配置
  const addRule = () => {
    if (
      (operatingFanctor &&
        getFieldsValue().fanctorOperator &&
        (getFieldsValue()?.fanctorValue || getFieldsValue()?.fanctorValue === [false])) ||
      getFieldsValue()?.fanctorOperator === 'is_not_empty' ||
      getFieldsValue()?.fanctorOperator === 'is_empty'
    ) {
      const addParam = {
        type: '3',
        factorCode: operatingFanctor,
        operator: getFieldsValue()?.fanctorOperator,
        value: getFieldsValue()?.fanctorValue || null,
        uId: guid(),
        sort: ruleContentList.length,
        valueType: config[operatingFanctor]?.type,
        compareType: '1',
        isFunction: !standardOperator.includes(getFieldsValue()?.fanctorOperator),
      };
      ruleContentList.push(addParam);
      setRuleContentList([...ruleContentList]);
      return;
    }
    message.error('请先进行完整的规则配置');
  };

  const dragstart = (item: any) => {
    setDragingCard(item);
  };

  const compare = (key: string) => {
    return (obj1: any, obj2: any) => {
      if (obj1[key] < obj2[key]) {
        return -1;
      }
      if (obj1[key] > obj2[key]) {
        return 1;
      }
      return 0;
    };
  };

  const drop = (item: any, ee: any) => {
    ee.preventDefault();
    const data = [...ruleContentList];
    const { sort, uId } = dragingCard;
    const dropedSort = item.sort;
    if (sort < dropedSort) {
      data.map((cardItem: any) => {
        const temp = cardItem;
        if (cardItem.uId === uId) {
          temp.sort = dropedSort;
        } else if (cardItem.sort > sort && cardItem.sort < dropedSort + 1) {
          temp.sort -= 1;
        }
        return temp;
      });
    } else {
      data.map((cardItem: any) => {
        const temp = cardItem;
        if (cardItem.uId === uId) {
          temp.sort = dropedSort;
        } else if (cardItem.sort > dropedSort - 1 && cardItem.sort < sort) {
          temp.sort += 1;
        }
        return temp;
      });
    }
    setRuleContentList([...data.sort(compare('sort'))]);
    setDragingCard(null);
  };

  const addOperator = (v: string[]) => {
    let tempType;
    if (v?.[0] === '(' || v?.[0] === ')') {
      tempType = '1';
    }
    if (v?.[0] === '&&' || v?.[0] === '||') {
      tempType = '2';
    }
    const addParam = {
      type: tempType,
      factorCode: null,
      operator: null,
      value: v,
      uId: guid(),
      sort: ruleContentList.length,
      valueType: null,
      compareType: null,
      isFunction: null,
    };
    ruleContentList.push(addParam);
    setRuleContentList([...ruleContentList]);
  };

  return (
    <Form form={form}>
      <div className="rule-main">
        {!detail && (
          <div className="fanctor-card">
            <div className="fanctor-list-wrap">
              <div className="search-reset-box">
                <Item {...formField.searchWords}>
                  <Input
                    className="search-input"
                    placeholder="请输入过滤关键字"
                    suffix={<SearchOutlined onClick={() => mapFanctorList()} />}
                  />
                </Item>
                <Button
                  className="reset-button"
                  type="primary"
                  onClick={() => {
                    setFieldsValue({ searchWords: undefined });
                    mapFanctorList();
                    setOperatingFanctor('');
                  }}
                >
                  重置
                </Button>
              </div>
              <div className="fanctor-list">
                {Object.entries(fanctorList).map(([key, v]: any) => {
                  if (operatingFanctor === key) {
                    return (
                      <div
                        className="fanctor-list-item-selected"
                        onClick={() => {
                          setOperatingFanctor(key);
                        }}
                      >
                        {v?.label}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="fanctor-list-item"
                      onClick={() => {
                        setOperatingFanctor(key);
                        setFieldsValue({
                          fanctorOperator: undefined,
                          fanctorValue: undefined,
                        });
                      }}
                    >
                      {v?.label}
                    </div>
                  );
                })}
              </div>
            </div>
            {config[operatingFanctor] && (
              <div className="fantor-set-wrap">
                <div className="operating-fantor">{config[operatingFanctor]?.label}</div>
                <Item className="operating-operator" {...formField.fanctorOperator}>
                  <Select
                    placeholder="请选择运算符"
                    onChange={() => {
                      setFieldsValue({
                        fanctorValue: undefined,
                      });
                    }}
                    allowClear
                    children={
                      <>
                        {config[operatingFanctor]?.operators?.map((item: any, index: number) => (
                          <Option value={item} key={`${item}_${index}`}>
                            {operatorMap[item]}
                          </Option>
                        ))}
                      </>
                    }
                  />
                </Item>
                <Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.fanctorOperator !== currentValues.fanctorOperator
                  }
                >
                  {() => (
                    <Item className="operating-value" {...formField.fanctorValue}>
                      <OperatorValueCom
                        operatorType={getFieldsValue().fanctorOperator}
                        fanctorType={config[operatingFanctor].type}
                        preferWidgets={config[operatingFanctor].preferWidgets}
                        fieldSettings={config[operatingFanctor].fieldSettings}
                      />
                    </Item>
                  )}
                </Item>
              </div>
            )}
            {!config[operatingFanctor] && (
              <div className="fantor-set-wrap">
                <div className="operating-nofantor">
                  请点击因子后选择“运算符”和输入“值”组合成为配置
                </div>
              </div>
            )}
          </div>
        )}
        {!detail && (
          <Button type="primary" className="add-button" onClick={() => addRule()}>
            添加配置
          </Button>
        )}
        <div className="rule-edit">
          <div className="relation-select" style={{ pointerEvents: detail ? 'none' : 'auto' }}>
            <div className="relation-item" onClick={() => addOperator(['('])}>
              (
            </div>
            <div className="relation-item" onClick={() => addOperator([')'])}>
              )
            </div>
            <div className="relation-item" onClick={() => addOperator(['||'])}>
              或
            </div>
            <div className="relation-item" onClick={() => addOperator(['&&'])}>
              与
            </div>
          </div>
          <div className="rule-show-wrap">
            {ruleContentList?.map((item: any, index: number) => {
              return (
                <div className="show-item-wrap">
                  <div
                    className={detail ? 'show-item-detail' : 'show-item'}
                    draggable={!detail}
                    id={item.uId}
                    onDragOver={(e: any) => {
                      if (dragingCard.uId === item.uId) {
                        return;
                      }
                      const target: any = document.getElementById(item.uId);
                      if (dragingCard.sort > item.sort) {
                        target.classList.add('drag-left');
                      } else {
                        target.classList.add('drag-right');
                      }
                      e.preventDefault();
                    }}
                    onDragEnter={(e: any) => {
                      if (dragingCard.uId === item.uId) {
                        return;
                      }
                      e.preventDefault();
                      const target: any = document.getElementById(item.uId);

                      if (dragingCard.sort > item.sort) {
                        target.classList.add('drag-left');
                      } else {
                        target.classList.add('drag-right');
                      }
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      const target: any = document.getElementById(item.uId);
                      const div = target.getBoundingClientRect();
                      const x = e.clientX;
                      const y = e.clientY;

                      const divx1 = div.x;
                      const divy1 = div.y;
                      const divx2 = div.x + div.width;
                      const divy2 = div.y + div.height;

                      if (x <= divx1 || x >= divx2 || y <= divy1 || y >= divy2) {
                        target.classList.remove('drag-left', 'drag-right');
                      }
                    }}
                    onDragEnd={() => {
                      const target: any = document.getElementById(item.uId);
                      target.classList.remove('drag-left', 'drag-right');
                      setDragingCard(null);
                    }}
                    onDrop={(e: any) => {
                      const target: any = document.getElementById(item.uId);
                      target.classList.remove('drag-left', 'drag-right');
                      drop(item, e);
                    }}
                    onDragStart={() => dragstart(item)}
                    style={{ zIndex: ruleContentList.length - index }}
                  >
                    <div className="drag-remark"></div>
                    {item.type === '1' && <div className="relation-card">{item.value[0]}</div>}
                    {item.type === '2' && (
                      <div className="relation-card">{relationMap[item.value[0]]}</div>
                    )}
                    {item.type === '3' && (
                      <div className="rule-card">{`【${config?.[item.factorCode]?.label}】 ${operatorMap[item.operator]
                        } ${item?.valueType === 'select'
                          ? item?.value?.map(
                            (v: any) =>
                              config?.[item?.factorCode]?.fieldSettings?.listValues?.find(
                                (option: any) => v === option?.title,
                              )?.value,
                          )
                          : item?.value || ''
                        }`}</div>
                    )}
                    <div className="operate-card">
                      <div className="operate-icon drag-icon" />
                      <div
                        className="operate-icon delete-icon"
                        onClick={() => {
                          ruleContentList.splice(index, 1);
                          setRuleContentList([...ruleContentList]);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {/* {dragingCard && (
              <div className="show-item-wrap">
                <div
                  className="show-item"
                  style={{ zIndex: 999 }}
                  onDrop={dropEnd}
                  onDragOver={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  <div className="rule-card">移动到最后</div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Form>
  );
};

export default RuleMain;
