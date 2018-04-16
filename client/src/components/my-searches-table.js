import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import SentimentPDF from '../components/sentiment-pdf';
import Checkbox from 'material-ui/Checkbox';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});
  
class MySearchesTable extends React.Component {
    handleClick = (event, id) => {
        if (event.target.tagName === "I") {
            alert("Creating PDF file for download");
        } else {
            window.location.assign('/search?id=' + id);
        }
    };

    render() {
        return (
            <Paper className={this.props.classes.root}>
                <Table className={this.props.classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Subject</TableCell>
                            <TableCell>Continent</TableCell>
                            <TableCell>Time Span</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Download</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map(n => {
                            return (
                            <TableRow hover onClick={event => this.handleClick(event, n.id)} key={n.id}>
                                <TableCell><div>{n.subject}</div></TableCell>
                                <TableCell><div>{n.continent}</div></TableCell>
                                <TableCell><div>{n.dateStart} / {n.dateFinish}</div></TableCell>
                                <TableCell><div>{n.dateCreated}</div></TableCell>
                                <TableCell><div>{(n.downloadPDF
                                                    ? <SentimentPDF/>     
                                                    : <span></span>
                                                )}</div>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

MySearchesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MySearchesTable);