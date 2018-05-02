import React from 'react';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Notification = props => {

    const { open, close, text } = props;
    return (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          autoHideDuration={6000}
          onClose={props.handleClose()}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{text}</span>}
          action={[
            // <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
            //   UNDO
            // </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={close}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
    );
}

export default Notification;

// import React from 'react';
// import Button from 'material-ui/Button';
// import Snackbar from 'material-ui/Snackbar';
//
// const Notification = props => {
//     const { open, close } = props;
//     return (
//       <React.Fragment>
//         <Snackbar
//           anchorOrigin={{ vertical:'top', horizontal:'center' }}
//           open={open}
//           onClose={close}
//           autoHideDuration={6000}
//           SnackbarContentProps={{
//             'aria-describedby': 'message-id',
//           }}
//           message={<span id="message-id">{props.text}</span>}
//         />
//       </React.Fragment>
//     );
// }
//
// export default Notification;
