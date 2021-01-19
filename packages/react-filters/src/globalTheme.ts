import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	typography: {
		fontFamily: [ 'Segoe UI' ].join(',')
	},
	overrides: {
		MuiOutlinedInput: {
			input: {
				padding: 5
			}
		},
		MuiFormControl: {
			root: {
        justifyContent: 'center',
        width: "100%"
			}
		}
	}
});
