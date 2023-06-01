export enum IDeployStatus {
  START = 0,
  PREPARING = 0.1,
  PUT_DIRECTORY = 0.2,
  PULL_DOCKER = 0.4,
  PULL_MINIBACK = 0.6,
  RUN_MINIBACK = 0.8,
  UPDATE_STATUS = 0.9,
  FINISH = 1,
}
