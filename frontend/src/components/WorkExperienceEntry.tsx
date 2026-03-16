import { Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { WorkExperienceFormData } from '../validation/candidateSchema';

interface WorkExperienceEntryProps {
  index: number;
  data: WorkExperienceFormData;
  errors: Record<string, string>;
  onChange: (
    index: number,
    field: keyof WorkExperienceFormData,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  onBlur: (index: number, field: keyof WorkExperienceFormData) => void;
}

function WorkExperienceEntry({
  index,
  data,
  errors,
  onChange,
  onRemove,
  onBlur,
}: WorkExperienceEntryProps) {
  const getError = (
    field: keyof WorkExperienceFormData,
  ): string | undefined => {
    return errors[`workExperiences.${index}.${field}`];
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
        <Typography variant="subtitle2">
          Work Experience #{index + 1}
        </Typography>
        <IconButton
          onClick={() => onRemove(index)}
          size="small"
          aria-label="Remove work experience entry"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Company"
          value={data.company}
          onChange={(e) => onChange(index, 'company', e.target.value)}
          onBlur={() => onBlur(index, 'company')}
          error={!!getError('company')}
          helperText={getError('company')}
          required
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Position"
          value={data.position}
          onChange={(e) => onChange(index, 'position', e.target.value)}
          onBlur={() => onBlur(index, 'position')}
          error={!!getError('position')}
          helperText={getError('position')}
          required
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
            helperText={getError('endDate') || 'Leave empty if current'}
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
          />
        </Box>

        <TextField
          label="Description"
          value={data.description || ''}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          onBlur={() => onBlur(index, 'description')}
          error={!!getError('description')}
          helperText={getError('description')}
          fullWidth
          multiline
          rows={3}
          autoComplete="off"
        />
      </Box>
    </Paper>
  );
}

export default WorkExperienceEntry;
