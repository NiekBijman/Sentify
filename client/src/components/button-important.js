import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const style = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

const ButtonImportant = (props) => (
    <div>
      <Button Style={{style}} label="Search"  />
    </div>
);

export default ButtonImportant;
