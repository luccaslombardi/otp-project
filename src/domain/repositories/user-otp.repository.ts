export interface UserOtpRepository {
  save(
    userId: string, 
    secret: string, 
    createdAt: string, 
    expiresAt?: string, 
    counter?: number
  ): Promise<void>;

  findByUserId(
    userId: string
  ): Promise<{
    userId: string;
    secret: string;
    counter?: number;
    createdAt: Date;
    expiresAt?: string;
  } | null>;
  
  updateCounter(
    userId: string, 
    counter: number
  ): Promise<void>;
}
