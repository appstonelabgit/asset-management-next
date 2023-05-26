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

    return (
        <div className="flex items-center justify-between">
            <div className="relative">
                <Dropdown
                    ref={box}
                    btnClassName="btn-secondary inline-flex items-center gap-[9px] ml-auto font-normal"
                    button={
                        <>
                            {selectedoptions.length === 0 ? name : selectedoptions.join(',')}
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
