import { Box, Typography, Paper } from "@mui/material";

const PageHeader = ({ 
  title = "No title", 
  bgColor = "#F8FAFC", 
  textColor = "#1E293B",
  subtitle = null,
  icon = null 
}) => {
    
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: bgColor,
        px: 4,
        py: 1,
        borderRadius: 2,
        borderLeft: "4px solid #00B4D8",
        mb: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "200px",
          height: "100%",
          background: "linear-gradient(45deg, transparent 0%, rgba(0, 180, 216, 0.05) 100%)",
          pointerEvents: "none",
        }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#00B4D8",
              color: "white",
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              color: textColor,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              mb: subtitle ? 0.5 : 0
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#64748B",
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: 60,
          height: 4,
          bgcolor: "#00B4D8",
          borderRadius: 2,
          opacity: 0.3
        }}
      />
    </Paper>
  );
};
 
export default PageHeader;