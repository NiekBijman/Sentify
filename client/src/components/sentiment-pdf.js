import React from 'react';

const PDF = props => {
  return (
    <i className="material-icons" onClick={((props.page === 0)
                                              ? evt => props.handlePDFCreation(evt)
                                              : console.log("Showing pdf")
                                          )}>picture_as_pdf</i>
  );
};

export default PDF;
