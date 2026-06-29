// tiged ships no types; declare the minimal surface we use.
declare module "tiged" {
  type TigedOptions = { cache?: boolean; force?: boolean; verbose?: boolean };
  type TigedEmitter = { clone: (dest: string) => Promise<void> };
  export default function tiged(src: string, opts?: TigedOptions): TigedEmitter;
}
