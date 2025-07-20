import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoUserOtpRepository } from '../../src/infraestructure/repositories/dynamo-user-otp.repository';

jest.mock('@aws-sdk/lib-dynamodb', () => {
  class PutCommandMock {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  class UpdateCommandMock {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }

  class GetCommandMock {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  return {
    PutCommand: PutCommandMock,
    UpdateCommand: UpdateCommandMock,
    GetCommand: GetCommandMock
  };
});

describe('DynamoUserOtpRepository', () => {
  let repository: DynamoUserOtpRepository;
  let mockSend: jest.Mock;

  beforeEach(() => {
    process.env.DYNAMO_TABLE_NAME = 'UserOtp';
    mockSend = jest.fn();
    const mockDynamoClient = { send: mockSend } as unknown as DynamoDBDocumentClient;
    repository = new DynamoUserOtpRepository(mockDynamoClient);
  });

  describe('save', () => {
    it('deve salvar um item com campos que são obrigatórios', async () => {
      mockSend.mockResolvedValue({});

      await repository.save(
        'user123',
        'my-secret',
        'TOTP',
        '2025-07-15T12:00:00.000Z'
      );

      expect(mockSend).toHaveBeenCalled();
      const commandArg = mockSend.mock.calls[0][0].input;

      expect(commandArg.TableName).toBe('UserOtp');
      expect(commandArg.Item).toMatchObject({
        userId: 'user123',
        secret: 'my-secret',
        typeOtp: 'TOTP',
        createdAt: '2025-07-15T12:00:00.000Z',
      });
    });

    it('deve salvar campos opcionais caso forem preenchidos', async () => {
      mockSend.mockResolvedValue({});

      await repository.save(
        'user456',
        'my-secret',
        'HOTP',
        '2025-07-15T12:00:00.000Z',
        '2025-07-15T13:00:00.000Z',
        5,
        '2025-07-15T14:00:00.000Z'
      );

      const item = mockSend.mock.calls[0][0].input.Item;
      expect(item.expiresAt).toBe('2025-07-15T13:00:00.000Z');
      expect(item.counter).toBe(5);
      expect(item.updatedAt).toBe('2025-07-15T14:00:00.000Z');
    });

    it('deve lançar erro se o DynamoDB falhar', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB error'));

      await expect(
        repository.save(
          'user789',
          'my-secret',
          'TOTP',
          '2025-07-15T12:00:00.000Z'
        )
      ).rejects.toThrow('DynamoDB error');
    });
  });

    describe('findByUserId', () => {
    let repository: DynamoUserOtpRepository;
    let mockSend: jest.Mock;

    beforeEach(() => {
        mockSend = jest.fn();
        const mockDynamoClient = { send: mockSend } as unknown as DynamoDBDocumentClient;
        repository = new DynamoUserOtpRepository(mockDynamoClient);
    });

    it('deve retornar o item quando encontrado', async () => {
        const fakeItem = { userId: 'user123', secret: 'secret', typeOtp: 'TOTP' };
        mockSend.mockResolvedValue({ Item: fakeItem });

        const result = await repository.findByUserId('user123');

        expect(mockSend).toHaveBeenCalled();
        expect(result).toEqual(fakeItem);
    });

    it('deve retornar null quando não encontrar item', async () => {
        mockSend.mockResolvedValue({});

        const result = await repository.findByUserId('user123');

        expect(result).toBeNull();
    });

    it('deve lançar erro quando DynamoDB falhar', async () => {
        mockSend.mockRejectedValue(new Error('DynamoDB failure'));

        await expect(repository.findByUserId('user123')).rejects.toThrow('DynamoDB failure');
    });
  });

  describe('updateCounter', () => {
    it('deve atualizar o counter e updatedAt', async () => {
      mockSend.mockResolvedValue({});

      const userId = 'user123';
      const counter = 10;
      const updatedAt = '2025-07-15T14:00:00.000Z';

      await repository.updateCounter(userId, counter, updatedAt);

      expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
      const commandArg = mockSend.mock.calls[0][0].input;

      expect(commandArg.TableName).toBe('UserOtp');
      expect(commandArg.Key).toEqual({ userId });
      expect(commandArg.UpdateExpression).toContain('counter');
      expect(commandArg.ExpressionAttributeNames['#counter']).toBe('counter');
      expect(commandArg.ExpressionAttributeValues[':counter']).toBe(counter);
      expect(commandArg.ExpressionAttributeValues[':updatedAt']).toBe(updatedAt);
    });

    it('deve lançar erro se o DynamoDB falhar', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB error'));

      await expect(repository.updateCounter('user123', 10, '2025-07-15T14:00:00.000Z'))
        .rejects.toThrow('DynamoDB error');
    });
  });

  describe('updateOtpMetadata', () => {
    it('deve atualizar typeOtp e updatedAt', async () => {
      mockSend.mockResolvedValue({});

      const userId = 'user456';
      const typeOtp = 'TOTP';
      const updatedAt = '2025-07-15T15:00:00.000Z';

      await repository.updateOtpMetadata(userId, typeOtp, updatedAt);

      expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
      const commandArg = mockSend.mock.calls[0][0].input;

      expect(commandArg.TableName).toBe('UserOtp');
      expect(commandArg.Key).toEqual({ userId });
      expect(commandArg.UpdateExpression).toContain('typeOtp');
      expect(commandArg.UpdateExpression).toContain('updatedAt');
      expect(commandArg.ExpressionAttributeValues[':typeOtp']).toBe(typeOtp);
      expect(commandArg.ExpressionAttributeValues[':updatedAt']).toBe(updatedAt);
      expect(commandArg.ExpressionAttributeValues[':expiresAt']).toBeUndefined();
    });

    it('deve atualizar typeOtp, updatedAt e expiresAt se expiresAt for fornecido', async () => {
      mockSend.mockResolvedValue({});

      const userId = 'user789';
      const typeOtp = 'HOTP';
      const updatedAt = '2025-07-15T16:00:00.000Z';
      const expiresAt = '2025-07-16T00:00:00.000Z';

      await repository.updateOtpMetadata(userId, typeOtp, updatedAt, expiresAt);

      expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
      const commandArg = mockSend.mock.calls[0][0].input;

      expect(commandArg.TableName).toBe('UserOtp');
      expect(commandArg.Key).toEqual({ userId });
      expect(commandArg.UpdateExpression).toContain('expiresAt');
      expect(commandArg.ExpressionAttributeValues[':expiresAt']).toBe(expiresAt);
    });

    it('deve lançar erro se o DynamoDB falhar', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB error'));

      await expect(repository.updateOtpMetadata('user123', 'TOTP', '2025-07-15T14:00:00.000Z'))
        .rejects.toThrow('DynamoDB error');
    });
  });
});
