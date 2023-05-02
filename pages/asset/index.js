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
import MultipleSelect from '@/components/MultipleSelect';

const Asset = () => {
    const Modal = useRef();

    const [assets, setAssets] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedModel, setSelectedModel] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState([]);

    const getAssets = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/asset`, {
                    params: {
                        filter: searchWord,
                        page: page,
                        limit: limit,
                        brand_id: selectedBrand.length === 0 ? '' : selectedBrand,
                        model_id: selectedModel.length === 0 ? '' : selectedModel,
                        seller_id: selectedSeller.length === 0 ? '' : selectedSeller,
                    },
                })
                .then(({ data }) => {
                    setAssets(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [selectedBrand, selectedModel, selectedSeller]
    );

    const defaultParams = {
        id: '',
        seller_id: '',
        asset_name: '',
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
        getAssets(currentPage, pageLimit, searchWord);
    };

    const formHandler = async (values) => {
        try {
            if (params?.id) {
                await axios.post(`/asset/${params?.id}`, values);
            } else {
                await axios.post('/asset', values);
            }
            Modal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (obj) => {
        setParams({
            id: obj.id,
            seller_id: obj.seller_id,
            asset_name: obj.asset_name,
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
        let confirmation = confirm('are you sure want to delete');
        if (confirmation) {
            await axios.post(`/asset/${id}/delete`);
            refresh();
        }
    };
    useEffect(() => {
        axios.get(`/seller`).then(({ data }) => {
            setSellers(data.data);
        });
        axios.get(`/model`).then(({ data }) => {
            setModels(data.data);
        });
        axios.get(`/brand`).then(({ data }) => {
            setBrands(data.data);
        });
    }, []);

    useEffect(() => {
        getAssets(currentPage, pageLimit);
    }, [getAssets, currentPage, pageLimit]);

    return (
        <div className="p-5">
            <h2 className="text-xl">asset</h2>
            <div className="mb-5 text-right">
                <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={brands}
                            name="brand"
                            keyName="brand_name"
                            selectedoptions={selectedBrand}
                            setSelectedoptions={setSelectedBrand}
                        />
                    </div>
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={models}
                            name="model"
                            keyName="model_name"
                            selectedoptions={selectedModel}
                            setSelectedoptions={setSelectedModel}
                        />
                    </div>
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={sellers}
                            name="seller"
                            keyName="name"
                            selectedoptions={selectedSeller}
                            setSelectedoptions={setSelectedSeller}
                        />
                    </div>

                    <div className="w-full flex-none md:max-w-[240px]">
                        <div className="relative">
                            <input
                                type="text"
                                className="form-input pr-10"
                                placeholder="Search..."
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
                            setParams(defaultParams), Modal?.current?.open();
                        }}
                        className="btn mb-0 mt-2"
                    >
                        add asset
                    </button>
                </div>
            </div>
            <div className="main-table overflow-auto">
                <table className="w-full table-auto">
                    <thead className="bg-lightblue1">
                        <tr>
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
                            <TableLoadnig totalTr={11} totalTd={11} tdWidth={60} />
                        ) : assets?.length !== 0 ? (
                            assets?.map((asset) => {
                                return (
                                    <tr key={asset.id} className="bg-white">
                                        <td>{asset?.serial_number}</td>
                                        <td>{asset?.asset_name}</td>
                                        <td>{helper.trancateString(asset?.description)}</td>
                                        <td>{helper?.getFormattedDate(asset?.purchase_date)}</td>
                                        <td>{asset?.quantity}</td>
                                        <td>{asset?.purchase_cost}</td>
                                        <td>{helper?.getFormattedDate(asset?.warranty_expiry_date)}</td>
                                        <td>{sellers?.find((item) => item.id === asset?.seller_id)?.name}</td>
                                        <td>{models?.find((item) => item.id === asset?.model_id)?.model_name}</td>
                                        <td>{brands?.find((item) => item.id === asset?.brand_id)?.brand_name}</td>

                                        <td>
                                            <div className="flex">
                                                <button
                                                    type="button"
                                                    className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                    onClick={() => {
                                                        handleEdit(asset);
                                                    }}
                                                >
                                                    <IconEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                    onClick={() => handleDelete(asset?.id)}
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
                                <td colSpan={11}>No data is available.</td>
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
                    data={assets}
                    totalRecords={totalRecords}
                    isLoading={isLoading}
                    setPageLimit={setPageLimit}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <CommonSideModal ref={Modal}>
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <h2 className="text-base font-semibold leading-7">{params?.id ? 'Edit' : 'Add'} asset</h2>

                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full space-y-5  bg-white p-[25px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Name</label>

                                            <Field
                                                name="asset_name"
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
                                                options={{
                                                    defaultDate: [helper.getFormattedDate2(params.purchase_date)],
                                                }}
                                                onChange={(date) =>
                                                    setFieldValue('purchase_date', helper.getFormattedDate2(date[0]))
                                                }
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
                                                options={{
                                                    defaultDate: [
                                                        helper.getFormattedDate2(params.warranty_expiry_date),
                                                    ],
                                                }}
                                                onChange={(date) => {
                                                    setFieldValue(
                                                        'warranty_expiry_date',
                                                        helper.getFormattedDate2(date[0])
                                                    );
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
                                        <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
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
    );
};

export default Asset;

Asset.middleware = {
    auth: true,
    verify: true,
};
