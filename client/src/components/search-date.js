import React from 'react';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import {modelInstance} from "../model/model";


const styles = theme => ({
  container: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // background: 'rgba(255, 255, 255, 0.48)!important'
  },
  textField: {
    width: "80%"
  },
});

/*
*  Returns Date object which is num days away from today
*/
const fromToday = num => {
  let date = new Date();
  date.setDate(date.getDate() + num);
  return date;
};

const SearchDate = props => {
  const { classes,handleClose, anchorEl, click, dayChange, disabled } = props;
  const ITEM_HEIGHT = 48;

  /*
  *  Sets dateString variable to a string that tells us how far back we are searching.
  *  Dates in the future will be treated as today.
  *  Dates more than 7 days ago will be set to 7 days ago.
  */
  const today = new Date();
  const dateIn = new Date(modelInstance.getDate());
  const diffMillis = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(dateIn.getFullYear(), dateIn.getMonth(), dateIn.getDate());
  let diffDays;
  let dateString;
  if (diffMillis < 0){
    // date argument is in the future. Not okay! Act as if date = today
    diffDays = 0;
  }else{
    diffDays = Math.floor( diffMillis / ( 1000 * 60 * 60 * 24 ) );
    // Can only go back 7 days maximum.
    if (diffDays > 7){
      diffDays = 7;
    }
  }
  if (diffDays === 0){
    dateString = "today";
  }else if (diffDays === 1){
    dateString = "yesterday";
  }
  else{
    dateString = diffDays + " DAYS BACK";
  }
  if (disabled){
    dateString = "";
  }

    return(
    <React.Fragment>
      <Button
        // variant="raised"
        size='small'
        aria-owns={anchorEl ? 'simple-menu' : null}
        aria-haspopup="true"
        onClick={click}
        margin={10}
      >
        {dateString}
      </Button>
      <Menu
        className={classes.container}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            // width: 200,
            borderRadius: '10',
            background: 'rgba(255, 255, 255, 0.48)!important',

          },
        }}
        id="simple-date-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={ () => handleClose() }
      >
        {/* {daysList} */}
        <MenuItem onClick={ () => dayChange( fromToday(0) ) } >Today</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-1) ) }>Yesterday</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-2) ) }>2 days ago</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-3) ) }>3 days ago</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-4) ) }>4 days ago</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-5) ) }>5 days ago</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-6) ) }>6 days ago</MenuItem>
        <MenuItem onClick={ () => dayChange( fromToday(-7) ) }>7 days ago</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default withStyles(styles)(SearchDate);
