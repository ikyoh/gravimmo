import { itemsPerPage } from "config/api.config";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ReactPaginate from "react-paginate";

const Pagination = ({ totalItems = 20, page, setPage }) => {
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    if (pageCount === 1) return null;
    else
        return (
            <div className="bg-light dark:bg-dark w-full pr-5">
                <ReactPaginate
                    forcePage={page - 1}
                    breakLabel="..."
                    nextLabel={<MdKeyboardArrowRight />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={<MdKeyboardArrowLeft />}
                    renderOnZeroPageCount={null}
                    breakClassName={
                        "w-8 h-8 text-center block rounded-t-lg hover:bg-white dark:hover:bg-slate-800"
                    }
                    marginPagesDisplayed={2}
                    containerClassName={
                        "flex justify-end gap-2 text-dark dark:text-white py-6"
                    }
                    pageLinkClassName={
                        "flex justify-center items-center w-8 h-8 text-center block rounded-t-lg hover:bg-white dark:hover:bg-slate-800"
                    }
                    activeClassName={"border-accent border-b-4"}
                    previousClassName={
                        "flex items-center text-3xl hover:bg-white dark:hover:bg-slate-800 block h-8 w-8"
                    }
                    nextClassName={
                        "flex items-center text-3xl hover:bg-white dark:hover:bg-slate-800 block h-8 w-8"
                    }
                />
            </div>
        );
};

export default Pagination;
