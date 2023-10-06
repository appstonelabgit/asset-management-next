import React, { useRef } from 'react';
import Dropdown from '@/components/Dropdown';
import IconDownArrow from '@/components/Icon/IconDownArrow';

const Pagination = ({
    totalPages,
    currentPage,
    pageLimit,
    data,
    totalRecords,
    isLoading,
    setPageLimit,
    setCurrentPage,
}) => {
    const pageLimitRef = useRef();

    const perPageOption = [50, 100, 200];

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 text-lightblack">
                <ul className="flex items-center divide-x divide-lightblue">
                    {Array.from(Array(totalPages).keys()).map((i) => (
                        <li key={i + 1}>
                            <button
                                type="button"
                                className={
                                    currentPage == i + 1
                                        ? 'rounded-l bg-lightblue1 py-2.5 px-3 font-semibold'
                                        : 'bg-white py-2.5 px-3 transition hover:bg-lightblue1'
                                }
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li></li>
                </ul>
                <p>
                    {data?.length} of {totalRecords} records
                </p>
            </div>
            <div className="relative">
                <Dropdown
                    usePortal={false}
                    strategy="absolute"
                    key={isLoading}
                    ref={pageLimitRef}
                    btnClassName="btn-secondary inline-flex items-center gap-[9px] ml-auto font-normal"
                    button={
                        <>
                            {pageLimit}
                            <IconDownArrow />
                        </>
                    }
                >
                    <div className="w-[108px] text-sm">
                        {perPageOption.map((option) => {
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    className="block w-full cursor-pointer py-2.5 px-5 text-left hover:bg-lightblue1"
                                    onClick={() => {
                                        setPageLimit(option);
                                        pageLimitRef.current.close();
                                    }}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default Pagination;
