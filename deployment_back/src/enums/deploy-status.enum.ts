export enum DeployStatus {
  START = 0,
  PREPARING = 0.1,
  PUT_DIRECTORY = 0.2,
  PUT_KEY = 0.3,
  PULL_DOCKER = 0.4,
  PULL_MINIBACK = 0.6,
  RUN_MINIBACK = 0.9,
  UPDATE_STATUS = 0.95,
  FINISH = 1,
}
