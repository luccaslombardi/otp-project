export interface GenerateHOTPUseCase {
  execute(userId: string): Promise<{ token: string; expiresAt: Date }>
}
