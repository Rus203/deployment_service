import { Injectable } from '@nestjs/common';
import os from 'os';

@Injectable()
export class ServerService {
  getStatus() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const loadAverage = os.loadavg()[0];
    return { totalMemory, freeMemory, loadAverage };
  }
}
