import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface IMenuItem {
  icon?: JSX.Element,
  label: string,
  onClick: () => void
}

interface Props {
  label: JSX.Element | string,
  items: (IMenuItem | null)[]
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
      <div onClick={handleClick} className="BasicMenu-label">
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
        {(props.items.filter(item => item) as IMenuItem[]).map(({ label, onClick, icon }) => <MenuItem key={label} onClick={(e) => {
          handleClose();
          onClick()
        }}>{icon && <span className="BasicMenu-items-icon">{icon}</span>} <span className="BasicMenu-items-label">{label}</span></MenuItem>)}
      </Menu>
    </div>
  );
}
