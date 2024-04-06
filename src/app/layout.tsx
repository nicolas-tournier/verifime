import type { Metadata } from "next";
import "./globals.css";
import {
  Grid,
  Box,
  Typography
} from "@mui/material";
import { boxTheme } from "@/constants/themes";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Supercorp",
  description: "Invoice currency convergence tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Box sx={{ ...boxTheme, margin: '10px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: 24,
                  fontWeight: 'semibold',
                  color: '#3846b6',
                }}>Supercorp Invoice Converge</Typography>
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Box>
      </body>
    </html>
  );
}
