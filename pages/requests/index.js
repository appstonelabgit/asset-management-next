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
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconInfo from '@/components/Icon/IconInfo';
import Modal from '@/components/Modal';
import MultipleSelect from '@/components/MultipleSelect';
import { useSelector } from 'react-redux';
import CommonSideModal from '@/components/CommonSideModal';
import IconStatus from '@/components/Icon/IconStatus';

const Request = () => {
    const { user } = useSelector((state) => state.auth);

    const popup = useRef();
    const SideModal = useRef();

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [status, setStatus] = useState('');
    const [request_type, setRequest_type] = useState('');
    const [typeSelected, setTypeSelected] = useState([]);
    const [typeData, setTypeData] = useState([
        { id: 'asset', type: 'Asset' },
        { id: 'accessory', type: 'Accessory' },
        { id: 'component', type: 'Component' },
    ]);
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'user_name' });

    const getRequests = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/requests`, {
                    params: {
                        filter: searchWord,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                        type: typeSelected.length === 0 ? '' : typeSelected,
                        request_type: request_type,
                        status: status,
                    },
                })
                .then(({ data }) => {
                    setRequests(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order, typeSelected, request_type, status]
    );

    const defaultStatusParams = { id: '', status: '', reject_reason: '' };
    const [statusParams, setStatusParams] = useState(defaultStatusParams);

    const refresh = () => {
        getRequests(currentPage, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        setRequest_type('');
        setTypeSelected([]);
        setStatus('');
    };

    const sortByField = (field) => {
        order.order_field === field
            ? order.sort_order === 'asc'
                ? setOrder({ ...order, sort_order: 'desc' })
                : setOrder({ ...order, sort_order: 'asc' })
            : setOrder({ ...order, sort_order: 'desc', order_field: field });
    };

    const updateStatus = async (values, id) => {
        try {
            if (statusParams?.status === 'Rejected' || statusParams?.status === 'Onhold') {
                await axios.post(`/requests/response/${statusParams?.id}`, values);
            } else {
                await axios.post(`/requests/response/${id}`, { status: values });
            }
            popup?.current.close();
            refresh();
        } catch {}
    };

    const handleStatusEdit = (id) => {
        setStatusParams({
            id: id,
            status: '',
            reject_reason: '',
        });
        popup?.current?.open();
    };
    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/requests/${id}`);
            refresh();
        }
    };

    const defaultParams = {
        id: '',
        request_type: '',
        type: '',
        sub_type: '',
        description: '',
    };
    const [params, setParams] = useState(defaultParams);
    const [Type, setType] = useState({ name: '', data: [] });

    const handleType = (type) => {
        try {
            if (type === 'asset') {
                setType({ ...Type, name: 'Assets' });
            } else if (type === 'accessory') {
                setType({ ...Type, name: 'Accessories' });
            } else if (type === 'component') {
                setType({ ...Type, name: 'Components' });
            } else {
                setType({ ...Type, name: '' });
            }
        } catch (error) {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/requests/${id}`).then(({ data }) => {
                setParams({
                    id: data.id,
                    request_type: data.request_type,
                    type: data.type,
                    sub_type: data.sub_type,
                    description: data.description,
                });
                handleType(data.type);
                SideModal?.current?.open();
            });
        } catch (error) {}
    };

    const formHandler = async (values) => {
        try {
            if (params?.id) {
                await axios.post(`/requests/${params?.id}`, values);
            } else {
                await axios.post('/employees/requests', values);
            }
            refresh();
            SideModal?.current?.close();
            formRef.current.resetForm();
            setType({ ...Type, name: '' });
        } catch {}
    };

    useEffect(() => {
        try {
            axios.get(`/employees/dependent/information`).then(({ data }) => {
                setType({
                    name: '',
                    data: { Assets: data.asset, Accessories: data.accessory, Components: data.component },
                });
            });
        } catch (error) {}
    }, []);

    useEffect(() => {
        getRequests(currentPage, pageLimit);
    }, [getRequests, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Requests</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                        <div className="w-[200px]">
                            <select
                                name="status"
                                className="form-select"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                }}
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Onhold">On Hold</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="w-[200px]">
                            <select
                                name="request_type"
                                className="form-select"
                                value={request_type}
                                onChange={(e) => {
                                    setRequest_type(e.target.value);
                                }}
                            >
                                <option value="">Select Request</option>
                                <option value="new">New</option>
                                <option value="replace">Replace</option>
                            </select>
                        </div>

                        <div className="mb-0 mt-2">
                            <MultipleSelect
                                list={typeData}
                                name="Types"
                                keyName="type"
                                selectedoptions={typeSelected}
                                setSelectedoptions={setTypeSelected}
                            />
                        </div>
                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="form-input pr-10"
                                    placeholder="Search..."
                                    value={searchWord}
                                    onChange={(event) => setSearchWord(event.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            refresh();
                                        }
                                        if (searchWord.length === 0) {
                                            refresh();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="text-black-dark absolute top-2 right-0 my-auto inline-flex h-10 w-10 items-center justify-center hover:opacity-70"
                                    onClick={refresh}
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                resetFilter();
                            }}
                            className="btn-secondary mb-0 mt-2"
                        >
                            Reset Filter
                        </button>
                        {user?.role === 2 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setParams(defaultParams);
                                    setType({ ...Type, name: '' });
                                    SideModal?.current?.open();
                                }}
                                className="btn mb-0 mt-2"
                            >
                                Send Request
                            </button>
                        )}
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                {user?.role === 1 && (
                                    <th>
                                        <div
                                            className={`flex cursor-pointer  ${
                                                order.order_field === 'user_name' ? 'text-darkprimary' : ''
                                            }`}
                                            onClick={() => sortByField('user_name')}
                                        >
                                            <span>User Name</span>
                                            <IconUpDownArrow />
                                        </div>
                                    </th>
                                )}
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'request_type' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('request_type')}
                                    >
                                        <span>Request Type</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'type' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('type')}
                                    >
                                        <span>Type</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'sub_type' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('sub_type')}
                                    >
                                        <span>Item</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div className="flex cursor-pointer  ">
                                        <span>Description</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'status' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('status')}
                                    >
                                        <span>Status</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer  ">
                                        <span>Reject Reason</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'created_at' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('created_at')}
                                    >
                                        <span>Date</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th className="!text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={9} totalTd={9} tdWidth={60} />
                            ) : requests?.length !== 0 ? (
                                requests?.map((request) => {
                                    return (
                                        <tr key={request.id} className="bg-white">
                                            {user?.role === 1 && <td className="capitalize">{request?.user_name}</td>}
                                            <td className="capitalize">{request?.request_type}</td>
                                            <td className="capitalize">{request?.type}</td>
                                            <td className="capitalize">{helper.trancateSmallString(request?.sub_type)}</td>
                                            <td>{helper.trancateString(request?.description)}</td>
                                            <td className="flex cursor-pointer items-center space-x-2 capitalize">
                                                <span className={`status status-${request?.status}`}>
                                                    {request?.status}
                                                </span>
                                            </td>

                                            <td>{helper.trancateString(request?.reject_reason || '-')}</td>

                                            <td>{helper?.getFormattedDate(request?.created_at)}</td>

                                            <td>
                                                <div className="flex items-center justify-end">
                                                    {user?.role === 1 && request?.status === 'Pending' && (
                                                        <button
                                                            type="button"
                                                            className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                            onClick={() => {
                                                                handleStatusEdit(request?.id);
                                                            }}
                                                        >
                                                            <IconStatus />
                                                        </button>
                                                    )}

                                                    {user?.role === 2 && request?.status === 'Pending' && (
                                                        <button
                                                            type="button"
                                                            className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                            onClick={() => {
                                                                handleEdit(request?.id);
                                                            }}
                                                        >
                                                            <IconEdit />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(request?.id)}
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
                                    <td colSpan={9}>No data is available.</td>
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
                        data={requests}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <Modal ref={popup} title={'Update Status'}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={statusParams} onSubmit={updateStatus}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white py-[25px]">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                type="button"
                                                className="btn my-0 bg-[#c9f5cd] py-1"
                                                onClick={() => {
                                                    updateStatus('Approved', statusParams?.id);
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                type="button"
                                                className="btn my-0 bg-[#fef08a] py-1"
                                                onClick={() => {
                                                    setStatusParams({ ...statusParams, status: 'Onhold' });
                                                    setFieldValue('status', 'Onhold');
                                                }}
                                            >
                                                On Hold
                                            </button>
                                            <button
                                                type="button"
                                                className="btn my-0 bg-[#f5c9c9] py-1"
                                                onClick={() => {
                                                    setStatusParams({ ...statusParams, status: 'Rejected' });
                                                    setFieldValue('status', 'Rejected');
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>

                                        {statusParams?.status === 'Rejected' && (
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="form-label">Reject Reason</label>

                                                    <Field
                                                        as="textarea"
                                                        name="reject_reason"
                                                        type="text"
                                                        className="form-input rounded-l-none"
                                                        placeholder="Reject reason"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {statusParams?.status === 'Onhold' && (
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="form-label">Onhold Reason</label>

                                                    <Field
                                                        as="textarea"
                                                        name="reject_reason"
                                                        type="text"
                                                        className="form-input rounded-l-none"
                                                        placeholder="Onhold reason"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {(statusParams?.status === 'Rejected' || statusParams?.status === 'Onhold') && (
                                            <div>
                                                <ButtonField
                                                    type="submit"
                                                    loading={isSubmitting}
                                                    className="btn block w-full"
                                                >
                                                    Submit
                                                </ButtonField>
                                            </div>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Modal>
                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Request' : 'Send Request'}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white py-[25px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Request type</label>

                                                <Field
                                                    as="select"
                                                    name="request_type"
                                                    className="form-select rounded-l-none"
                                                >
                                                    <option value="">Select Request</option>
                                                    <option value="new">New</option>
                                                    <option value="replace">Replace</option>
                                                </Field>
                                            </div>
                                            <div>
                                                <label className="form-label">Type</label>

                                                <Field
                                                    as="select"
                                                    name="type"
                                                    className="form-select rounded-l-none"
                                                    onChange={(e) => {
                                                        setFieldValue('type', e.target.value);
                                                        handleType(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Select Type name</option>
                                                    <option value="asset">Asset</option>
                                                    <option value="accessory">Accessory</option>
                                                    <option value="component">Component</option>
                                                </Field>
                                            </div>
                                            {Type?.name && (
                                                <>
                                                    <div>
                                                        <label className="form-label">{Type?.name}</label>

                                                        <Field
                                                            as="select"
                                                            name="sub_type"
                                                            className="form-select rounded-l-none"
                                                        >
                                                            <option value="">Select {Type?.name} name</option>
                                                            {Type?.data[Type?.name]?.map((data) => {
                                                                return (
                                                                    <option key={data.id} value={data.name}>
                                                                        {data.name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Field>
                                                    </div>
                                                    <div>
                                                        <label className="form-label">Description</label>

                                                        <Field
                                                            as="textarea"
                                                            name="description"
                                                            type="text"
                                                            className="form-input rounded-l-none"
                                                            placeholder="Description"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <ButtonField
                                                type="submit"
                                                loading={isSubmitting}
                                                className="btn block w-full"
                                            >
                                                Submit
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

export default Request;

Request.middleware = {
    auth: true,
    verify: true,
};
