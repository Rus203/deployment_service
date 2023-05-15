export interface IStatistic {
  status: string;
  value: {
    rom: { totalSpace: string; usedSpace: string };
    ram: { totalMemory: string; usedMemory: string };
    cpuUsage: number;
  };
}
