import {
  candidateFormSchema,
  educationSchema,
  workExperienceSchema,
  validateField,
  validateCandidateForm,
} from '../validation/candidateSchema';

describe('candidateFormSchema', () => {
  describe('personal information', () => {
    it('should validate required firstName', () => {
      const result = candidateFormSchema.safeParse({
        firstName: '',
        lastName: 'Doe',
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
      expect(result.success || result.error.issues[0].path).toContain(
        'firstName',
      );
    });

    it('should validate required lastName', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: '',
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
      expect(result.success || result.error.issues[0].path).toContain(
        'lastName',
      );
    });

    it('should validate required email', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: '',
      });
      expect(result.success).toBe(false);
      expect(result.success || result.error.issues[0].path).toContain('email');
    });

    it('should validate email format', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'notanemail',
      });
      expect(result.success).toBe(false);
      expect(result.success || result.error.issues[0].message).toContain(
        'valid email',
      );
    });

    it('should accept valid email format', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should enforce firstName max length (100)', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'a'.repeat(101),
        lastName: 'Doe',
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
      expect(result.success || result.error.issues[0].message).toContain('100');
    });

    it('should enforce lastName max length (100)', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'a'.repeat(101),
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('should enforce phone max length (50)', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it('should enforce address max length (500)', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        address: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should allow optional phone and address', () => {
      const result = candidateFormSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('educationSchema', () => {
  it('should validate required institution', () => {
    const result = educationSchema.safeParse({
      institution: '',
      degree: 'Bachelor',
      startDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('should validate required degree', () => {
    const result = educationSchema.safeParse({
      institution: 'University',
      degree: '',
      startDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('should validate required startDate', () => {
    const result = educationSchema.safeParse({
      institution: 'University',
      degree: 'Bachelor',
      startDate: '',
    });
    expect(result.success).toBe(false);
  });

  it('should validate endDate is not before startDate', () => {
    const result = educationSchema.safeParse({
      institution: 'University',
      degree: 'Bachelor',
      startDate: '2022-01-01',
      endDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
    expect(result.success || result.error.issues[0].message).toContain(
      'before start date',
    );
  });

  it('should accept valid education entry', () => {
    const result = educationSchema.safeParse({
      institution: 'University',
      degree: 'Bachelor',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
    });
    expect(result.success).toBe(true);
  });

  it('should allow optional endDate', () => {
    const result = educationSchema.safeParse({
      institution: 'University',
      degree: 'Bachelor',
      startDate: '2020-01-01',
    });
    expect(result.success).toBe(true);
  });
});

describe('workExperienceSchema', () => {
  it('should validate required company', () => {
    const result = workExperienceSchema.safeParse({
      company: '',
      position: 'Developer',
      startDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('should validate required position', () => {
    const result = workExperienceSchema.safeParse({
      company: 'Tech Corp',
      position: '',
      startDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('should validate required startDate', () => {
    const result = workExperienceSchema.safeParse({
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '',
    });
    expect(result.success).toBe(false);
  });

  it('should validate endDate is not before startDate', () => {
    const result = workExperienceSchema.safeParse({
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2022-01-01',
      endDate: '2020-01-01',
    });
    expect(result.success).toBe(false);
    expect(result.success || result.error.issues[0].message).toContain(
      'before start date',
    );
  });

  it('should accept valid work experience entry', () => {
    const result = workExperienceSchema.safeParse({
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
      description: 'Worked on various projects',
    });
    expect(result.success).toBe(true);
  });
});

describe('validateField', () => {
  it('should return null for valid field', () => {
    const error = validateField('email', 'test@example.com');
    expect(error).toBeNull();
  });

  it('should return error message for invalid field', () => {
    const error = validateField('email', 'notanemail');
    expect(error).toBe('Please enter a valid email address');
  });
});

describe('validateCandidateForm', () => {
  it('should return empty object for valid form', () => {
    const errors = validateCandidateForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
    });
    expect(errors).toEqual({});
  });

  it('should return errors object for invalid form', () => {
    const errors = validateCandidateForm({
      firstName: '',
      lastName: '',
      email: 'notanemail',
    });
    expect(errors).toHaveProperty('firstName');
    expect(errors).toHaveProperty('lastName');
    expect(errors).toHaveProperty('email');
  });
});
