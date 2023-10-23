import React, { useEffect, useRef, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import IconDownArrow from '@/components/Icon/IconDownArrow';
import helper from '@/libs/helper';

const MultipleSelectWithSearch = ({ list, name, keyName, selectedoptions, setSelectedoptions }) => {
    const [filterData, setfilterData] = useState(list);
    const box = useRef();
    const [search, setSearch] = useState('');

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedoptions([...selectedoptions, selectedValue]);
        } else {
            setSelectedoptions(selectedoptions.filter((value) => value !== selectedValue));
        }
    };

    const getNamesByIds = (ids) => {
        const result = [];
        if (!!ids) {
            for (const id of ids) {
                const item = list.find((objItem) => objItem.id == id);
                if (item) {
                    result.push(item[keyName]);
                } else {
                    result.push(id);
                }
            }
        }

        return result;
    };

    useEffect(() => {
        const data = list?.filter((d) => d[keyName].toLowerCase().includes(search.toLowerCase())) || [];
        data.sort((a, b) => {
            {
                return selectedoptions.includes(b.id.toString()) - selectedoptions.includes(a.id.toString());
            }
        });
        setfilterData(data);
    }, [search, list, keyName, selectedoptions]);

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
                        {selectedoptions && selectedoptions.length === 0
                            ? name
                            : helper.trancateString(getNamesByIds(selectedoptions).join(','))}
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
                {filterData.map((option) => {
                    return (
                        <label key={option.id} className="flex items-center py-2 px-5 capitalize hover:bg-primary">
                            <input
                                type="checkbox"
                                className="mr-2 block w-full cursor-pointer py-2.5 px-5 text-left hover:bg-lightblue1"
                                value={option.id}
                                checked={selectedoptions && selectedoptions.includes(option.id.toString())}
                                onChange={handleChange}
                            />
                            {helper.trancateString(option[keyName])}
                        </label>
                    );
                })}
            </div>
        </Dropdown>
    );
};

export default MultipleSelectWithSearch;
