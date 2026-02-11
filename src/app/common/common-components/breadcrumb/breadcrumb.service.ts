import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';

import { StdMessage } from '../../common-model/standar-api-response.model';

@Injectable()
export class BreadCrumbService {

  private subject = new Subject<any>();
  private notificationSubject = new Subject<any>();
  private notificationCountSubject = new Subject<number>();

  // untuk progress bar
  private progressBarSubject = new Subject<number>();

  constructor() {
  }

  // untuk reload breadcrumb
  sendReloadInfo(message: string) {
    this.subject.next({ text: message });
  }

  clearReloadInfo() {
    this.subject.next();
  }

  getReloadInfo(): Observable<any> {
    return this.subject.asObservable();
  }

  // untuk info notifikasi baru
  sendNotificationInfo(message: any) {
    this.notificationSubject.next(message);
  }

  clearNotificationInfo() {
    this.notificationSubject.next();
  }

  getNotificationInfo(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  // untuk info jumlah notifikasi
  sendNotificationCount(message: number) {
    this.notificationCountSubject.next(message);
  }

  clearNotificationCount() {
    this.notificationCountSubject.next();
  }

  getNotificationCount(): Observable<any> {
    return this.notificationCountSubject.asObservable();
  }

  // untuk progress bar
  sendProgressBarInfo(message: any) {
    this.progressBarSubject.next(message);
  }

  clearProgressBarInfo() {
    this.progressBarSubject.next();
  }

  getProgressBarInfo(): Observable<any> {
    return this.progressBarSubject.asObservable();
  }

}
