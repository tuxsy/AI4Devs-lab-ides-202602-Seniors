import { Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { EducationFormData } from '../validation/candidateSchema';

interface EducationEntryProps {
  index: number;
  data: EducationFormData;
  errors: Record<string, string>;
  onChange: (
    index: number,
    field: keyof EducationFormData,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  onBlur: (index: number, field: keyof EducationFormData) => void;
}

function EducationEntry({
  index,
  data,
  errors,
  onChange,
  onRemove,
  onBlur,
}: EducationEntryProps) {
  const getError = (field: keyof EducationFormData): string | undefined => {
    return errors[`education.${index}.${field}`];
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="subtitle2">Education #{index + 1}</Typography>
        <IconButton
          onClick={() => onRemove(index)}
          size="small"
          aria-label="Remove education entry"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Institution"
          value={data.institution}
          onChange={(e) => onChange(index, 'institution', e.target.value)}
          onBlur={() => onBlur(index, 'institution')}
          error={!!getError('institution')}
          helperText={getError('institution')}
          required
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Degree"
          value={data.degree}
          onChange={(e) => onChange(index, 'degree', e.target.value)}
          onBlur={() => onBlur(index, 'degree')}
          error={!!getError('degree')}
          helperText={getError('degree')}
          required
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Field of Study"
          value={data.fieldOfStudy || ''}
          onChange={(e) => onChange(index, 'fieldOfStudy', e.target.value)}
          onBlur={() => onBlur(index, 'fieldOfStudy')}
          error={!!getError('fieldOfStudy')}
          helperText={getError('fieldOfStudy')}
          fullWidth
          autoComplete="off"
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={data.startDate}
            onChange={(e) => onChange(index, 'startDate', e.target.value)}
            onBlur={() => onBlur(index, 'startDate')}
            error={!!getError('startDate')}
            helperText={getError('startDate')}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
          />

          <TextField
            label="End Date"
            type="date"
            value={data.endDate || ''}
            onChange={(e) => onChange(index, 'endDate', e.target.value)}
            onBlur={() => onBlur(index, 'endDate')}
            error={!!getError('endDate')}
            helperText={getError('endDate') || 'Leave empty if ongoing'}
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default EducationEntry;
