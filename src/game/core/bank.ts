/** Unlimited storage reachable at any bank booth. Everything stacks here. */
export class Bank {
  private readonly contents = new Map<string, number>();

  deposit(id: string, count: number): void {
    if (count <= 0) return;
    this.contents.set(id, this.count(id) + count);
  }

  /** @returns how many were actually withdrawn */
  withdraw(id: string, count: number): number {
    const held = this.count(id);
    const taken = Math.min(held, count);
    if (taken <= 0) return 0;
    if (held - taken <= 0) this.contents.delete(id);
    else this.contents.set(id, held - taken);
    return taken;
  }

  count(id: string): number {
    return this.contents.get(id) ?? 0;
  }

  entries(): [string, number][] {
    return [...this.contents.entries()];
  }

  isEmpty(): boolean {
    return this.contents.size === 0;
  }

  clear(): void {
    this.contents.clear();
  }
}
