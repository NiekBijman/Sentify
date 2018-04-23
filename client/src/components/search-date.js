import React from 'react';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20'
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: "100%"
  },
});

const SearchDate = ({date, anchorEl, click, dayChange}) => {
    // const days = [
    //     {date: 'Today'},
    //     {date: 'Yesterday'},
    //     {date: '2 days ago'},
    //     {date: '3 days ago'},
    //     {date: '4 days ago'},
    //     {date: '5 days ago'},
    //     {date: '6 days ago '},
    //     {date: '7 days ago'},
    //     ];
    //
    // let daysList = null;
    // {daysList = days.map((date, index) => (
    //   console.log(days, index),
    //   <MenuItem
    //       key={index}
    //       onClick={this.onDayChange(date.date)}
    //   >{date.date}</MenuItem>)
    // )}
    return(

    <div className='container-search-date' >
      <Button
        // variant="raised"
        aria-owns={anchorEl ? 'simple-menu' : null}
        aria-haspopup="true"
        onClick={click}
        margin={10}
      >
        {date}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={dayChange}
      >
        {/* {daysList} */}

        <MenuItem onClick={dayChange}>Yesterday</MenuItem>
        <MenuItem onClick={dayChange}>2 Days past</MenuItem>
        <MenuItem onClick={dayChange}>3 Days past</MenuItem>
        <MenuItem onClick={dayChange}>4 Days past</MenuItem>
        <MenuItem onClick={dayChange}>5 Days past</MenuItem>
        <MenuItem onClick={dayChange}>6 Days past</MenuItem>
        <MenuItem onClick={dayChange}>7 Days past</MenuItem>
      </Menu>
    </div>
  );
}

export default withStyles(styles)(SearchDate);
