import { Injectable } from '@nestjs/common';
import os from 'os';

@Injectable()
export class ServerService {
  getStatus() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const loadAverage = os.loadavg();
    return { totalMemory, freeMemory, loadAverage };
  }
}
