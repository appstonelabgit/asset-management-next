import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import IconView from '@/components/Icon/IconView';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '@/libs/axios';
import TableLoadnig from '@/components/TableLoadnig';
import CommonSideModal from '@/components/CommonSideModal';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';

const Model = (props) => {
    const Modal = useRef();

    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const getModels = useCallback((page = 1, limit = 10) => {
        setIsLoading(true);
        axios.get(`/model?page=${page}&limit=${limit}`).then(({ data }) => {
            setModels(data.data);
            setTotalRecords(data.meta.total);
            setTotalPages(data.meta.last_page);
            setIsLoading(false);
        });
    }, []);

    const defaultParams = { id: '', model_name: '', serial_number: '', description: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getModels(currentPage, pageLimit);
    };

    const formHandler = async (values) => {
        try {
            if (params?.id) {
                await axios.post(`/model/${params?.id}`, values);
            } else {
                await axios.post('/model', values);
            }
            Modal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (obj) => {
        setParams({
            id: obj.id,
            model_name: obj.model_name,
            serial_number: obj.serial_number,
            description: obj.description,
        });
        Modal?.current?.open();
    };

    const handleDelete = async (id) => {
        await axios.post(`/model/${id}/delete`);
        refresh();
    };

    useEffect(() => {
        getModels(currentPage, pageLimit);
    }, [getModels, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl">Model</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                        <select className="form-select md:max-w-[150px]">
                            <option value="">Status...</option>
                            <option value={1}>pending</option>
                            <option value={2}>proccessing</option>
                            <option value={3}>shipped</option>
                            <option value={4}>delivered</option>
                            <option value={5}>cancelled</option>
                            <option value={6}>returned</option>
                            <option value={7}>completed</option>
                        </select>

                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input type="text" className="form-input pr-10" placeholder="Search..." />
                                <button
                                    type="button"
                                    className="text-black-dark absolute top-2 right-0 my-auto inline-flex h-10 w-10 items-center justify-center hover:opacity-70"
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setParams(defaultParams), Modal?.current?.open();
                            }}
                            className="btn mb-0 mt-2"
                        >
                            add Model
                        </button>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Name</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Serial number</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Description</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Date</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={6} totalTd={6} tdWidth={60} />
                            ) : models?.length !== 0 ? (
                                models?.map((model) => {
                                    return (
                                        <tr key={model.id} className="bg-white">
                                            <td>
                                                <input type="checkbox" className="form-checkbox" />
                                            </td>
                                            <td>{model?.model_name}</td>

                                            <td>{model?.serial_number}</td>
                                            <td>{helper.trancateString(model?.description)}</td>

                                            <td>{helper?.getFormattedDate(model?.created_at)}</td>
                                            <td>
                                                <div className="flex">
                                                    {/* <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#eab308] bg-[#eab308] p-2 hover:bg-transparent"
                                                    >
                                                        <IconView />
                                                    </button> */}
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(model);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(model?.id)}
                                                    >
                                                        <IconDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={6}>No data is available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-10">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        pageLimit={pageLimit}
                        data={models}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <CommonSideModal ref={Modal}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <h2 className="text-base font-semibold leading-7">{params?.id ? 'Edit' : 'Add'} model</h2>

                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5  bg-white p-[25px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Name</label>

                                                <Field
                                                    name="model_name"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="name"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Serial number</label>

                                                <Field
                                                    name="serial_number"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Serial number"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">description</label>

                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="address"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <ButtonField
                                                type="submit"
                                                loading={isSubmitting}
                                                className="btn block w-full"
                                            >
                                                {params?.id ? 'Edit' : 'Add'}
                                            </ButtonField>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </CommonSideModal>
            </div>
        </div>
    );
};

export default Model;

Model.middleware = {
    auth: true,
    verify: true,
};
