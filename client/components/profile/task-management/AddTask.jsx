import {
  Box,
  TextField,
  Button,
  Typography,
  ButtonGroup,
  FormHelperText,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useFormContext, Controller } from "react-hook-form";

const AddTask = ({ setSelectedDate, selectedDate }) => {
  const theme = useTheme();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: "600px" },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
        Add New Task
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          variant="outlined"
          label="Task Title"
          type="text"
          fullWidth
          {...register("title", { required: "Task title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setValue("date", newDate);
            }}
            label="Select a Date"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          label="Task Description"
          fullWidth
          {...register("description", {
            required: "Task description is required",
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1.5,
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            Task Priority
          </Typography>
          <Controller
            name="priority"
            control={control}
            rules={{ required: "Please select a priority" }}
            defaultValue=""
            render={({ field }) => (
              <ButtonGroup
                variant="outlined"
                aria-label="priority button group"
                fullWidth
                sx={{ mb: errors.priority ? 1 : 0 }}
              >
                <Button
                  onClick={() => setValue("priority", "Low")}
                  variant={field.value === "Low" ? "contained" : "outlined"}
                  color={field.value === "Low" ? "info" : "primary"}
                  sx={{ textTransform: "none" }}
                >
                  Low
                </Button>
                <Button
                  onClick={() => setValue("priority", "Moderate")}
                  variant={field.value === "Moderate" ? "contained" : "outlined"}
                  color={field.value === "Moderate" ? "warning" : "primary"}
                  sx={{ textTransform: "none" }}
                >
                  Moderate
                </Button>
                <Button
                  onClick={() => setValue("priority", "High")}
                  variant={field.value === "High" ? "contained" : "outlined"}
                  color={field.value === "High" ? "error" : "primary"}
                  sx={{ textTransform: "none" }}
                >
                  High
                </Button>
              </ButtonGroup>
            )}
          />
          {errors.priority && (
            <FormHelperText error>{errors.priority.message}</FormHelperText>
          )}
        </Box>
      </Box>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: '1.05rem',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 2,
        }}
      >
        Create Task
      </Button>
    </Box>
  );
};

AddTask.propTypes = {
  setSelectedDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default AddTask;
