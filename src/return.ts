import { PSEUDO_RETURN } from './config'

export function RETURN (...args: any[]) {
  void args // nop. Just for making TypeScript happy
  /**
   * Never mind the following return value: PSEUDO
   * Because it will be replaced by the docorator
   * with the real library return value.
   */
  return PSEUDO_RETURN as any
}
