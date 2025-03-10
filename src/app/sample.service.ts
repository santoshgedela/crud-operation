import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rule } from '../app/models/sample.model';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  private rules: Rule[] = [
    {
      id: 1,
      ruleName: "2DS - Trace Changes",
      active: "Y",
      type: "Match",
      favourite: "N",
      scheduled: "Y",
      cratedDate: "01-May-2024 01:15 PM",
      alert: "Y"
    }
  ];

  private rulesSubject = new BehaviorSubject<Rule[]>(this.rules);

  constructor() { }

  getRules(): Observable<Rule[]> {
    return this.rulesSubject.asObservable();
  }

  addRule(rule: Rule): void {
    const newRule = {
      ...rule,
      id: this.getNextId(),
      cratedDate: this.formatDate(new Date())
    };

    this.rules.push(newRule);
    this.rulesSubject.next([...this.rules]);
  }

  updateRule(updatedRule: Rule): void {
    const index = this.rules.findIndex(rule => rule.id === updatedRule.id);
    if (index !== -1) {
      this.rules[index] = updatedRule;
      this.rulesSubject.next([...this.rules]);
    }
  }

  deleteRules(ruleIds: number[]): void {
    this.rules = this.rules.filter(rule => !ruleIds.includes(rule.id as number));
    this.rulesSubject.next([...this.rules]);
  }

  private getNextId(): number {
    return this.rules.length > 0
      ? Math.max(...this.rules.map(rule => rule.id || 0)) + 1
      : 1;
  }

  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day < 10 ? '0' + day : day}-${month}-${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

}
