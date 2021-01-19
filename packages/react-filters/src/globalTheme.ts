import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiInputBase: {
			root: {
				fontFamily: 'Segoe UI'
			}
		},
		MuiOutlinedInput: {
			input: {
				padding: 5
			}
		},
		MuiFormControl: {
			root: {
				justifyContent: 'center'
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
