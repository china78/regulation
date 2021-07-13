import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Collapse, Row, Col } from 'antd';
import { DetailProps, OptionItem, OptionData } from '../data';
import { queryRule, selectByType } from '../service';
import { domainList, domainMap } from './domainList';
import './index.css';
import RuleMain from './RuleMain';
import moment from 'moment';

const { Item } = Descriptions;
const { Panel } = Collapse;

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

const DetailRule: React.FC<DetailProps> = (props) => {
  const {
    domain,
    sceneCode,
    category,
    ruleSetName,
    ruleName,
    resultOption,
    sceneCodeTable,
    categoryTable,
    detailDom,
  } = props;

  console.log('详情内部组件', props)

  const [detailData, setDetailData] = useState<any>();
  const [totalData, setTotalData] = useState<any>();
  const [ruleModel, setRuleModel] = useState<OptionData[]>();
  const [ruleType, setRuleType] = useState<OptionData[]>();
  const [activeKey, setActiveKey] = useState<any>([]);
  const [labelList, setLabelList] = useState<any>([]);
  const [outData, setOutData] = useState<any>([]);

  useEffect(() => {
    if (
      domain &&
      sceneCode &&
      // category &&
      // ruleSetName &&
      ruleName &&
      resultOption &&
      sceneCodeTable &&
      categoryTable
    ) {
      selectByType({ types: [sceneCodeTable] }).then((res) => {
        setRuleModel(res?.data[0]?.list);
      });
      selectByType({ types: [categoryTable] }).then((res) => {
        setRuleType(res?.data[0]?.list);
      });
      queryRule({
        domain,
        sceneCode,
        // category,
        ruleName,
        // ruleSetName,
      }).then((res) => {
        // 规则部分
        if (res?.data) {
          setOutData(res?.data?.rules?.find((item: any) => item.editable === 1));
          setDetailData(
            res?.data?.rules
              ?.find((item: any) => item.editable === 1)
              ?.ruleSetList?.find((item: any) => item.editable === 1),
          );
          setTotalData(res?.data);
          const actKey = res?.data?.rules
            ?.find((item: any) => item.editable === 1)
            ?.rhs?.actions[0]?.fieldList?.map((item: any, index: number) => index);
          setActiveKey(actKey);
          setLabelList(res?.data?.rules?.find((item: any) => item.editable === 1)?.lhs?.labelList);
        }
      });
    }
  }, [
    domain,
    sceneCode,
    category,
    ruleSetName,
    ruleName,
    resultOption,
    sceneCodeTable,
    categoryTable,
  ]);

  const onChange = (operatKey: string | string[]) => {
    setActiveKey(operatKey);
  };

  return (
    <div>
      <Card title="规则信息">
        <Descriptions>
          <Item label="领域">
            {domainList?.find(
              (item: any) => item.value === domainMap[detailData?.domain?.toString()],
            )?.label || detailData?.domain?.toString() ||
              domainList.find(item => item.value === domainMap[domain]).label}
          </Item>
          <Item label="一级分类">
            {
              ruleModel?.find((item: any) => item.code === detailData?.sceneCode?.toString())?.value ||
              detailData?.sceneCode?.toString() ||
              ruleModel?.find((item: any) => item.code === sceneCode?.toString())?.value
            }
          </Item>
          {/* <Item label="二级分类">
            {ruleType?.find((item: any) => item.code === detailData?.category?.toString())?.value ||
              detailData?.category?.toString()}
          </Item> */}
          <Item label="有效期">
            {`${moment(outData.startTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(
              outData.endTime,
            ).format('YYYY-MM-DD HH:mm:ss')}`}
          </Item>
          {detailDom}
        </Descriptions>
      </Card>
      <Card title="规则主体" style={{ marginTop: '20px', marginBottom: '80px' }}>
        <p className="card-child-title">
          <span className="card-child-title-border" />
          <span className="card-content">规则设置</span>
        </p>
        <RuleMain
          domain={domainMap[domain]}
          sceneCode={sceneCode}
          category={category}
          value={labelList}
          detail
        />
        <p className="card-child-title" style={{ marginTop: '20px' }}>
          <span className="card-child-title-border" />
          <span className="card-content">结果设置</span>
        </p>
        <Collapse activeKey={activeKey} onChange={onChange}>
          {totalData?.rules
            ?.find((item: any) => item.editable === 1)
            ?.rhs?.actions[0]?.fieldList.map((item: any, index: number) => {
              const fieldName = resultOption.find(
                (option: OptionItem) => option.code === item.field,
              )?.label;
              return (
                <Panel header={`结果${index + 1}`} key={index}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <span style={{ wordWrap: 'break-word' }}>返回结果名称:{fieldName}</span>
                    </Col>
                    <Col span={6}>
                      <span style={{ wordWrap: 'break-word' }}>
                        返回值类型:{valueTypeEnum[item?.valueType]}
                      </span>
                    </Col>
                    <Col span={6}>
                      <span style={{ wordWrap: 'break-word' }}>{`${valueTypeEnum[item?.valueType]
                        }:${item?.value}`}</span>
                    </Col>
                    <Col span={6}>
                      <span style={{ wordWrap: 'break-word' }}>
                        是否可累加: {item?.resultSuperposition === true ? '是' : '否'}
                      </span>
                    </Col>
                  </Row>
                </Panel>
              );
            })}
        </Collapse>
      </Card>
    </div>
  );
};

export default DetailRule;
