import React, { useRef, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import IconDownArrow from '@/components/Icon/IconDownArrow';
import helper from '@/libs/helper';

const MultipleSelect = ({ list, name, keyName, selectedoptions, setSelectedoptions }) => {
    const box = useRef();

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

        for (const id of ids) {
            const item = list.find((objItem) => objItem.id == id);
            if (item) {
                result.push(item[keyName]);
            } else {
                result.push(id);
            }
        }

        return result;
    };

    return (
        <div className="flex items-center justify-between">
            <div className="relative">
                <Dropdown
                    usePortal={false}
                    strategy="absolute"
                    ref={box}
                    btnClassName="btn-secondary inline-flex items-center justify-between gap-[9px] ml-auto font-normal w-52"
                    button={
                        <>
                            {selectedoptions.length === 0
                                ? name
                                : helper.trancateString(getNamesByIds(selectedoptions).join(','))}
                            <IconDownArrow />
                        </>
                    }
                >
                    <div className=" h-full max-h-[150px] overflow-y-auto text-sm">
                        {list.map((option) => {
                            return (
                                <label key={option.id} className="my-3 flex px-5 capitalize">
                                    <input
                                        type="checkbox"
                                        className="mr-2 block w-full cursor-pointer py-2.5 px-5 text-left hover:bg-lightblue1"
                                        value={option.id}
                                        checked={selectedoptions.includes(option.id.toString())}
                                        onChange={handleChange}
                                    />
                                    {helper.trancateString(option[keyName])}
                                </label>
                            );
                        })}
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default MultipleSelect;
