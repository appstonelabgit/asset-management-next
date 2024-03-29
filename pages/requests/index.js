import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import Pagination from '@/components/Pagination';
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
import SelectBox from '@/components/SelectBox';

const Request = () => {
    const { user } = useSelector((state) => state.auth);

    const popup = useRef();
    const SideModal = useRef();

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
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
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });
    const [userData, setUserData] = useState({});

    const getRequests = useCallback(
        (page = 1, limit = pageLimit, search = searchWord) => {
            setIsLoading(true);
            axios
                .get(`/requests`, {
                    params: {
                        filter: search,
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
                    setCurrentPage(data.meta.current_page);
                    setPageLimit(data.meta.per_page);
                    setRequests(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order, typeSelected, request_type, status, pageLimit, searchWord]
    );

    const defaultStatusParams = { id: '', status: '', reject_reason: '' };
    const [statusParams, setStatusParams] = useState(defaultStatusParams);
    const [approveStatusLoading, setApproveStatusLoading] = useState(false);

    const refresh = () => {
        getRequests(1, pageLimit, searchWord);
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
                setApproveStatusLoading(true);
                await axios.post(`/requests/response/${id}`, { status: values });
                setApproveStatusLoading(false);
                popup?.current.close();
                refresh();
            }
        } catch {
            setApproveStatusLoading(false);
            popup?.current.close();
            refresh();
        }
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
        old_id: '',
        new_id: '',
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
                    old_id: data.old_id,
                    new_id: data.new_id,
                    description: data.description || '',
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
            if (user?.role === 2) {
                axios.get(`/employees/dependent/information`).then(({ data }) => {
                    setType({
                        name: '',
                        data: {
                            Assets: data.free.asset,
                            Accessories: data.free.accessory,
                            Components: data.free.component,
                        },
                    });
                    setUserData({
                        assets: data.in_use.asset,
                        accessories: data.in_use.accessory,
                        components: data.in_use.component,
                    });
                });
            }
        } catch (error) {}
    }, [user?.role]);
    useEffect(() => {
        getRequests();
    }, [getRequests]);

    return (
        <div>
            <div className="p-5">
                <h1 className="mb-5 text-xl font-bold text-darkprimary">Requests</h1>
                <div className="mb-5 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="form-input mt-0 pr-10"
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
                                    className="text-black-dark absolute top-1/2 right-0 my-auto inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center hover:opacity-70"
                                    onClick={refresh}
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>
                        <div className="w-[200px]">
                            <select
                                name="status"
                                className="form-select mt-0"
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
                                className="form-select mt-0"
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

                        <div>
                            <MultipleSelect
                                list={typeData}
                                name="Types"
                                keyName="type"
                                selectedoptions={typeSelected}
                                setSelectedoptions={setTypeSelected}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                resetFilter();
                            }}
                            className="btn-secondary"
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
                                className="btn"
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
                                            <span>Employee Name</span>
                                            <IconUpDownArrow
                                                className={`${
                                                    order.order_field === 'user_name' && order.sort_order === 'desc'
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
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
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'request_type' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
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
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'type' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'old_name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('old_name')}
                                    >
                                        <span>Old Item</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'old_name' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'new_name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('new_name')}
                                    >
                                        <span>New Item</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'new_name' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
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
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'status' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
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
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'created_at' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th className="w-1 !text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={9} totalTd={10} tdWidth={60} />
                            ) : requests?.length !== 0 ? (
                                requests?.map((request) => {
                                    return (
                                        <tr key={request.id} className="bg-white">
                                            {user?.role === 1 && <td className="capitalize">{request?.user_name}</td>}
                                            <td className="capitalize">{request?.request_type}</td>
                                            <td className="capitalize">{request?.type}</td>
                                            <td className="max-w-[160px] truncate capitalize">
                                                {request?.old_name ? (
                                                    <Tippy content={request?.old_name}>
                                                        <span>{request?.old_name}</span>
                                                    </Tippy>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="max-w-[160px] truncate capitalize">
                                                {request?.new_name ? (
                                                    <Tippy content={request?.new_name}>
                                                        <span>{request?.new_name}</span>
                                                    </Tippy>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                {request?.description ? (
                                                    <Tippy content={request?.description}>
                                                        <div className="max-w-[160px] truncate">
                                                            <span>{request?.description}</span>
                                                        </div>
                                                    </Tippy>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="flex cursor-pointer items-center space-x-2 capitalize">
                                                <span className={`status status-${request?.status}`}>
                                                    {request?.status}
                                                </span>
                                            </td>

                                            <td className="max-w-[160px] truncate">
                                                {request?.reject_reason ? (
                                                    <Tippy content={request?.reject_reason}>
                                                        <span>{request?.reject_reason}</span>
                                                    </Tippy>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>

                                            <td>{helper?.getFormattedDate(request?.created_at)}</td>

                                            <td>
                                                <div className="flex items-center justify-end">
                                                    {user?.role === 1 && (
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

                                                    {(user?.role === 1 ||
                                                        (user?.role === 2 && request?.status === 'Pending')) && (
                                                        <button
                                                            type="button"
                                                            className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                            onClick={() => handleDelete(request?.id)}
                                                        >
                                                            <IconDelete />
                                                        </button>
                                                    )}
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
                        setPageLimit={(i) => getRequests(1, i)}
                        setCurrentPage={(i) => getRequests(i, pageLimit)}
                    />
                </div>
                <Modal ref={popup} title={'Update Status'}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={statusParams} onSubmit={updateStatus}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white py-[25px]">
                                        <div className="flex justify-center space-x-2">
                                            <ButtonField
                                                type="button"
                                                loading={approveStatusLoading}
                                                className="btn my-0 bg-[#c9f5cd] py-1"
                                                onClick={() => {
                                                    updateStatus('Approved', statusParams?.id);
                                                }}
                                            >
                                                Approve
                                            </ButtonField>
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
                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Request' : 'Send Request'} width="400px">
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ values, isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label mb-2.5">Request type</label>
                                                <label htmlFor="new" className="mr-5">
                                                    <Field
                                                        id="new"
                                                        type="radio"
                                                        name="request_type"
                                                        value="new"
                                                        className="form-radio h-5 w-5"
                                                    />
                                                    <span className="pl-2 align-middle">New</span>
                                                </label>
                                                <label htmlFor="replace">
                                                    <Field
                                                        id="replace"
                                                        type="radio"
                                                        name="request_type"
                                                        value="replace"
                                                        className="form-radio h-5 w-5"
                                                    />
                                                    <span className="pl-2 align-middle">Replace</span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="form-label mb-2.5">Type</label>
                                                <label htmlFor="asset" className="mr-5">
                                                    <Field
                                                        id="asset"
                                                        type="radio"
                                                        name="type"
                                                        value="asset"
                                                        className="form-radio h-5 w-5"
                                                        onClick={(e) => {
                                                            if (e.target.checked) {
                                                                setFieldValue('type', e.target.value);
                                                                handleType(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                    <span className="pl-2 align-middle">Asset</span>
                                                </label>

                                                <label htmlFor="component" className="mr-5">
                                                    <Field
                                                        id="component"
                                                        type="radio"
                                                        name="type"
                                                        value="component"
                                                        className="form-radio h-5 w-5"
                                                        onClick={(e) => {
                                                            if (e.target.checked) {
                                                                setFieldValue('type', e.target.value);
                                                                handleType(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                    <span className="pl-2 align-middle">Component</span>
                                                </label>

                                                <label htmlFor="accessory" className="mr-5">
                                                    <Field
                                                        id="accessory"
                                                        type="radio"
                                                        name="type"
                                                        value="accessory"
                                                        className="form-radio h-5 w-5"
                                                        onClick={(e) => {
                                                            if (e.target.checked) {
                                                                setFieldValue('type', e.target.value);
                                                                handleType(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                    <span className="pl-2 align-middle">Accessory</span>
                                                </label>
                                            </div>
                                            {Type?.name && (
                                                <>
                                                    {values.request_type === 'replace' && (
                                                        <>
                                                            <div>
                                                                <label className="form-label">Old {Type?.name}</label>
                                                                <div className="relative mt-[9px]">
                                                                    <Field name="old_id">
                                                                        {({ field, form }) => {
                                                                            return (
                                                                                <SelectBox
                                                                                    list={
                                                                                        userData[
                                                                                            Type?.name.toLowerCase()
                                                                                        ]
                                                                                    }
                                                                                    name={`Select ${Type?.name} name`}
                                                                                    keyName="name"
                                                                                    defaultValue={field?.value}
                                                                                    onChange={(value) =>
                                                                                        form.setFieldValue(
                                                                                            field.name,
                                                                                            value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="form-label">
                                                                    New&nbsp;{Type?.name}
                                                                </label>

                                                                <div className="relative mt-[9px]">
                                                                    <Field name="new_id">
                                                                        {({ field, form }) => {
                                                                            return (
                                                                                <SelectBox
                                                                                    list={Type?.data[Type?.name]}
                                                                                    name={`Select ${Type?.name} name`}
                                                                                    keyName="name"
                                                                                    defaultValue={field?.value}
                                                                                    onChange={(value) =>
                                                                                        form.setFieldValue(
                                                                                            field.name,
                                                                                            value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}

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
                                        <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px]">
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
