import PropTypes from 'prop-types';
import { ListItem, ListItemText, IconButton, Checkbox, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Task = ({ text, taskId, isCompleted, handleToggle, handleDelete }) => {
    return (
        <ListItem 
            sx={{ 
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                marginBottom: "5px", 
                backgroundColor: isCompleted ? 'rgba(0, 0, 0, 0.05)' : 'inherit'
            }}
        >
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={isCompleted}
                    onChange={() => handleToggle(taskId, isCompleted)}
                    disableRipple
                />
            </ListItemIcon>
            <ListItemText 
                primary={text} 
                sx={{ 
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    opacity: isCompleted ? 0.6 : 1
                }} 
            />
            <IconButton color="primary">
                <EditIcon />
            </IconButton>
            <IconButton color="secondary" onClick={() => handleDelete(taskId)}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
};

Task.propTypes = {
    text: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default Task;