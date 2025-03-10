import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from '../models/sample.model';
import { SampleService } from '../sample.service';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
  title = 'Rule Management';

  ruleForm!: FormGroup;
  rules: Rule[] = [];
  formMode = 'add';
  selectedRuleId: number | null = null;

  sortColumn: string = '';
  sortDirection: string = 'asc';


  filterText: string = '';

  selectedRules: { [key: number]: boolean } = {};
  selectAll: boolean = false;


  typeOptions = ['Match', 'Custom', 'Monitor'];
  yesNoOptions = ['Y', 'N'];

  constructor(
    private formBuilder: FormBuilder,
    private sampleService: SampleService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadRules();
  }

  initForm(rule?: Rule): void {
    this.ruleForm = this.formBuilder.group({
      ruleName: [rule?.ruleName || '', Validators.required],
      active: [rule?.active || 'Y', Validators.required],
      type: [rule?.type || 'Match', Validators.required],
      favourite: [rule?.favourite || 'N', Validators.required],
      scheduled: [rule?.scheduled || 'Y', Validators.required],
      alert: [rule?.alert || 'Y', Validators.required]
    });

    this.formMode = rule ? 'edit' : 'add';
    this.selectedRuleId = rule?.id || null;
  }

  loadRules(): void {
    this.sampleService.getRules().subscribe(rules => {
      this.rules = rules;
      this.selectedRules = {};
      this.selectAll = false;
    });
  }

  onSubmit(): void {
    if (this.ruleForm.invalid) {
      return;
    }

    const formData = this.ruleForm.value;

    if (this.formMode === 'add') {
      this.sampleService.addRule(formData);
      this.resetForm();
    } else if (this.formMode === 'edit' && this.selectedRuleId) {
      const updatedRule: Rule = {
        ...formData,
        id: this.selectedRuleId,
        cratedDate: this.rules.find(r => r.id === this.selectedRuleId)?.cratedDate || ''
      };

      this.sampleService.updateRule(updatedRule);
      this.resetForm();
    }
  }

  editRule(rule: Rule): void {
    this.initForm(rule);
  }

  deleteSelectedRules(): void {
    const selectedIds = Object.keys(this.selectedRules)
      .filter(id => this.selectedRules[parseInt(id)])
      .map(id => parseInt(id));

    if (selectedIds.length === 0) {
      alert('Please select at least one row to delete');
      return;
    }

    this.sampleService.deleteRules(selectedIds);
    this.selectedRules = {};
    this.selectAll = false;
  }

  resetForm(): void {
    this.initForm();
    this.formMode = 'add';
    this.selectedRuleId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }


  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.rules = [...this.rules].sort((a, b) => {
      const aValue = a[column as keyof Rule] ?? '';
      const bValue = b[column as keyof Rule] ?? '';

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }



  applyFilter(): void {
    if (!this.filterText) {
      this.loadRules();
      return;
    }

    this.sampleService.getRules().subscribe(rules => {
      const filterTextLower = this.filterText.toLowerCase();
      this.rules = rules.filter(rule =>
        Object.values(rule).some(value =>
          value !== null && value.toString().toLowerCase().includes(filterTextLower)
        )
      );
    });
  }


  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;

    this.rules.forEach(rule => {
      if (rule.id) {
        this.selectedRules[rule.id] = this.selectAll;
      }
    });
  }

  toggleSelectRule(id: number): void {
    this.selectedRules[id] = !this.selectedRules[id];


    this.selectAll = this.rules.every(rule =>
      rule.id ? this.selectedRules[rule.id] : false
    );
  }

  isSelected(id: number): boolean {
    return this.selectedRules[id] || false;
  }

  getSelectedCount(): number {
    return Object.values(this.selectedRules).filter(selected => selected).length;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'bi bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }




}
