'use client';

import { Typography, Box, Card, CardContent, Grid, TextField, Button, Divider } from '@mui/material';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Platform Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              General Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Platform Name" defaultValue="DigiManual" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Support Email" defaultValue="support@dimanual.com" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Contact Phone" defaultValue="+1234567890" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Email Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="SMTP Host" defaultValue="smtp.example.com" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="SMTP Port" type="number" defaultValue="587" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="SMTP Username" defaultValue="noreply@dimanual.com" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Subscription Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Monthly Price" type="number" defaultValue="9.99" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Annual Price" type="number" defaultValue="99.99" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" fullWidth>
                  Export Settings
                </Button>
                <Button variant="outlined" fullWidth>
                  Import Settings
                </Button>
                <Divider />
                <Button variant="contained" fullWidth startIcon={<Save size={18} />} onClick={handleSave}>
                  Save All Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
