/** The record deploy.sh writes to its status file, and the panel polls for. */
export type DeployStatus = "running" | "succeeded" | "failed" | "stale";

export type DeployRecord = {
  id: string;
  status: DeployStatus;
  /** The step it is on, or the one it failed at: lock, unzip, validate, backup, stop, swap, build, start, watch, rollback, done. */
  step: string;
  message: string;
  startedAt: string;
  updatedAt: string;
  exitCode: number;
  rolledBack: boolean;
};

export const isTerminal = (status: DeployStatus) => status === "succeeded" || status === "failed" || status === "stale";

/** Ids become filenames, so nothing outside this set is ever accepted. */
export const isValidDeployId = (id: string) => /^[A-Za-z0-9._-]{1,64}$/.test(id) && !id.includes("..");

export const newDeployId = () => {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}`;
};

/** What the panel shows for each step. */
export const STEP_LABELS: Record<string, string> = {
  queued: "Queued",
  lock: "Acquiring the deploy lock",
  unzip: "Extracting the package",
  validate: "Checking the package",
  backup: "Backing up the current site",
  stop: "Stopping the site",
  swap: "Installing the new files",
  build: "Installing dependencies and building",
  start: "Starting the site",
  watch: "Watching it come back up",
  rollback: "Rolling back",
  done: "Done",
};
