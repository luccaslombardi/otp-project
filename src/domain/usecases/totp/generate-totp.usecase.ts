export interface GenerateTOTPUseCase {
  execute(userId: string): Promise<{ token: string; expiresAt: string, createdAt: string }>
}
