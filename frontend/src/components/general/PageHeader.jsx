import { Box, Typography, Paper } from "@mui/material";

const PageHeader = ({ 
  title = "No title", 
  bgColor = "#F8FAFC", 
  textColor = "#1E293B",
  subtitle = null,
  icon = null,
  iconColor = "white",
  bdColor = "#00B4D8"
}) => {
    
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        bgcolor: bgColor,
        px: 2,
        py: 2,
        borderRadius: 2,
        borderLeft: `4px solid ${bdColor}`,
        mb: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, transparent 0%, rgba(0, 180, 216, 0.05) 100%)",
          pointerEvents: "none",
        }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 1, width: "100%" }}>
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#00B4D8",
              color: iconColor,
              fontSize: "1.2rem",
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              color: textColor,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              mb: subtitle ? 0.5 : 0,
              fontSize: "1.1rem"
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: "#64748B",
                fontWeight: 500,
                fontSize: "0.75rem",
                display: "block"
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
 
export default PageHeader;