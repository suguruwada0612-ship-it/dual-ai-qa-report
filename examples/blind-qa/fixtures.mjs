// This entire fixture is invented for the public sample. No product data is used.
export const source = {
  model: 'FICTIONAL-MODEL-ALPHA',
  internalMemo: 'このメタデータは別評価者へ渡さない。',
  previousAssessment: '先行評価を知らずに評価するため、入力から除外する。',
  cases: [
    {
      sourceId: 'internal-example-one',
      model: 'FICTIONAL-MODEL-ALPHA',
      turns: [{
        input: '架空の読書会の案内を短く書いて。日時と場所は未定のままにして。',
        response: '読書会を開きます。日時・場所は未定です。決まり次第お知らせします。',
        previousScore: 'この評価も別評価者へ渡さない。',
      }],
    },
    {
      sourceId: 'internal-example-two',
      turns: [{
        input: '架空の友人へお礼を短く書いて。今後の約束は加えないで。',
        response: '手伝ってくれてありがとう。来週、お礼にごちそうするね。',
      }],
    },
  ],
};

// Handwritten stand-ins, not results from Codex or another AI.
export const codexRoleReview = {
  assessments: [
    { caseId: 'case-001', criterion: 'constraints', verdict: 'pass', severity: 'none', note: '未定条件を維持している。' },
    { caseId: 'case-001', criterion: 'usability', verdict: 'pass', severity: 'none', note: '短い案内文として使える。' },
    { caseId: 'case-002', criterion: 'constraints', verdict: 'fail', severity: 'low', note: '依頼にない約束があるが、例文の補完として軽く評価した。' },
    { caseId: 'case-002', criterion: 'usability', verdict: 'pass', severity: 'none', note: 'お礼の文章にはなっている。' },
  ],
};

export const separateReviewerRoleReview = {
  assessments: [
    { caseId: 'case-001', criterion: 'constraints', verdict: 'pass', severity: 'none', note: '指定されていない日時や場所を作っていない。' },
    { caseId: 'case-001', criterion: 'usability', verdict: 'pass', severity: 'none', note: '未定部分を残した案内として成立する。' },
    { caseId: 'case-002', criterion: 'constraints', verdict: 'fail', severity: 'medium', note: '約束を加えないという明示条件に反し、意図しない約束として送られるおそれがある。' },
    { caseId: 'case-002', criterion: 'usability', verdict: 'fail', severity: 'medium', note: 'そのまま使うには約束部分の削除が必要。' },
  ],
};
