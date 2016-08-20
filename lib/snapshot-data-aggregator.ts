import {Statistics} from './recorder';

export class SnapshotDataAggregator {
  getCallsPerFunction(data: Statistics) {
    const result = new Map<Function, number>();
    data.forEach((val: any, fn: Function) => {
      result.set(fn, val.length);
    });
    return result;
  }
}

