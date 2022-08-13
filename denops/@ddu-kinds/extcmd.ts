import type { ActionArguments } from "https://deno.land/x/ddu_vim@v1.8.8/base/kind.ts";
import {
  ActionFlags,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v1.8.8/types.ts";
import * as vimfn from "https://deno.land/x/denops_std@v3.8.1/function/vim/mod.ts";
import { Denops } from "https://deno.land/x/denops_std@v3.8.1/mod.ts";

export interface ActionData {
  cmd: string[];
  cwd: string;
}

interface Runner {
  run(opt: {cmd: string[], cwd: string});
}

class TermRunner implements Runner {
  denops: Denops

  constructor(denops: Denops) {
    this.denops = denops
  }

  run(opt: {cmd: string[], cwd: string}) {
    vimfn.term_start(this.denops, opt.cmd, { cwd: opt.cwd })
  }
}

class DenoRunner implements Runner {
  run(opt: {cmd: string[], cwd: string}) {
    return Deno.run(opt)
  }
}

type Params = {
  runner: RunnerKind;
};

type RunnerKind = "deno" | "terminal";

export class Kind extends BaseKind<Params> {
  actions: Record<
    string,
    (args: ActionArguments<Params>) => Promise<ActionFlags>
  > = {
    run: async (args: ActionArguments<Params>) => {
      let runner: Runner;
      switch (args.kindParams.runner) {
        case "terminal":
          runner = new TermRunner(args.denops);
          break;
        default:
          runner = new DenoRunner();
          break;
      }

      for (const item of args.items) {
        const action = item?.action as ActionData;
        runner.run({ cmd: action.cmd, cwd: action.cwd });
      }

      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): Params {
    return { runner: "deno" };
  }
}
