import { describe, expect, it } from 'vitest';
import { changePasswordSchema } from './change-password-schema';
import { loginSchema } from './login-schema';

describe('loginSchema', () => {
  it('trims and upper-cases the school code and login ID like the API', () => {
    const result = loginSchema.parse({
      schoolCode: ' dpss ',
      loginId: ' ab.12 ',
      password: 'secret',
      rememberSchoolCode: true,
    });
    expect(result).toMatchObject({ schoolCode: 'DPSS', loginId: 'AB.12' });
  });

  it('explains each missing field', () => {
    const result = loginSchema.safeParse({
      schoolCode: '',
      loginId: '',
      password: '',
      rememberSchoolCode: false,
    });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'Enter your school code',
        'Enter your login ID',
        'Enter your password',
      ]),
    );
  });

  it('rejects school codes with unsupported characters', () => {
    const result = loginSchema.safeParse({
      schoolCode: 'DP SS',
      loginId: 'A1',
      password: 'x',
      rememberSchoolCode: false,
    });
    expect(result.error?.issues[0]?.path).toEqual(['schoolCode']);
  });
});

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'old-pass',
    newPassword: 'new-pass1',
    confirmPassword: 'new-pass1',
  };

  it('accepts a new password of exactly 8 characters', () => {
    expect(
      changePasswordSchema.safeParse({
        ...valid,
        newPassword: 'abcd1234',
        confirmPassword: 'abcd1234',
      }).success,
    ).toBe(true);
  });

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: 'abc1234',
      confirmPassword: 'abc1234',
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ['newPassword'],
      message: 'Use at least 8 characters',
    });
  });

  it('requires the confirmation to match', () => {
    const result = changePasswordSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.error?.issues[0]).toMatchObject({
      path: ['confirmPassword'],
      message: 'Passwords don’t match',
    });
  });

  it('rejects reusing the current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'same-pass',
      newPassword: 'same-pass',
      confirmPassword: 'same-pass',
    });
    expect(result.error?.issues[0]?.path).toEqual(['newPassword']);
  });
});
