export interface GenerateHOTPUseCase {
  execute(userId: string, counter: number): Promise<{ token: string }>
}
