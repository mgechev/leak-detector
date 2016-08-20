import {Statistics} from './recorder';
import {SnapshotDataAggregator} from './snapshot-data-aggregator';

export interface SimpleReportRecord {
  callback: Function;
  previousCallsCount: number;
  currentCallsCount: number;
  difference: number;
}

export class SimpleSubscriptionLeakReporter {
  private aggregator = new SnapshotDataAggregator();

  report(newSnapshot: Statistics, oldSnapshot: Statistics) {
    const newData = this.aggregator.getCallsPerFunction(newSnapshot);
    const oldData = this.aggregator.getCallsPerFunction(oldSnapshot);

    const report: SimpleReportRecord[] = [];
    newData.forEach((count: number, fn: Function) => {
      const oldCount = oldData.get(fn) || 0;
      if (oldCount > count) {
        report.push({
          callback: fn,
          currentCallsCount: count,
          previousCallsCount: oldCount,
          difference: count - oldCount
        });
      }
    });

    return report;
  }
}

