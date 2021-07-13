const API_PREFIX: string = '/api/';

const apis = {
  // 开发环境
  beta: {
    // aboss-rule 规则
    rule: `${API_PREFIX}xfhy2imdhhpabl1h/platform/api`,
    regulation: `${API_PREFIX}ae1xvra1rzeprwey/platform/api`,
    // aboss-code 基础代码
    code: `${API_PREFIX}splqphgufd2onz0q/platform/api`,
    // file 导入导出
    file: `${API_PREFIX}avikpnkaqkytc2kl/platform/api`,
    // fanctor 安全域获取因子
    fanctor: `${API_PREFIX}rnsrurz27dxccseu/platform/api`,
  },
  // 测试环境
  test: {
    file: `${API_PREFIX}fkadp3nsfbgxdai0/platform/api`,
    rule: `${API_PREFIX}gfldkyrypws3sbhk/platform/api`,
    regulation: `${API_PREFIX}wevpmhtfdcysfniw/platform/api`,
    code: `${API_PREFIX}ogood1qetly44tdk/platform/api`,
    fanctor: `${API_PREFIX}vp6rcbpmz19eumzc/platform/api`,
  },
  // 预发环境
  preprod: {
    file: `${API_PREFIX}tlrs8dehji56rnk0/platform/api`,
    rule: `${API_PREFIX}cmanqa5pjho5hhe7/platform/api`,
    code: `${API_PREFIX}t8obstqfapfcvf4l/platform/api`,
    fanctor: `${API_PREFIX}pg3qahjk67ervsan/platform/api`,
  },
  // 生产环境
  platformprod: {
    file: `${API_PREFIX}6wfjcbpfhbpmthja/platform/api`,
    rule: `${API_PREFIX}aemrpejvnqvqzzkt/platform/api`,
    code: `${API_PREFIX}0mdstesg7gvyttdb/platform/api`,
    fanctor: `${API_PREFIX}xkkry9pflfipev1m/platform/api`,
  },
  // 验收环境
  platformuat: {
    file: `${API_PREFIX}njdnbkpajk4yvjcd/platform/api`,
    rule: `${API_PREFIX}zjhyav2f5tnjf6bt/platform/api`,
    code: `${API_PREFIX}dczjcjy77oolr5mz/platform/api`,
    fanctor: `${API_PREFIX}4rp6aedv6gg5ikqq/platform/api`,
  },
  // 集成测试
  ft: {
    file: `${API_PREFIX}4is8mtvczahvxwa9/platform/api`,
    rule: `${API_PREFIX}edmhzvgqro316gt6/platform/api`,
    regulation: `${API_PREFIX}rwde81oikunysg00/platform/api`,
    code: `${API_PREFIX}hevxv5hio6hlozf8/platform/api`,
    fanctor: `${API_PREFIX}poblwvbdbkdmk2gw/platform/api`,
  },
};

export default apis[(window as any).lampMeta?.env || 'beta'];
