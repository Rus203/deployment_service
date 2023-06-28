export enum DeployStatusMiniBack {
  START = 0,
  PUT_DIRECTORY = 0.25,
  PULL_MINIBACK = 0.5,
  RUN_MINIBACK = 0.75,
  FINISH = 1,
}

export enum DeleteStatusMiniBack {
  START = 0,
  DELETE_FROM_SERVER = 0.33,
  DELETE_FROM_DB = 0.66,
  FINISH = 1,
}
