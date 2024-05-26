declare module 'uuid' {
  export function v1(): string;
  export function v3(name: string): string;
  export function v4(options?: { random: number[] }): string;
  export function v5(name: string): string;
}
