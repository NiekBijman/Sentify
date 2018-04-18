import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import { lighten } from 'material-ui/styles/colorManipulator';
import { modelInstance } from '../model/model';
import DeleteMySearches from '../components/delete-my-searches';
import HistoryMySearches from '../components/history-my-searches';
import SentimentPDF from '../components/sentiment-pdf';
import DeleteMySearchesModal from '../components/delete-my-searches-modal';

const columnData = [
  { id: 'subject', numeric: false, disablePadding: true, label: 'Subject' },
  { id: 'continent', numeric: false, disablePadding: false, label: 'Continent' },
  { id: 'time-span', numeric: false, disablePadding: false, label: 'Time Span' },
  { id: 'date-created', numeric: false, disablePadding: false, label: 'Date Created' },
  { id: 'download', numeric: false, disablePadding: false, label: 'Download' },
];

class EnhancedTableHead extends React.Component {

  render() {
    const { onSelectAllClick, numSelected, rowCount} = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              color="primary"
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                {column.label}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class EnhancedTableToolbar extends React.Component {

    render () {
        const { numSelected, classes, handleClickDeleteBtn, open, handleCloseModal, handleConfirm, handleCancel } = this.props;

        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.title}>
                    {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} selected
                    </Typography>
                    ) : (
                    <Typography variant="title">My Searches</Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <DeleteMySearches handleClick={handleClickDeleteBtn}/>
                    ) : (
                        <HistoryMySearches/>
                    )}
                </div>
                <DeleteMySearchesModal 
                    open={open} 
                    handleClose={handleCloseModal} 
                    handleConfirm={handleConfirm}
                    handleCancel={handleCancel}
                />
            </Toolbar>
        );
    }
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  handleClickDeleteBtn: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired, 
  handleCloseModal: PropTypes.func.isRequired, 
  handleConfirm: PropTypes.func.isRequired, 
  handleCancel: PropTypes.func.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class MySearchesTable extends React.Component {
  constructor(props, context) {
      super(props, context);

      this.state = {
          selected: [],
          data: modelInstance.getSearchHistory().data,
          page: 0,
          rowsPerPage: 5,
          open: false,
      };
  }

  componentDidMount() {
      modelInstance.addObserver(this);
  }

  componentWillUnmount() {
      modelInstance.removeObserver(this);
  }

  update() {
      this.setState({
          data: modelInstance.getSearchHistory().data,
      });
  }

  handleCloseModal = () => {
      this.setState({ 
          open: false 
      });
  };

  handleConfirm = () => {
      modelInstance.deleteSearchHistory(this.state.selected);
      console.log("Deletion completed");
      this.handleCloseModal();
      this.setState({ 
        selected: []
      });
  }

  handleCancel = () => {
      console.log("Deletion canceled.");
      this.handleCloseModal();
  }

  handleClickDeleteBtn = (event) => {
      this.setState({
          open: true
      });
  };

  handleRedirection = (event, id) => {
      if (event.target.tagName === "I") {
          alert("Creating PDF file for download");
      } else if (event.target.tagName !== "INPUT" && !event.target.getAttribute("class").includes("checkbox")) {
          window.location.assign('/search?id=' + id);
      }
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
            numSelected={selected.length}
            handleClickDeleteBtn={this.handleClickDeleteBtn}
            open={this.state.open}
            handleCloseModal={this.handleCloseModal} 
            handleConfirm={this.handleConfirm} 
            handleCancel={this.handleCancel}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={this.handleSelectAllClick}
              rowCount={data.length || -1}
            />
            <TableBody>
              {data.length > 0 && data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleRedirection(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox" className="checkbox">
                      <Checkbox checked={isSelected} color="primary" onClick={event => this.handleClick(event, n.id)}/>
                    </TableCell>
                    <TableCell padding="none">{n.subject}</TableCell>
                    <TableCell>{n.continent}</TableCell>
                    <TableCell>{n.dateStart} / {n.dateFinish}</TableCell>
                    <TableCell>{n.dateCreated}</TableCell>
                    <TableCell>{(n.downloadPDF
                                    ? <SentimentPDF/>     
                                    : <span></span>
                                )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

MySearchesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MySearchesTable);