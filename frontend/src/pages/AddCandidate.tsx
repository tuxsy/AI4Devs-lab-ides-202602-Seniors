import { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EducationEntry from '../components/EducationEntry';
import WorkExperienceEntry from '../components/WorkExperienceEntry';
import {
  candidateFormSchema,
  educationSchema,
  workExperienceSchema,
} from '../validation/candidateSchema';
import type {
  CandidateFormData,
  EducationFormData,
  WorkExperienceFormData,
} from '../validation/candidateSchema';
import { api, ERROR_MESSAGES } from '../services/api';
import './AddCandidate.css';

// Initial empty education entry
const emptyEducation: EducationFormData = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
};

// Initial empty work experience entry
const emptyWorkExperience: WorkExperienceFormData = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
};

// Initial form state
const initialFormData: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: [],
  workExperiences: [],
};

interface AddCandidateProps {
  userId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

function AddCandidate({ userId, onCancel, onSuccess }: AddCandidateProps) {
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update a personal info field
  const handleFieldChange = (field: keyof CandidateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate a single personal info field on blur
  const handleFieldBlur = (field: keyof CandidateFormData) => {
    const fieldSchema = candidateFormSchema.shape[field];
    const result = fieldSchema.safeParse(formData[field]);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0]?.message || 'Invalid value',
      }));
    }
  };

  // Add a new education entry
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...emptyEducation }],
    }));
  };

  // Update an education entry field
  const handleEducationChange = (
    index: number,
    field: keyof EducationFormData,
    value: string,
  ) => {
    setFormData((prev) => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
    // Clear error when user types
    const errorKey = `education.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Validate education field on blur
  const handleEducationBlur = (
    index: number,
    field: keyof EducationFormData,
  ) => {
    const education = formData.education?.[index];
    if (!education) return;

    // Validate the entire education entry to catch cross-field errors
    const result = educationSchema.safeParse(education);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (path === field || (path === 'endDate' && field === 'endDate')) {
          fieldErrors[`education.${index}.${path}`] = issue.message;
        }
      }
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  // Remove an education entry
  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index),
    }));
    // Clear any errors for this entry
    setErrors((prev) => {
      const newErrors: Record<string, string> = {};
      for (const key of Object.keys(prev)) {
        if (!key.startsWith(`education.${index}.`)) {
          newErrors[key] = prev[key];
        }
      }
      return newErrors;
    });
  };

  // Add a new work experience entry
  const handleAddWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...(prev.workExperiences || []),
        { ...emptyWorkExperience },
      ],
    }));
  };

  // Update a work experience entry field
  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperienceFormData,
    value: string,
  ) => {
    setFormData((prev) => {
      const workExperiences = [...(prev.workExperiences || [])];
      workExperiences[index] = { ...workExperiences[index], [field]: value };
      return { ...prev, workExperiences };
    });
    // Clear error when user types
    const errorKey = `workExperiences.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Validate work experience field on blur
  const handleWorkExperienceBlur = (
    index: number,
    field: keyof WorkExperienceFormData,
  ) => {
    const workExperience = formData.workExperiences?.[index];
    if (!workExperience) return;

    const result = workExperienceSchema.safeParse(workExperience);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (path === field || (path === 'endDate' && field === 'endDate')) {
          fieldErrors[`workExperiences.${index}.${path}`] = issue.message;
        }
      }
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  // Remove a work experience entry
  const handleRemoveWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences?.filter((_, i) => i !== index),
    }));
    // Clear any errors for this entry
    setErrors((prev) => {
      const newErrors: Record<string, string> = {};
      for (const key of Object.keys(prev)) {
        if (!key.startsWith(`workExperiences.${index}.`)) {
          newErrors[key] = prev[key];
        }
      }
      return newErrors;
    });
  };

  // Submit the form
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Validate entire form
      const result = candidateFormSchema.safeParse(formData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const path = issue.path.join('.');
          if (!newErrors[path]) {
            newErrors[path] = issue.message;
          }
        }
        setErrors(newErrors);
        return;
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        // Prepare data for API
        const apiData = {
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          education: formData.education?.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy || undefined,
            startDate: new Date(edu.startDate).toISOString(),
            endDate: edu.endDate
              ? new Date(edu.endDate).toISOString()
              : undefined,
          })),
          workExperiences: formData.workExperiences?.map((exp) => ({
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate).toISOString(),
            endDate: exp.endDate
              ? new Date(exp.endDate).toISOString()
              : undefined,
            description: exp.description || undefined,
          })),
        };

        await api.createCandidate(apiData);
        setShowSuccess(true);

        // Navigate to dashboard after brief delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (error) {
        // Use duck typing to check for ApiError (compatible with Jest mocks)
        const apiError = error as { statusCode?: number; message?: string };
        if (apiError.statusCode !== undefined) {
          setSubmitError(
            ERROR_MESSAGES[apiError.statusCode] || apiError.message || 'Error',
          );
        } else {
          setSubmitError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [formData, userId, onSuccess],
  );

  return (
    <Box className="add-candidate-container">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add New Candidate
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Personal Information Section */}
          <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 2 }}>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                onBlur={() => handleFieldBlur('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                fullWidth
                autoComplete="off"
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                onBlur={() => handleFieldBlur('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                fullWidth
                autoComplete="off"
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
              autoComplete="off"
            />

            <TextField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              autoComplete="off"
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              onBlur={() => handleFieldBlur('address')}
              error={!!errors.address}
              helperText={errors.address}
              fullWidth
              multiline
              rows={2}
              autoComplete="off"
            />
          </Box>

          {/* Education Section */}
          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {formData.education?.map((edu, index) => (
            <EducationEntry
              key={index}
              index={index}
              data={edu}
              errors={errors}
              onChange={handleEducationChange}
              onRemove={handleRemoveEducation}
              onBlur={handleEducationBlur}
            />
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddEducation}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Add Education
          </Button>

          {/* Work Experience Section */}
          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
            Work Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {formData.workExperiences?.map((exp, index) => (
            <WorkExperienceEntry
              key={index}
              index={index}
              data={exp}
              errors={errors}
              onChange={handleWorkExperienceChange}
              onRemove={handleRemoveWorkExperience}
              onBlur={handleWorkExperienceBlur}
            />
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddWorkExperience}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Add Work Experience
          </Button>

          {/* Submit Error */}
          {submitError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {submitError}
            </Alert>
          )}

          {/* Form Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4,
            }}
          >
            <Button onClick={onCancel} disabled={submitting} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Add Candidate'
              )}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Candidate added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddCandidate;
