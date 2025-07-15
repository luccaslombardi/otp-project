export interface UserOtpRepository {
  save(
    userId: string,
    secret: string,
    typeOtp: 'TOTP' | 'HOTP', 
    createdAt: string, 
    expiresAt?: string, 
    counter?: number
  ): Promise<void>;

  findByUserId(
    userId: string
  ): Promise<{
    userId: string;
    secret: string;
    typeOtp: 'TOTP' | 'HOTP';
    counter?: number;
    createdAt: Date;
    expiresAt?: string;
  } | null>;
  
  updateCounter(
    userId: string, 
    counter: number,
    updatedAt: string
  ): Promise<void>;
}
