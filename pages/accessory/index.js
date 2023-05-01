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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const Accessory = (props) => {
    const Modal = useRef();

    const [accessorys, setAccessorys] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const getAccessorys = useCallback((page = 1, limit = 10) => {
        setIsLoading(true);
        axios.get(`/seller`).then(({ data }) => {
            setSellers(data.data);
        });
        axios.get(`/model`).then(({ data }) => {
            setModels(data.data);
        });
        axios.get(`/brand`).then(({ data }) => {
            setBrands(data.data);
        });
        axios.get(`/accessory?page=${page}&limit=${limit}`).then(({ data }) => {
            setAccessorys(data.data);
            setTotalRecords(data.meta.total);
            setTotalPages(data.meta.last_page);
            setIsLoading(false);
        });
    }, []);

    const defaultParams = {
        id: '',
        seller_id: '',
        accessories_name: '',
        serial_number: '',
        description: '',
        purchase_date: '',
        quantity: '',
        purchase_cost: '',
        warranty_expiry_date: '',
        model_id: '',
        brand_id: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getAccessorys(currentPage, pageLimit);
    };

    const formHandler = async (values) => {
        try {
            if (params?.id) {
                await axios.post(`/accessory/${params?.id}`, values);
            } else {
                await axios.post('/accessory', values);
            }
            Modal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (obj) => {
        setParams({
            id: obj.id,
            seller_id: obj.seller_id,
            accessories_name: obj.accessories_name,
            serial_number: obj.serial_number,
            description: obj.description,
            purchase_date: obj.purchase_date,
            quantity: obj.quantity,
            purchase_cost: obj.purchase_cost,
            warranty_expiry_date: obj.warranty_expiry_date,
            model_id: obj.model_id,
            brand_id: obj.brand_id,
        });
        Modal?.current?.open();
    };

    const handleDelete = async (id) => {
        await axios.post(`/accessory/${id}/delete`);
        refresh();
    };

    useEffect(() => {
        getAccessorys(currentPage, pageLimit);
    }, [getAccessorys, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl">accessory</h1>
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
                            add accessory
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
                                        <span>Serial number</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Name</span>
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
                                        <span>Purchase date</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Quantity</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Purchase cost</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Warranty expiry</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Seller</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Model</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Brand</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={12} totalTd={12} tdWidth={60} />
                            ) : accessorys?.length !== 0 ? (
                                accessorys?.map((accessory) => {
                                    return (
                                        <tr key={accessory.id} className="bg-white">
                                            <td>
                                                <input type="checkbox" className="form-checkbox" />
                                            </td>

                                            <td>{accessory?.serial_number}</td>
                                            <td>{accessory?.accessories_name}</td>
                                            <td>{helper.trancateString(accessory?.description)}</td>
                                            <td>{helper?.getFormattedDate(accessory?.purchase_date)}</td>
                                            <td>{accessory?.quantity}</td>
                                            <td>{accessory?.purchase_cost}</td>
                                            <td>{helper?.getFormattedDate(accessory?.warranty_expiry_date)}</td>
                                            <td>{sellers.find(item => item.id === accessory?.seller_id).name}</td>
                                            <td>{models.find(item => item.id === accessory?.model_id).model_name}</td>
                                            <td>{brands.find(item => item.id === accessory?.brand_id).brand_name}</td>

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
                                                            handleEdit(accessory);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(accessory?.id)}
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
                                    <td colSpan={12}>No data is available.</td>
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
                        data={accessorys}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <CommonSideModal ref={Modal}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <h2 className="text-base font-semibold leading-7">
                                {params?.id ? 'Edit' : 'Add'} accessory
                            </h2>

                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white p-[25px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Name</label>

                                                <Field
                                                    name="accessories_name"
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
                                            <div>
                                                <label className="form-label">Purchase date</label>

                                                <Flatpickr
                                                    name="purchase_date"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    onChange={(date) => setFieldValue('purchase_date', helper.getFormattedDate2(date[0]))}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">quantity</label>

                                                <Field
                                                    name="quantity"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="quantity"
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Purchase cost</label>

                                                <Field
                                                    name="purchase_cost"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="cost"
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Warranty expiry date</label>

                                                <Flatpickr
                                                    name="warranty_expiry_date"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    onChange={(date) => {
                                                        setFieldValue('warranty_expiry_date', helper.getFormattedDate2(date[0]));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">seller</label>

                                                <Field
                                                    as="select"
                                                    name="seller_id"
                                                    className="form-select rounded-l-none"
                                                    placeholder=""
                                                >
                                                    <option value="">select seller name</option>
                                                    {sellers?.map((seller) => {
                                                        return (
                                                            <option key={seller.id} value={seller.id}>
                                                                {seller.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Field>
                                            </div>
                                            <div>
                                                <label className="form-label">Model</label>

                                                <Field
                                                    as="select"
                                                    name="model_id"
                                                    className="form-select rounded-l-none"
                                                    placeholder=""
                                                >
                                                    <option value="">select model name</option>
                                                    {models?.map((model) => {
                                                        return (
                                                            <option key={model.id} value={model.id}>
                                                                {model.model_name}
                                                            </option>
                                                        );
                                                    })}
                                                </Field>
                                            </div>
                                            <div>
                                                <label className="form-label">Brand</label>

                                                <Field
                                                    as="select"
                                                    name="brand_id"
                                                    className="form-select rounded-l-none"
                                                    placeholder=""
                                                >
                                                    <option value="">select Brand name</option>
                                                    {brands?.map((brand) => {
                                                        return (
                                                            <option key={brand.id} value={brand.id}>
                                                                {brand.brand_name}
                                                            </option>
                                                        );
                                                    })}
                                                </Field>
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

export default Accessory;

Accessory.middleware = {
    auth: true,
    verify: true,
};
