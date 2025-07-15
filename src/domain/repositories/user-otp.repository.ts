export interface UserOtpRepository {
  save(
    userId: string,
    secret: string,
    typeOtp: 'TOTP' | 'HOTP', 
    createdAt?: string, 
    expiresAt?: string, 
    counter?: number,
    updatedAt?: string
  ): Promise<void>;

  findByUserId(
    userId: string
  ): Promise<{
    userId: string;
    secret: string;
    typeOtp: 'TOTP' | 'HOTP';
    counter?: number;
    createdAt: Date;
  } | null>;
  
  updateCounter(
    userId: string, 
    counter: number,
    updatedAt: string,
    expiresAt?: string
  ): Promise<void>;

  updateOtpMetadata(
    userId: string, 
    typeOtp: 'TOTP' | 'HOTP',
    updatedAt: string,
    expiresAt?: string
  ): Promise<void>;
}
