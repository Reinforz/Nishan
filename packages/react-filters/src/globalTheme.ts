import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiInputBase: {
			root: {
				fontFamily: 'Segoe UI'
			}
		},
		MuiMenuItem: {
			root: {
				fontFamily: 'Segoe UI'
			}
		},
		MuiFormLabel: {
			root: {
				fontFamily: 'Segoe UI'
			}
		}
	}
});
