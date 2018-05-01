import React from 'react';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';


const action = (
<Button color="secondary" size="small">
  Find out more
</Button>
);

class Notification extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
      vertical: null,
      horizontal: null,
      text: props.text
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open, text } = this.state;
    return (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          onClose={this.handleClose}
          action={action}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.text}</span>}
        />
    );
  }
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
