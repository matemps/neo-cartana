const Pagination = ({
    currentPage,
    onPageChange,
    totalPages,
}: {
    currentPage: number,
    onPageChange: (page: { selected: number }) => void,
    totalPages: number
}) => {
    if (totalPages < 1) {
        return <></>;
    }
    return (
        <div>
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange({ selected: currentPage - 1})}
                >
                    Prev
                </button>
            </div>
            {(() => {
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                        <div>
                            <button
                                key={i}
                                onClick={() => onPageChange({ selected: i })}
                                disabled={currentPage == i}
                            >
                                {i}
                            </button>
                        </div>
                    );
                }
                return pages;
            })()} {/* immediate invocation */}
            <div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange({ selected: currentPage + 1})}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
