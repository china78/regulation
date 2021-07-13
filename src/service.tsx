import umiRequest from "umi-request";
import API_GATEWAY from "./apiGateways";

let request: any = umiRequest;
export const setRuleRequest = (v: any) => {
  request = v;
};

export async function addRule(params: any) {
  return request(`${API_GATEWAY.regulation}/aboss/rule/add-rule`, {
    method: "POST",
    data: { ...params },
  });
}

export async function updateRule(params: any) {
  return request(`${API_GATEWAY.regulation}/aboss/rule/update-rule`, {
    method: "POST",
    data: { ...params },
  });
}

export function enabledRule(params: any) {
  return request(`${API_GATEWAY.regulation}/aboss/rule/enabled-rule`, {
    method: "POST",
    data: { ...params },
  })
}

export async function queryRule(params: any) {
  return request(`${API_GATEWAY.regulation}/aboss/rule/read-rule`, {
    method: "POST",
    data: { ...params },
  });
}

export async function selectByType(params: any) {
  return request(`${API_GATEWAY.code}/aboss/code-basic-code/select-by-type`, {
    method: "POST",
    data: params,
  });
}

export async function getUrl(params: any) {
  return request(`${API_GATEWAY.file}/file/get-file-url`, {
    method: "POST",
    data: { ...params, isBackground: true },
  });
}

export async function getFactor(params: any) {
  return request(`${API_GATEWAY.fanctor}/risk/factor/get-factor-category`, {
    method: "POST",
    data: params,
  });
}

export async function downloadRule(params: any) {
  return request(`${API_GATEWAY.rule}/aboss/rule/download-rule`, {
    method: "POST",
    data: params,
  });
}

export async function uploadRule(params: any) {
  return request(`${API_GATEWAY.rule}/aboss/rule/upload-rule`, {
    method: "POST",
    data: params,
  });
}
