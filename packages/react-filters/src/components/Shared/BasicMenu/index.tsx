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

export default function BasicMenu(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="BasicMenu">
      <div onClick={handleClick}>
        {props.label}
      </div>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {props.items.map(({ label, onClick, value }) => <MenuItem key={label} onClick={(e) => {
          handleClose();
          onClick(value)
        }}>{label}</MenuItem>)}
      </Menu>
    </div>
  );
}
