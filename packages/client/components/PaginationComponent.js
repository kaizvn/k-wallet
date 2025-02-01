import { Theme } from '@revtech/rev-shared/layouts';
import React from 'react';
import ReactPaginate from 'react-paginate';

const { ThemeConsumer } = Theme;
const PAGE_SIZE_DEFAULT = 10;
const PAGE_DEFAULT = 0;
class PaginationComponent extends React.Component {
  handlePageChange(state) {
    this.props.actions(state.selected);
  }
  render() {
    const { totalCount, page } = this.props;
    return (
      <ThemeConsumer>
        {theme => (
          <React.Fragment>
            <link
              rel="stylesheet"
              type="text/css"
              href="/static/customs/pagination.min.css"
            />
            <ReactPaginate
              previousLabel={<div className="primary-background">Previous</div>}
              nextLabel={<div className="primary-background">Next</div>}
              disabledClassName={'disabled-button'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(totalCount / PAGE_SIZE_DEFAULT)}
              forcePage={page || PAGE_DEFAULT}
              onPageChange={e => this.handlePageChange(e)}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              pageRangeDisplayed={10}
            />
            <style jsx>
              {`
                .primary-background {
                  background-color: ${theme.primaryColor};
                  color: #fff;
                  padding-left: 12px;
                  padding-right: 12px;
                  border-radius: 4px;
                }
              `}
            </style>
          </React.Fragment>
        )}
      </ThemeConsumer>
    );
  }
}

export default PaginationComponent;
