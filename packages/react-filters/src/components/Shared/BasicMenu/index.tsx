import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  label: JSX.Element | string,
  items: {
    label: string,
    value: string,
    onClick: (value: string) => void
  }[]
}

export default function SimpleMenu(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        {props.label}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {props.items.map(({ label, onClick, value }) => <MenuItem onClick={(e) => {
          handleClose();
          onClick(value)
        }}>{label}</MenuItem>)}
      </Menu>
    </div>
  );
}
