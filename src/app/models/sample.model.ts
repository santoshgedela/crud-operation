export interface Rule {
    id?: number;
    ruleName: string;
    active: 'Y' | 'N';
    type: 'Match' | 'Custom' | 'Monitor';
    favourite: 'Y' | 'N';
    scheduled: 'Y' | 'N';
    cratedDate: string;
    alert: 'Y' | 'N';
  }