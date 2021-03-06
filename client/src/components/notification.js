import React from 'react';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Notification = props => {
      let cookieSettings = null;

      switch (props.notifications) {
        case 'SIGN_IN_FAILED':
          cookieSettings= <Button color="secondary" size="small" target="_blank" href='https://support.bigcommerce.com/articles/Public/How-do-I-allow-third-party-cookies-to-be-set-in-my-browser'>
                            Cookie Settings
                          </Button>
          break;
        default:
          break;
      }

      return (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={props.open}
            autoHideDuration={6000}
            onClose={props.handleClose}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{props.text}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={props.handleClose}
              >
                <CloseIcon />
              </IconButton>,
              cookieSettings
            ]}
          />
      );
    }

export default Notification;
