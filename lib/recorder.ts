import {Subscriber} from 'rxjs/Subscriber';

interface CallbackCall {
  time: Date;
  timeMargin: number;
}

export type Statistics = Map<Function, CallbackCall[]>;

export class Recorder {
  private currentStatistics: Statistics;
  private recordingStartedAt: Date;
  private _recording: boolean = false;

  constructor() {
    this.initialize();
    (<any>Subscriber.prototype)._next = function (value: any) {
      this.destination.next(value);
      if (this._recording) {
        this.incrementCalls(this.destination._next);
      }
    };
  }

  get recording() {
    return this._recording;
  }

  startRecording() {
    if (!this._recording) {
      this._recording = true;
      this.recordingStartedAt = new Date();
    }
  }

  reset() {
    this._recording = false;
    this.recordingStartedAt = null;
  }

  takeSnapshot() {
    if (!this._recording) {
      throw new Error('To take a snapshot you have to been recording first');
    }
    const snapshot = new Map<Function, CallbackCall[]>();
    this.currentStatistics.forEach((val: CallbackCall[], key: Function) => {
      snapshot.set(key, val);
    });
    return snapshot;
  }

  private incrementCalls(fn: Function) {
    const callsStats = this.currentStatistics.get(fn) || [];
    const time = new Date();
    const call = Object.freeze({
      time,
      timeMargin: time.getTime() - this.recordingStartedAt.getTime()
    });
    callsStats.push(call);
    this.currentStatistics.set(fn, callsStats);
  }

  private initialize() {
    this.currentStatistics = new Map<Function, CallbackCall[]>();
  }
}

