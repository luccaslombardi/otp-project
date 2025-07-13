export interface ValidateHOTPUseCase {
  execute(userId: string, token: string, counter: number): Promise<boolean>;
}
