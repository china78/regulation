import React, { useState, useEffect } from 'react';
import { DetailProps, OptionData } from '../data';
import { selectByType, getUrl, downloadRule } from '../service';
import './index.css';
import { Card, message, Descriptions } from 'antd';
import { ColumnType } from 'antd/lib/table';
import ProTable from '@ant-design/pro-table';
import * as XLSX from 'xlsx';
import { domainList } from './domainList';

const { Item } = Descriptions;

const getMapVlue = (map: { [key: string]: string }): string[] => {
  const valueList: string[] = [];
  Object.values(map).forEach((item: any) => {
    valueList.push(item);
  });
  return valueList;
};

const DetailRule: React.FC<DetailProps> = (props) => {
  const { domain, sceneCode, category, ruleSetName, sceneCodeTable, categoryTable } = props;
  const [ruleModel, setRuleModel] = useState<OptionData[]>();
  const [ruleType, setRuleType] = useState<OptionData[]>();
  const [tableObj, setTableObj] = useState<any>();

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
    selectByType({ types: [sceneCodeTable] }).then((res) => {
      setRuleModel(res?.data[0]?.list);
    });
    selectByType({ types: [categoryTable] }).then((res) => {
      setRuleType(res?.data[0]?.list);
    });
    const rParam = {
      domain,
      sceneCode,
      category,
      ruleSetName,
    };
    downloadRule(rParam).then((res) => {
      parseFile(res?.data?.fileId, res?.data?.serviceCode);
    });
  }, []);

  return (
    <div>
      <Card title="规则信息">
        <Descriptions>
          <Item label="领域">{domainList?.find((item: any) => item.value === domain)?.label}</Item>
          <Item label="一级分类">
            {ruleModel?.find((item: any) => item.code === sceneCode?.toString())?.value}
          </Item>
          <Item label="二级分类">
            {ruleType?.find((item: any) => item.code === category?.toString())?.value}
          </Item>
        </Descriptions>
      </Card>
      <Card title="规则主体" style={{ marginTop: '20px', marginBottom: '80px' }}>
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
            <div className="wrap">没有数据</div>
          )}
      </Card>
    </div>
  );
};

export default DetailRule;
