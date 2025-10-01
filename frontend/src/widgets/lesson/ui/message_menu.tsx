import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface MessageMenuProps {
  anchorEl: HTMLElement | null;
  regeneratingMessageId: string | null;
  onClose: () => void;
  onRegenerate: () => void;
}

export const MessageMenu = ({
  anchorEl,
  regeneratingMessageId,
  onClose,
  onRegenerate,
}: MessageMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: 200, borderRadius: 2 },
      }}
    >
      <MenuItem
        onClick={onRegenerate}
        disabled={regeneratingMessageId !== null}
      >
        <ListItemIcon>
          <Refresh fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {regeneratingMessageId !== null
            ? 'Генерация...'
            : 'Перегенерировать ответ'}
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};
