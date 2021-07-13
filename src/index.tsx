import React from "react";
import EditRule from "./components/editRule";
import DetailRule from "./components/detailRule";
import EditDecisions from "./components/editDecisions";
import DetailDecisions from "./components/detailDecisions";
import 'antd/lib/collapse/style/index.css';

const Rule: React.FC<any> = (props) => {
  return (
    <div>
      {props?.type === "editRule" && <EditRule {...props} />}
      {props?.type === "detailRule" && <DetailRule {...props} />}
      {props?.type === "editDecisions" && <EditDecisions {...props} />}
      {props?.type === "detailDecisions" && <DetailDecisions {...props} />}
    </div>
  );
};

export { default as RuleForm } from "./components/RuleMain";
export * from "./service";
export default Rule;
