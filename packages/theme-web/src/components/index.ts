import type { Components, Theme } from '@mui/material/styles';

import { buttonOverrides } from './button.js';
import { cardOverrides } from './card.js';
import { cssBaselineOverrides } from './css-baseline.js';
import { dialogOverrides } from './dialog.js';
import { outlinedInputOverrides, textFieldOverrides } from './text-field.js';

export const componentOverrides: Components<Theme> = {
	MuiCssBaseline: cssBaselineOverrides,
	MuiButton: buttonOverrides,
	MuiCard: cardOverrides,
	MuiTextField: textFieldOverrides,
	MuiOutlinedInput: outlinedInputOverrides,
	MuiDialog: dialogOverrides,
};
