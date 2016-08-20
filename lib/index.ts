import {Recorder} from './recorder';
import {SimpleSubscriptionLeakReporter} from './simple-subscription-leak-reporter';

enum HistoryStrategy {
  Hash,
  Html5
}

interface LeakDetectorConfig {
  historyStrategy: HistoryStrategy;
}

export class SimpleSubscriptionLeakDetector {
  private recorder = new Recorder();
  private simpleMemoryLeakReporter = new SimpleSubscriptionLeakReporter();
  private recordingHistory = new Map<string, PageStatistics>();

  constructor(private config: LeakDetectorConfig) {
    this.addEventListeners();
  }

  addEventListeners() {
    let eventName = 'pushstate';
    if (this.config.historyStrategy === HistoryStrategy.Hash) {
      eventName = 'hashchange';
    }
    window.addEventListener(eventName, this.handlePageChange.bind(this));
  }

  handlePageChange() {
    if (this.recorder.recording) {
      const snapshot = this.recorder.takeSnapshot();
      const oldSnapshot = this.recordingHistory.get(location.href);
      if (oldSnapshot) {
        console.log(this.simpleMemoryLeakReporter.report(snapshot, oldSnapshot));
      }
      this.recordingHistory.set(location.href, snapshot);
    }
    this.recorder.reset();
    this.recorder.startRecording();
  }
}
