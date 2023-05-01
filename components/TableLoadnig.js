import React from 'react';

const TableLoadnig = ({totalTr, totalTd , tdWidth}) => {
    return (
        <>
            {Array.from(Array(totalTr).keys()).map((i) => {
                return (
                    <tr key={i}>
                        {Array.from(Array(totalTd).keys()).map((ci) => {
                            return (
                                <td key={ci}>
                                    <div className={`h-5 w-${tdWidth} animate-pulse rounded bg-lightblue1`}></div>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </>
    );
};

export default TableLoadnig;
