import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'salary', standalone: true })
export class SalaryPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '—';
    return '$' + value.toLocaleString('en-CA', { minimumFractionDigits: 0 }) + ' CAD';
  }
}