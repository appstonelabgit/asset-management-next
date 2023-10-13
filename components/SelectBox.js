import React, { useEffect, useRef, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import IconDownArrow from '@/components/Icon/IconDownArrow';
import helper from '@/libs/helper';

const SelectBox = ({ list, name, keyName, defaultValue, onChange }) => {
    const [value, setValue] = useState(defaultValue);
    const [filterData, setFilterData] = useState(list);
    const box = useRef();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const data = list?.filter((d) => d[keyName].toLowerCase().includes(search.toLowerCase())) || [];
        setFilterData(data);
    }, [search, list, keyName]);
    return (
        <Dropdown
            usePortal={false}
            strategy="absolute"
            zindex="z-[60]"
            ref={box}
            showBorder={true}
            btnClassName={`btn-secondary inline-flex items-center gap-[9px] w-full justify-between font-normal`}
            button={
                <>
                    <div className="truncate">
                        {!value
                            ? name
                            : helper.trancateString(list?.find((val) => val?.id == value)?.[keyName]) || name}
                    </div>
                    <IconDownArrow />
                </>
            }
        >
            <div className="sticky top-0 bg-white px-5 py-3 shadow-md">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-input mt-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className=" h-full max-h-[150px] overflow-y-auto text-sm">
                <li
                    className="flex items-center py-2 px-5 capitalize hover:bg-primary"
                    onClick={() => {
                        setValue('');
                        onChange('');
                        box.current?.close();
                    }}
                >
                    {name}
                </li>
                {filterData.map((option) => {
                    return (
                        <li
                            key={option.id}
                            className="flex items-center py-2 px-5 capitalize hover:bg-primary"
                            onClick={() => {
                                setValue(option.id);
                                onChange(option.id);
                                box.current?.close();
                            }}
                        >
                            {helper.trancateString(option[keyName])}
                        </li>
                    );
                })}
            </div>
        </Dropdown>
    );
};

export default SelectBox;
