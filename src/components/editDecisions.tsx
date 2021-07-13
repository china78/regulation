import React, { useState, useEffect } from 'react';
import { Form, Col, Input, Row, Card, Button, message, Empty, Select } from 'antd';
import { ColumnType } from 'antd/lib/table';
import ProTable from '@ant-design/pro-table';
import './index.css';
import * as XLSX from 'xlsx';
import BasicOssuploader from '@lnpm/lampui-basic-ossuploader';
import { EditDecisionsProps } from '../data';
import { getFactor, getUrl, selectByType, uploadRule, downloadRule } from '../service';
import { domainList } from './domainList';

const { Item } = Form;
const { Option } = Select;

const formLayoutLeft = {
  xl: { span: 8 },
  xxl: { span: 8 },
  lg: { span: 10 },
  md: { span: 10 },
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
    rules: [{ required: true }],
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
  factorList: {
    name: 'factorList',
    label: '因子列表',
    rules: [{ required: true }],
  },
};

const getMapVlue = (map: Record<string, string>): string[] => {
  const valueList: string[] = [];
  Object.values(map).forEach((item: any) => {
    valueList.push(item);
  });
  return valueList;
};

const EditDecisions: React.FC<EditDecisionsProps> = (props) => {
  const {
    domain,
    sceneCode,
    category,
    ruleSetName,
    onSubmit,
    onCancel,
    sceneCodeTable,
    categoryTable,
  } = props;
  const [form] = Form.useForm();
  const { setFieldsValue } = form;
  const [tableObj, setTableObj] = useState<any>();
  const [factorConfig, setFactorConfig] = useState<any[]>();

  const onFinish = () => {
    form.validateFields().then((values) => {
      if (!tableObj) {
        message.error('请上传规则主体');
        return;
      }
      const rParm = {
        domain,
        sceneCode,
        category,
        ruleSetName,
        fileId: tableObj?.id,
        factorDTOList: values?.factorList?.map((item: any) => {
          return {
            field: factorConfig?.find((factor: any) => factor.value === item)?.value,
            valueType: factorConfig?.find((factor: any) => factor.value === item)?.valueType,
          };
        }),
        serviceCode: '114',
      };
      uploadRule(rParm).then(() => {
        message.success('提交成功');
        onSubmit();
      });
    });
  };

  const parseFile = (fileId: number, serviceCode: string) => {
    getUrl({
      fileIdList: [fileId],
      serviceCode,
    }).then((urlRes: any) => {
      const realUrl = urlRes?.data[0]?.url;
      const xhr = new XMLHttpRequest();
      xhr.open('get', realUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = new Uint8Array(xhr.response);
          const workbook = XLSX.read(data, { type: 'array' });
          try {
            // 获取sheet列表
            const sheetList: any = workbook?.Workbook?.Sheets;
            // 默认处理第一个sheet
            if (sheetList.length > 0) {
              const sheetData: any[] = XLSX.utils.sheet_to_json(
                workbook?.Sheets[sheetList[0]?.name],
              );
              // 处理每一行数据获取CONDITION以及ACTION所在行
              let startIndex = 0;
              let conditionLength = 0;
              let ctionLength = 0;
              const header = ['f1'];
              sheetData.forEach((item: any, index: number) => {
                const valueList: string[] = getMapVlue(item);
                if (valueList.includes('CONDITION') && valueList.includes('ACTION')) {
                  startIndex = index;
                  valueList.forEach((rowValue: string) => {
                    if (rowValue === 'CONDITION') {
                      header.push(`CONDITION${(conditionLength += 1)}`);
                    }
                    if (rowValue === 'ACTION') {
                      header.push(`ACTION${(ctionLength += 1)}`);
                    }
                  });
                }
              });

              const modifyHeaderData: any[] = XLSX.utils
                .sheet_to_json(workbook.Sheets[sheetList[0]?.name], {
                  header,
                })
                .slice(startIndex + 4);
              // 如果没有列配置，结束
              if (modifyHeaderData.length < 1) return;
              const columnsData = modifyHeaderData[0];
              const dataSource = modifyHeaderData.slice(1);
              const columns: ColumnType<{}>[] = [];
              Object.keys(columnsData).forEach((item: any) => {
                if (item !== 'f1') {
                  columns.push({
                    title: modifyHeaderData[0][item],
                    dataIndex: item,
                  });
                }
              });
              setTableObj({
                columns,
                dataSource,
                id: fileId,
              });
            }
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            message.error('文件类型不正确！');
          }
        }
      };
      xhr.send();
    });
  };

  useEffect(() => {
    getFactor({}).then((res) => {
      if (res.data) {
        const tempArr: any[] = [];
        Object.keys(res.data).forEach((item: any) => {
          tempArr.push({
            value: item,
            label: res?.data[item]?.label,
            valueType: res?.data[item]?.type,
          });
        });
        setFactorConfig(tempArr);
      }
    });
    setFieldsValue({
      domain: domainList?.find((item: any) => item.value === domain)?.label || domain,
      ruleSetName,
    });
    selectByType({ types: [sceneCodeTable] }).then((res) => {
      setFieldsValue({
        sceneCode: res?.data[0]?.list?.find((item: any) => item?.code === sceneCode?.toString())
          ?.value,
      });
    });
    selectByType({ types: [categoryTable] }).then((res) => {
      setFieldsValue({
        category: res?.data[0]?.list?.find((item: any) => item?.code === category?.toString())
          ?.value,
      });
    });
    const rParam = {
      domain,
      sceneCode,
      category,
      ruleSetName,
    };
    downloadRule(rParam).then((res) => {
      parseFile(res?.data?.fileId, res?.data?.serviceCode);
      const factorList = res?.data?.factorList?.map((item: any) => item.field);
      setFieldsValue({ factorList });
    });
  }, []);

  const downLoadTemplate = () => {
    getUrl({
      fileIdList: [14145137945609],
      serviceCode: '114',
    }).then((urlRes: any) => {
      const realUrl = urlRes?.data[0]?.url;
      window.open(realUrl);
    });
  };

  const fileChange = ({ file }: any) => {
    if (file.status === 'done') {
      message.success('上传成功');
      parseFile(file.fileId, '114');
    }
  };

  return (
    <Form form={form} layout="vertical" colon onFinish={onFinish} scrollToFirstError>
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
            <Button onClick={() => onFinish()} type="primary">
              提交
            </Button>
          </>
        }
      >
        <Row gutter={24}>
          <Col {...formLayoutLeft}>
            <Item {...formField.domain}>
              <Input placeholder={`请输入${formField.domain?.label}`} disabled />
            </Item>
          </Col>
          <Col {...formLayoutLeft}>
            <Item {...formField.sceneCode}>
              <Input placeholder={`请输入${formField.sceneCode?.label}`} disabled />
            </Item>
          </Col>
          <Col {...formLayoutLeft}>
            <Item {...formField.category}>
              <Input placeholder={`请输入${formField.category?.label}`} disabled />
            </Item>
          </Col>
          <Col {...formLayoutLeft}>
            <Item {...formField.factorList}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder={`请输入${formField.factorList?.label}`}
              >
                {factorConfig?.map((item: any) => (
                  <Option value={item.value}>{item?.label}</Option>
                ))}
              </Select>
            </Item>
          </Col>
          <Col {...formLayoutLeft} style={hideStyle}>
            <Item {...formField.ruleSetName}>
              <Input placeholder={`请输入${formField.ruleSetName?.label}`} disabled />
            </Item>
          </Col>
        </Row>
      </Card>
      <Card
        title="规则主体"
        style={{ marginTop: '20px', marginBottom: '80px' }}
        extra={
          !tableObj ? (
            <Button onClick={downLoadTemplate}>下载模板</Button>
          ) : (
              <div>
                <Button onClick={downLoadTemplate} style={{ marginRight: '10px' }}>
                  下载模板
              </Button>
                <BasicOssuploader
                  key="import"
                  serviceCode="114"
                  onChange={fileChange}
                  accept=".xlsx, .xls"
                  listType="text"
                  showUploadList={false}
                >
                  <Button type="primary">重新导入</Button>
                </BasicOssuploader>
              </div>
            )
        }
      >
        {tableObj ? (
          <ProTable
            rowKey="index"
            bordered
            columns={tableObj?.columns}
            dataSource={tableObj?.dataSource}
            pagination={false}
            search={false}
            options={false}
          />
        ) : (
            <div className="wrap">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <BasicOssuploader
                key="import"
                serviceCode="114"
                onChange={fileChange}
                accept=".xlsx, .xls"
                listType="text"
                showUploadList={false}
              >
                <Button type="primary">导入</Button>
              </BasicOssuploader>
            </div>
          )}
      </Card>
    </Form>
  );
};

export default EditDecisions;
