export interface IStatistic {
  rom: { totalSpace: string; usedSpace: string };
  ram: { totalMemory: string; usedMemory: string };
  cpu: number;
}
