export enum DeployStatusMiniBack {
  START = 0,
  PUT_DIRECTORY = 25,
  PULL_MINIBACK = 50,
  RUN_MINIBACK = 75,
  FINISH = 100,
}

export enum DeleteStatusMiniBack {
  START = 0,
  DELETE_FROM_SERVER = 0.33,
  DELETE_FROM_DB = 0.66,
  FINISH = 1,
}
