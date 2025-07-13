export interface ValidateTOTPUseCase {
  execute(userId: string, token: string): Promise<boolean>;
}
