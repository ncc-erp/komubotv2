import { DECORATOR_COMMAND } from "./command.constans";

export interface CommandArgument {
  name: string;
  description: string;
}
export function CommandSlash(args: CommandArgument) {
  return function (constructor: Function) {
    Reflect.defineMetadata(DECORATOR_COMMAND, args, constructor.prototype);
  };
}
